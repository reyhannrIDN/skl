<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\ProjectSubmission;
use App\Models\SubmissionFile;
use App\Models\ProjectCategory;
use App\Models\ProjectRequirement;
use App\Services\FileUploadService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubmissionController extends Controller
{
    protected FileUploadService $fileService;

    public function __construct(FileUploadService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function getCategories(Request $request)
    {
        $user = $request->user();
        
        // Get IDs of groups this student belongs to
        $groupIds = DB::table('student_group_user')
            ->where('user_id', $user->id)
            ->pluck('student_group_id')
            ->toArray();

        // Get Wali Kelas IDs for these groups
        $waliKelasIds = DB::table('student_groups')
            ->whereIn('id', $groupIds)
            ->pluck('wali_kelas_id')
            ->toArray();
            

        // Get other teachers assigned to these groups
        $otherTeacherIds = DB::table('class_teacher')
            ->whereIn('student_group_id', $groupIds)
            ->pluck('user_id')
            ->toArray();

        $allTeacherIds = array_unique(array_merge($waliKelasIds, $otherTeacherIds));

        // Get categories that are managed by these teachers
        $categories = ProjectCategory::with([
            'guru:id,name,specialty',
            'requirements' => function($q) use ($allTeacherIds) {
                // Include standard requirements
                // AND teacher-specific ones for any teacher assigned to the student's group
                $q->whereNull('teacher_id')->orWhereIn('teacher_id', $allTeacherIds);
            },
            'submissions' => function($q) use ($user) {
                $q->where('user_id', $user->id);
            }
        ])
            ->whereIn('guru_id', $allTeacherIds)
            ->where('is_active', true)
            ->get()
            ->map(function($cat) {
                $latestSub = $cat->submissions->first();
                $cat->user_submission = $latestSub ? [
                    'id' => $latestSub->id,
                    'slug' => $latestSub->slug,
                    'status' => $latestSub->status,
                    'submitted_at' => $latestSub->submitted_at,
                ] : null;
                // remove full submissions list to keep response clean
                unset($cat->submissions);
                return $cat;
            });

        return response()->json(['categories' => $categories]);
    }

    public function my(Request $request)
    {
        $submissions = $request->user()->submissions()
            ->with(['files.requirement', 'checklistReviews', 'reviewer:id,name', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['submissions' => $submissions]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer|min:1|exists:project_categories,id',
            'judul_project' => 'sometimes|nullable|string|max:255',
            'deskripsi_project' => 'nullable|string',
            'teknologi_digunakan' => 'nullable|array',
            'nama_pembimbing' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,submitted',
        ]);

        $category = ProjectCategory::with('requirements')->findOrFail($request->category_id);

        $submissionResult = DB::transaction(function () use ($request, $category) {
            $standardFields = ['judul_project', 'deskripsi_project', 'nama_pembimbing', 'teknologi_digunakan'];
            $submissionData = [
                'user_id' => $request->user()->id,
                'category_id' => $category->id,
                'judul_project' => $request->judul_project ?? ($category->name . ' - ' . $request->user()->name),
                'deskripsi_project' => $request->deskripsi_project,
                'teknologi_digunakan' => $request->teknologi_digunakan,
                'nama_pembimbing' => $request->nama_pembimbing,
                'status' => $request->status ?? 'draft',
                'submitted_at' => $request->status === 'submitted' ? now() : null,
            ];

            // If a requirement has a slug matching a standard field, use its value
            foreach ($category->requirements as $requirement) {
                if (in_array($requirement->slug, $standardFields) && $request->has($requirement->slug)) {
                    $submissionData[$requirement->slug] = $request->input($requirement->slug);
                }
            }

            $submission = ProjectSubmission::create($submissionData);

            foreach ($category->requirements as $requirement) {
                if ($requirement->type === 'file' || $requirement->type === 'local_file') {
                    if ($request->hasFile($requirement->slug)) {
                        $files = is_array($request->file($requirement->slug)) ? $request->file($requirement->slug) : [$request->file($requirement->slug)];
                        foreach ($files as $file) {
                            $fileData = $this->fileService->upload($file, $requirement->slug, $submission->id);
                            SubmissionFile::create(array_merge($fileData, [
                                'submission_id' => $submission->id,
                                'requirement_id' => $requirement->id,
                                'file_type' => $requirement->slug,
                            ]));
                        }
                    }
                } else {
                    // Handle link, url, text or drive_file
                    if ($request->filled($requirement->slug)) {
                        $value = $request->input($requirement->slug);
                        SubmissionFile::create([
                            'submission_id' => $submission->id,
                            'requirement_id' => $requirement->id,
                            'file_type' => $requirement->slug,
                            'file_path' => ($requirement->type === 'text' || $requirement->type === 'drive_file') ? null : $value, 
                            'link_url' => ($requirement->type === 'url' || $requirement->type === 'link' || $requirement->type === 'drive_file') ? $value : null,
                            'file_name' => $requirement->label,
                            'mime_type' => $requirement->type === 'text' ? 'text/plain' : ($requirement->type === 'url' || $requirement->type === 'link' ? 'text/url' : 'application/vnd.google-apps.file'),
                            'metadata' => $requirement->type === 'text' ? ['content' => $value] : null,
                        ]);
                    }
                }
            }

            return $submission;
        });

        // Send notifications outside the transaction to prevent 500 errors from breaking submission
        try {
            if ($request->status === 'submitted') {
                NotificationService::notifyProjectTeachers(
                    $submissionResult,
                    'Submission Baru',
                    "Submission baru dari {$request->user()->name} - {$submissionResult->judul_project}"
                );
                Log::info("Notification sent for new submission: {$submissionResult->judul_project}"); // Changed from NotificationService::logActivity
            }
        } catch (\Exception $e) {
            Log::error("Notification failed: " . $e->getMessage());
        }

        return response()->json([
            'message' => $request->status === 'submitted' ? 'Project berhasil dikirim!' : 'Draft berhasil disimpan!',
            'submission' => $submissionResult->load(['files.requirement', 'category'])
        ]);
    }

    public function show(Request $request, ProjectSubmission $submission)
    {
        if ($submission->user_id !== $request->user()->id) {
            abort(403);
        }
        $submission->load(['files.requirement', 'checklistReviews.guru:id,name', 'reviewer:id,name', 'user:id,name,kelas,nis']);

        return response()->json(['submission' => $submission]);
    }

    public function update(Request $request, ProjectSubmission $submission)
    {
        if ($submission->user_id !== $request->user()->id) {
            abort(403);
        }

        if (!$submission->isEditable()) {
            return response()->json(['message' => 'Submission tidak dapat diedit.'], 403);
        }

        $request->validate([
            'judul_project' => 'sometimes|string|max:255',
            'deskripsi_project' => 'nullable|string',
            'teknologi_digunakan' => 'nullable|array',
            'nama_pembimbing' => 'nullable|string|max:255',
            'status' => 'nullable|in:draft,submitted',
        ]);

        $standardFields = ['judul_project', 'deskripsi_project', 'nama_pembimbing', 'teknologi_digunakan', 'status'];
        $updateData = $request->only($standardFields);

        $category = $submission->category()->with('requirements')->first();
        if ($category) {
            foreach ($category->requirements as $requirement) {
                if (in_array($requirement->slug, $standardFields) && $request->has($requirement->slug)) {
                    $updateData[$requirement->slug] = $request->input($requirement->slug);
                }
            }
        }

        $submission->update($updateData);

        if ($request->status === 'submitted') {
            $submission->update(['submitted_at' => now()]);
            NotificationService::notifyProjectTeachers(
                $submission,
                'Update Submission',
                "Submission \"{$submission->judul_project}\" telah diperbarui oleh {$request->user()->name}."
            );
        }

        $category = $submission->category()->with('requirements')->first();

        if ($category) {
            foreach ($category->requirements as $requirement) {
                if ($requirement->type === 'file' || $requirement->type === 'local_file') {
                    if ($request->hasFile($requirement->slug)) {
                        // Delete old files for this requirement if you want to replace them, 
                        // or just keep adding. Let's keep adding for now like the store logic.
                        $files = is_array($request->file($requirement->slug)) ? $request->file($requirement->slug) : [$request->file($requirement->slug)];
                        foreach ($files as $file) {
                            $fileData = $this->fileService->upload($file, $requirement->slug, $submission->id);
                            SubmissionFile::create(array_merge($fileData, [
                                'submission_id' => $submission->id,
                                'requirement_id' => $requirement->id,
                                'file_type' => $requirement->slug,
                            ]));
                        }
                    }
                } else {
                    if ($request->filled($requirement->slug)) {
                        $value = $request->input($requirement->slug);
                        SubmissionFile::updateOrCreate(
                            ['submission_id' => $submission->id, 'requirement_id' => $requirement->id],
                            [
                                'file_type' => $requirement->slug,
                                'file_path' => $requirement->type === 'text' ? null : $value,
                                'link_url' => ($requirement->type === 'url' || $requirement->type === 'link') ? $value : null,
                                'file_name' => $requirement->label,
                                'mime_type' => $requirement->type === 'text' ? 'text/plain' : ($requirement->type === 'url' ? 'text/url' : 'application/vnd.google-apps.file'),
                            ]
                        );
                    }
                }
            }
        }

        NotificationService::logActivity('update_submission', "Updated submission: {$submission->judul_project}");

        return response()->json([
            'message' => 'Submission berhasil diperbarui',
            'submission' => $submission->load('files'),
        ]);
    }

    public function destroy(Request $request, ProjectSubmission $submission)
    {
        if ($submission->user_id !== $request->user()->id) {
            abort(403);
        }

        if (!$submission->isDeletable()) {
            return response()->json(['message' => 'Hanya submission draft yang dapat dihapus.'], 403);
        }

        // Delete files from storage
        foreach ($submission->files as $file) {
            $this->fileService->delete($file->file_path);
        }

        $submission->delete();
        NotificationService::logActivity('delete_submission', "Deleted draft submission: {$submission->judul_project}");

        return response()->json(['message' => 'Submission berhasil dihapus']);
    }

    public function uploadFiles(Request $request, ProjectSubmission $submission)
    {
        if ($submission->user_id !== $request->user()->id) {
            abort(403);
        }

        if (!$submission->isEditable()) {
            return response()->json(['message' => 'Submission tidak dapat diedit.'], 403);
        }

        $request->validate([
            'file_type' => 'required|in:poster,screenshot,apk,source_zip,source_aia,kodular_aia,video',
            'file' => 'required|file',
        ]);

        $errors = $this->fileService->validateFile($request->file('file'), $request->file_type);
        if (!empty($errors)) {
            return response()->json(['message' => 'Validasi file gagal', 'errors' => $errors], 422);
        }

        $fileData = $this->fileService->upload($request->file('file'), $request->file_type, $submission->id);
        $submissionFile = SubmissionFile::create(array_merge($fileData, [
            'submission_id' => $submission->id,
            'file_type' => $request->file_type,
        ]));

        return response()->json(['message' => 'File berhasil diupload', 'file' => $submissionFile], 201);
    }

    public function deleteFile(Request $request, ProjectSubmission $submission, $fileId)
    {
        if ($submission->user_id !== $request->user()->id) {
            abort(403);
        }

        if (!$submission->isEditable()) {
            return response()->json(['message' => 'Submission tidak dapat diedit.'], 403);
        }

        $file = SubmissionFile::where('submission_id', $submission->id)->findOrFail($fileId);
        $this->fileService->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File berhasil dihapus']);
    }
}
