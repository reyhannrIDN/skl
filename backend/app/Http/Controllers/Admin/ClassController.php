<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassController extends Controller
{
    public function index()
    {
        $classes = StudentGroup::with(['waliKelas', 'teachers'])
            ->withCount('students')
            ->get();

        return response()->json([
            'classes' => $classes
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'wali_kelas_id' => 'required|exists:users,id',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:users,id',
        ]);

        return DB::transaction(function () use ($validated) {
            $class = StudentGroup::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'wali_kelas_id' => $validated['wali_kelas_id'],
            ]);

            if (!empty($validated['teacher_ids'])) {
                $class->teachers()->sync($validated['teacher_ids']);
            }

            return response()->json([
                'message' => 'Kelas berhasil dibuat',
                'class' => $class->load(['waliKelas', 'teachers'])
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $class = StudentGroup::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'wali_kelas_id' => 'required|exists:users,id',
            'teacher_ids' => 'nullable|array',
            'teacher_ids.*' => 'exists:users,id',
        ]);

        return DB::transaction(function () use ($validated, $class) {
            $class->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'wali_kelas_id' => $validated['wali_kelas_id'],
            ]);

            $class->teachers()->sync($validated['teacher_ids'] ?? []);

            return response()->json([
                'message' => 'Kelas berhasil diperbarui',
                'class' => $class->load(['waliKelas', 'teachers'])
            ]);
        });
    }

    public function destroy($id)
    {
        $class = StudentGroup::findOrFail($id);
        $class->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus'
        ]);
    }

    public function getEligibleTeachers()
    {
        $teachers = User::where('role', 'guru')->get(['id', 'name', 'email']);
        return response()->json(['teachers' => $teachers]);
    }
}
