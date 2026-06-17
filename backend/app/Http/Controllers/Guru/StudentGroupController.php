<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentGroupController extends Controller
{
    public function index(Request $request)
    {
        $groups = $request->user()->waliKelasGroups()->withCount('students')->get();
        return response()->json(['groups' => $groups]);
    }

    public function myClass(Request $request)
    {
        $group = $request->user()->waliKelasGroups()->with('students')->first();
        return response()->json(['group' => $group]);
    }

    public function store(Request $request)
    {
        // Restricted to Admin role in ClassController
        return response()->json(['message' => 'Hanya Admin yang dapat membuat kelas.'], 403);
    }

    public function show($id, Request $request)
    {
        $group = $request->user()->managedGroups()->with('students')->findOrFail($id);
        return response()->json(['group' => $group]);
    }

    public function update(Request $request, $id)
    {
        $group = $request->user()->waliKelasGroups()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
        ]);

        $group->update($validated);

        return response()->json([
            'message' => 'Grup berhasil diupdate',
            'group' => $group
        ]);
    }

    public function destroy($id, Request $request)
    {
        $group = $request->user()->waliKelasGroups()->findOrFail($id);
        $group->delete();

        return response()->json(['message' => 'Grup berhasil dihapus']);
    }

    public function addStudents(Request $request, $id)
    {
        $group = $request->user()->waliKelasGroups()->findOrFail($id);
        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id'
        ]);

        $group->students()->syncWithoutDetaching($validated['student_ids']);

        return response()->json(['message' => 'Siswa berhasil ditambahkan ke grup']);
    }

    public function removeStudent(Request $request, $id, $studentId)
    {
        $group = $request->user()->waliKelasGroups()->findOrFail($id);
        $group->students()->detach($studentId);

        return response()->json(['message' => 'Siswa berhasil dihapus dari grup']);
    }

    public function updateStudentDetail(Request $request, $studentId)
    {
        $student = User::where('role', 'siswa')->findOrFail($studentId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nis' => 'nullable|string|max:20',
            'kelas' => 'nullable|string|max:50',
            'email' => 'required|email|unique:users,email,' . $studentId,
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Detail siswa berhasil diperbarui',
            'student' => $student
        ]);
    }

    public function availableStudents(Request $request)
    {
        // Get students not already in another group (optional logic, but let's just get all role=siswa for now)
        $students = User::where('role', 'siswa')->get(['id', 'name', 'nis', 'kelas']);
        return response()->json(['students' => $students]);
    }
}
