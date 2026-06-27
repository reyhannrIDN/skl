<?php

namespace App\Http\Controllers\Idn;

use App\Http\Controllers\Controller;
use App\Models\IdnStudent;
use App\Models\IdnSchoolVisit;
use Illuminate\Http\Request;

class IdnController extends Controller
{
    public function dashboard()
    {
        $totalStudents = IdnStudent::where('is_active', true)->count();
        $totalSchools = IdnSchoolVisit::distinct('school_name')->count('school_name');
        $totalTeams = IdnSchoolVisit::distinct('team_name')->count('team_name');

        $schools = IdnSchoolVisit::selectRaw('school_name, SUM(total_audience) as total_audience, COUNT(*) as visit_count')
            ->groupBy('school_name')
            ->orderBy('school_name')
            ->get();

        $recentStudents = IdnStudent::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $recentVisits = IdnSchoolVisit::orderBy('visit_date', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'total_students' => $totalStudents,
            'total_schools' => $totalSchools,
            'total_teams' => $totalTeams,
            'schools' => $schools,
            'recent_students' => $recentStudents,
            'recent_visits' => $recentVisits,
        ]);
    }

    // ─── Students CRUD ─────────────────────────────────────────

    public function students()
    {
        $students = IdnStudent::orderBy('created_at', 'desc')->get();
        return response()->json(['students' => $students]);
    }

    public function storeStudent(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nis' => 'nullable|string|max:50',
            'school' => 'nullable|string|max:255',
            'kelas' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $student = IdnStudent::create($data);

        return response()->json(['message' => 'Siswa berhasil ditambahkan', 'student' => $student], 201);
    }

    public function updateStudent(Request $request, IdnStudent $student)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'nis' => 'nullable|string|max:50',
            'school' => 'nullable|string|max:255',
            'kelas' => 'nullable|string|max:50',
            'is_active' => 'boolean',
        ]);

        $student->update($data);

        return response()->json(['message' => 'Siswa berhasil diperbarui', 'student' => $student]);
    }

    public function destroyStudent(IdnStudent $student)
    {
        $student->delete();
        return response()->json(['message' => 'Siswa berhasil dihapus']);
    }

    // ─── School Visits CRUD ────────────────────────────────────

    public function schoolVisits()
    {
        $visits = IdnSchoolVisit::orderBy('visit_date', 'desc')->get();
        return response()->json(['visits' => $visits]);
    }

    public function storeSchoolVisit(Request $request)
    {
        $data = $request->validate([
            'school_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'visit_date' => 'nullable|date',
            'team_name' => 'required|string|max:255',
            'team_members' => 'nullable|string',
            'total_audience' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $visit = IdnSchoolVisit::create($data);

        return response()->json(['message' => 'Kunjungan berhasil ditambahkan', 'visit' => $visit], 201);
    }

    public function updateSchoolVisit(Request $request, IdnSchoolVisit $visit)
    {
        $data = $request->validate([
            'school_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'visit_date' => 'nullable|date',
            'team_name' => 'required|string|max:255',
            'team_members' => 'nullable|string',
            'total_audience' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $visit->update($data);

        return response()->json(['message' => 'Kunjungan berhasil diperbarui', 'visit' => $visit]);
    }

    public function destroySchoolVisit(IdnSchoolVisit $visit)
    {
        $visit->delete();
        return response()->json(['message' => 'Kunjungan berhasil dihapus']);
    }
}
