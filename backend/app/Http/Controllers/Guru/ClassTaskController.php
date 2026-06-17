<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\ProjectRequirement;
use App\Models\StudentGroup;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClassTaskController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Fetch requirements defined by this guru (Wali Kelas)
        $requirements = ProjectRequirement::where('teacher_id', $user->id)
            ->with('category')
            ->get();

        return response()->json([
            'requirements' => $requirements
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'category_id' => 'required|exists:project_categories,id',
            'label' => 'required|string|max:255',
            'type' => 'required|in:file,url,text',
            'is_required' => 'required|boolean',
            'allowed_extensions' => 'nullable|string', // e.g. "pdf,doc,docx"
            'max_size_mb' => 'nullable|integer|min:1',
            'instructions' => 'nullable|string',
            'input_config' => 'nullable|array', // { placeholder: "...", help_text: "..." }
        ]);

        $requirement = ProjectRequirement::create([
            'category_id' => $validated['category_id'],
            'teacher_id' => $user->id,
            'label' => $validated['label'],
            'slug' => Str::slug($validated['label']) . '-' . Str::random(5),
            'type' => $validated['type'],
            'is_required' => $validated['is_required'],
            'allowed_extensions' => $validated['allowed_extensions'],
            'max_size_mb' => $validated['max_size_mb'] ?? 10,
            'instructions' => $validated['instructions'],
            'input_config' => $validated['input_config'],
        ]);

        // Notify students
        try {
            NotificationService::notifyStudents(
                $user->id,
                'Informasi Terbaru',
                "Guru {$user->name} telah membagikan informasi/ketentuan baru: \"{$requirement->label}\". Silakan cek di dashboard Anda.",
                'info'
            );
        } catch (\Exception $e) {
            // Silently fail if notification fails
        }

        return response()->json([
            'message' => 'Tugas/Requirement berhasil dibuat',
            'requirement' => $requirement
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $requirement = ProjectRequirement::where('teacher_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:file,url,text',
            'is_required' => 'required|boolean',
            'allowed_extensions' => 'nullable|string',
            'max_size_mb' => 'nullable|integer|min:1',
            'instructions' => 'nullable|string',
            'input_config' => 'nullable|array',
        ]);

        $requirement->update($validated);

        return response()->json([
            'message' => 'Tugas berhasil diperbarui',
            'requirement' => $requirement
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $requirement = ProjectRequirement::where('teacher_id', $user->id)->findOrFail($id);
        $requirement->delete();

        return response()->json([
            'message' => 'Tugas berhasil dihapus'
        ]);
    }
}
