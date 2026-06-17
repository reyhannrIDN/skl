<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ProjectCategory;
use Illuminate\Support\Facades\DB;

class PublicTrackerController extends Controller
{
    public function trackByNis(Request $request, $nis)
    {
        // Find the student
        $student = User::where('role', 'siswa')
            ->where('nis', $nis)
            ->where('is_active', true)
            ->first();

        if (!$student) {
            return response()->json([
                'message' => 'Siswa dengan NIS tersebut tidak ditemukan atau tidak aktif.'
            ], 404);
        }

        // Logic to find assigned categories for this student
        $groupIds = DB::table('student_group_user')
            ->where('user_id', $student->id)
            ->pluck('student_group_id')
            ->toArray();

        $waliKelasIds = DB::table('student_groups')
            ->whereIn('id', $groupIds)
            ->pluck('wali_kelas_id')
            ->toArray();

        $otherTeacherIds = DB::table('class_teacher')
            ->whereIn('student_group_id', $groupIds)
            ->pluck('user_id')
            ->toArray();

        $allTeacherIds = array_unique(array_merge($waliKelasIds, $otherTeacherIds));

        // Get Categories assigned to the student's class
        $categories = ProjectCategory::with([
            'guru:id,name',
            'submissions' => function($q) use ($student) {
                $q->where('user_id', $student->id);
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
                    'judul_project' => $latestSub->judul_project,
                    'submitted_at' => $latestSub->submitted_at,
                ] : null;
                unset($cat->submissions);
                return $cat;
            });

        // Get Submissions details including files for parents to see
        $submissions = $student->submissions()
            ->with(['category:id,name', 'files.requirement'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($sub) {
                return [
                    'id' => $sub->id,
                    'slug' => $sub->slug,
                    'judul_project' => $sub->judul_project,
                    'status' => $sub->status,
                    'submitted_at' => $sub->submitted_at,
                    'category' => $sub->category,
                    'files' => $sub->files->map(function($file) {
                        return [
                            'id' => $file->id,
                            'file_name' => $file->file_name,
                            'file_path' => $file->file_path,
                            'link_url' => $file->link_url,
                            'file_type' => $file->file_type,
                            'requirement' => $file->requirement ? $file->requirement->label : null
                        ];
                    }),
                ];
            });

        return response()->json([
            'student' => [
                'name' => $student->name,
                'nis' => $student->nis,
                'kelas' => $student->kelas,
                'avatar' => $student->avatar
            ],
            'categories' => $categories,
            'submissions' => $submissions
        ]);
    }
}
