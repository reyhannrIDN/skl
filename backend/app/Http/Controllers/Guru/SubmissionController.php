<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\ProjectSubmission;
use App\Models\ChecklistReview;
use App\Models\ProjectCategory;
use App\Models\User;
use App\Services\GoogleDriveValidator;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    protected array $checklistItems = [
        'Poster project sudah sesuai ketentuan',
        'Screenshot aplikasi cukup dan jelas',
        'File APK dapat diinstall dan berjalan normal',
        'Source code (ZIP/AIA) lengkap dan terorganisir',
        'File Kodular (AIA) dapat dibuka di Kodular',
        'Video demonstrasi menampilkan semua fitur utama',
        'Deskripsi project informatif dan sesuai',
        'Judul project sesuai dengan isi aplikasi',
        'Teknologi yang digunakan sesuai dengan kurikulum',
    ];

    public function index(Request $request)
    {
        $guruId = $request->user()->id;
        
        // Get IDs of students in groups managed by this guru (as Wali Kelas OR as a teacher in the class)
        $managedGroupIds = DB::table('student_groups')
            ->where('wali_kelas_id', $guruId)
            ->pluck('id')
            ->toArray();
            
        $teachingGroupIds = DB::table('class_teacher')
            ->where('user_id', $guruId)
            ->pluck('student_group_id')
            ->toArray();
            
        $allGroupIds = array_unique(array_merge($managedGroupIds, $teachingGroupIds));
        
        $managedStudentIds = DB::table('student_group_user')
            ->whereIn('student_group_id', $allGroupIds)
            ->pluck('user_id')
            ->toArray();

        // Get categories created by the guru OR categories matching the guru's specialty
        $specialty = $request->user()->specialty;
        $categoryQuery = ProjectCategory::query();
        
        if ($specialty) {
            $categoryQuery->whereHas('guru', function($q) use ($specialty) {
                $q->where('specialty', $specialty);
            });
        } else {
            $categoryQuery->where('guru_id', $guruId);
        }
        
        $categoryIds = $categoryQuery->pluck('id')->toArray();

        $query = ProjectSubmission::query()
            ->with(['user:id,name,kelas,nis', 'files', 'reviewer:id,name', 'category'])
            ->whereIn('status', ['submitted', 'under_review', 'revision', 'approved', 'skl_issued']);

        // Filter by managed students AND category specialty
        $query->whereIn('user_id', $managedStudentIds);
        
        if (!empty($categoryIds)) {
            $query->whereIn('category_id', $categoryIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('kelas')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('kelas', $request->kelas);
            });
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul_project', 'like', "%{$search}%")
                ->orWhereHas('user', function($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                });
            });
        }
        if ($request->filled('date_from')) {
            $query->where('submitted_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('submitted_at', '<=', $request->date_to);
        }

        $submissions = $query->orderBy('submitted_at', 'desc')->paginate($request->per_page ?? 20);

        return response()->json($submissions);
    }

    public function show(ProjectSubmission $submission)
    {
        $submission->load([
            'user:id,name,email,kelas,nis,phone',
            'files',
            'checklistReviews.guru:id,name',
            'reviewer:id,name',
            'category.requirements',
        ]);

        // Create checklist items if they don't exist yet
        if ($submission->checklistReviews->isEmpty()) {
            $this->initChecklist($submission, auth()->id());
            $submission->load('checklistReviews.guru:id,name');
        }

        return response()->json(['submission' => $submission]);
    }

    protected function initChecklist(ProjectSubmission $submission, int $guruId): void
    {
        $requirements = $submission->category->requirements;

        if ($requirements && $requirements->isNotEmpty()) {
            foreach ($requirements as $req) {
                ChecklistReview::create([
                    'submission_id' => $submission->id,
                    'guru_id' => $guruId,
                    'checklist_item' => $req->label,
                    'status' => 'pending',
                ]);
            }
        } else {
            // Fallback only if no requirements are defined
            foreach ($this->checklistItems as $item) {
                ChecklistReview::create([
                    'submission_id' => $submission->id,
                    'guru_id' => $guruId,
                    'checklist_item' => $item,
                    'status' => 'pending',
                ]);
            }
        }
    }

    public function review(Request $request, ProjectSubmission $submission)
    {

        if ($submission->is_locked) {
            return response()->json(['message' => 'Submission sudah terkunci.'], 403);
        }

        $request->validate([
            'checklist' => 'required|array',
            'checklist.*.id' => 'required|exists:checklist_reviews,id',
            'checklist.*.status' => 'required|in:pending,approved,rejected',
            'checklist.*.catatan' => 'nullable|string',
            'catatan_guru' => 'nullable|string',
            'status' => 'nullable|in:under_review,approved',
        ]);

        $submissionStatus = $request->status ?? 'under_review';

        $submission->update([
            'status' => $submissionStatus,
            'guru_reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
            'catatan_guru' => $request->catatan_guru,
        ]);

        foreach ($request->checklist as $item) {
            ChecklistReview::where('id', $item['id'])
                ->where('submission_id', $submission->id)
                ->update([
                    'status' => $item['status'],
                    'catatan' => $item['catatan'] ?? null,
                    'reviewed_at' => now(),
                    'guru_id' => $request->user()->id,
                ]);
        }

        NotificationService::logActivity('review_submission', "Reviewed submission: {$submission->judul_project}");

        return response()->json([
            'message' => 'Review berhasil disimpan',
            'submission' => $submission->load('checklistReviews'),
        ]);
    }

    public function updateChecklistItem(Request $request, ProjectSubmission $submission, $itemId)
    {

        if ($submission->is_locked) {
            return response()->json(['message' => 'Submission sudah terkunci.'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'catatan' => 'nullable|string',
        ]);

        $item = ChecklistReview::where('submission_id', $submission->id)->findOrFail($itemId);
        $item->update([
            'status' => $request->status,
            'catatan' => $request->catatan,
            'reviewed_at' => now(),
            'guru_id' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Checklist item updated', 'item' => $item]);
    }

    public function requestRevision(Request $request, ProjectSubmission $submission)
    {

        if ($submission->is_locked) {
            return response()->json(['message' => 'Submission sudah terkunci.'], 403);
        }

        $request->validate(['catatan_guru' => 'nullable|string']);

        $submission->update([
            'status' => 'revision',
            'guru_reviewer_id' => $request->user()->id,
            'reviewed_at' => now(),
            'catatan_guru' => $request->catatan_guru,
        ]);

        NotificationService::create(
            $submission->user_id,
            'Perlu Revisi',
            "Project Anda \"{$submission->judul_project}\" perlu direvisi. Lihat catatan dari guru.",
            'warning',
            $submission->id
        );

        NotificationService::logActivity('request_revision', "Requested revision for: {$submission->judul_project}");

        return response()->json(['message' => 'Revisi diminta', 'submission' => $submission]);
    }

    public function issueSkl(Request $request, ProjectSubmission $submission)
    {

        if ($submission->is_locked) {
            return response()->json(['message' => 'SKL sudah diterbitkan sebelumnya.'], 403);
        }

        $request->validate([
            'skl_drive_link' => 'required|url',
            'catatan_guru' => 'nullable|string',
        ]);

        if (!GoogleDriveValidator::isValid($request->skl_drive_link)) {
            return response()->json(['message' => 'Link Google Drive tidak valid.'], 422);
        }

        // Check all checklist items are approved
        $pendingCount = $submission->checklistReviews()->where('status', '!=', 'approved')->count();
        if ($pendingCount > 0) {
            return response()->json(['message' => 'Semua checklist harus disetujui sebelum menerbitkan SKL.'], 422);
        }

        $submission->update([
            'status' => 'skl_issued',
            'skl_drive_link' => $request->skl_drive_link,
            'skl_issued_at' => now(),
            'is_locked' => true,
            'guru_reviewer_id' => $request->user()->id,
            'catatan_guru' => $request->catatan_guru ?? $submission->catatan_guru,
        ]);

        NotificationService::create(
            $submission->user_id,
            '🎉 SKL Diterbitkan!',
            "SKL Anda untuk project \"{$submission->judul_project}\" telah diterbitkan! Klik untuk melihat.",
            'success',
            $submission->id
        );

        NotificationService::logActivity('issue_skl', "Issued SKL for: {$submission->judul_project}");

        return response()->json(['message' => 'SKL berhasil diterbitkan', 'submission' => $submission]);
    }

    public function statistics(Request $request)
    {
        $guruId = $request->user()->id;
        
        $managedGroupIds = DB::table('student_groups')->where('wali_kelas_id', $guruId)->pluck('id')->toArray();
        $teachingGroupIds = DB::table('class_teacher')->where('user_id', $guruId)->pluck('student_group_id')->toArray();
        $allGroupIds = array_unique(array_merge($managedGroupIds, $teachingGroupIds));
        
        $managedStudentIds = DB::table('student_group_user')->whereIn('student_group_id', $allGroupIds)->pluck('user_id')->toArray();
        
        $specialty = $request->user()->specialty;
        $categoryQuery = ProjectCategory::query();
        if ($specialty) {
            $categoryQuery->whereHas('guru', function($q) use ($specialty) {
                $q->where('specialty', $specialty);
            });
        } else {
            $categoryQuery->where('guru_id', $guruId);
        }
        $categoryIds = $categoryQuery->pluck('id')->toArray();

        $baseQuery = ProjectSubmission::query()
            ->whereIn('user_id', $managedStudentIds);

        if (!empty($categoryIds)) {
            $baseQuery->whereIn('category_id', $categoryIds);
        }

        return response()->json([
            'total' => (clone $baseQuery)->count(),
            'submitted' => (clone $baseQuery)->where('status', 'submitted')->count(),
            'under_review' => (clone $baseQuery)->where('status', 'under_review')->count(),
            'revision' => (clone $baseQuery)->where('status', 'revision')->count(),
            'approved' => (clone $baseQuery)->where('status', 'approved')->count(),
            'skl_issued' => (clone $baseQuery)->where('status', 'skl_issued')->count(),
        ]);
    }
}
