<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\ProjectCategory;
use App\Models\ProjectRequirement;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuruCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = ProjectCategory::where('guru_id', $request->user()->id)->with('requirements')->get();
        return response()->json(['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_kelas' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category = $request->user()->managedCategories()->create($validated);

        // Notify students
        try {
            NotificationService::notifyStudents(
                $request->user()->id,
                'Kategori Project Baru',
                "Guru {$request->user()->name} telah membuat kategori project baru: \"{$category->name}\". Silakan cek tugas Anda.",
                'info'
            );
        } catch (\Exception $e) {
            // Silently fail
        }

        return response()->json([
            'message' => 'Kategori berhasil dibuat',
            'category' => $category
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = ProjectCategory::where('guru_id', $request->user()->id)->findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'target_kelas' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Kategori berhasil diupdate',
            'category' => $category
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $category = ProjectCategory::where('guru_id', $request->user()->id)->findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }

    public function updateRequirements(Request $request, $id)
    {
        $category = ProjectCategory::where('guru_id', $request->user()->id)->findOrFail($id);
        
        $validated = $request->validate([
            'requirements' => 'required|array',
            'requirements.*.id' => 'nullable|exists:project_requirements,id',
            'requirements.*.label' => 'required|string|max:255',
            'requirements.*.type' => 'required|in:local_file,drive_file,link,text,url',
            'requirements.*.is_required' => 'boolean',
            'requirements.*.allowed_extensions' => 'nullable|string',
            'requirements.*.max_size_mb' => 'nullable|numeric',
        ]);

        // Keep track of IDs we saw to delete the missing ones
        $seenIds = [];

        foreach ($validated['requirements'] as $reqData) {
            $data = [
                'label' => $reqData['label'],
                'slug' => Str::slug($reqData['label']),
                'type' => $reqData['type'],
                'is_required' => $reqData['is_required'] ?? true,
                'allowed_extensions' => $reqData['allowed_extensions'] ?? null,
                'max_size_mb' => $reqData['max_size_mb'] ?? 5,
            ];

            if (!empty($reqData['id'])) {
                $requirement = $category->requirements()->find($reqData['id']);
                if ($requirement) {
                    $requirement->update($data);
                    $seenIds[] = $requirement->id;
                }
            } else {
                $newReq = $category->requirements()->create($data);
                $seenIds[] = $newReq->id;
            }
        }

        // Delete requirements no longer in the list
        $category->requirements()->whereNotIn('id', $seenIds)->delete();

        return response()->json([
            'message' => 'Requirement berhasil diperbarui',
            'requirements' => $category->requirements()->get()
        ]);
    }
}
