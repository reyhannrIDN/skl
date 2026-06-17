<?php

namespace App\Http\Controllers\Stats;

use App\Http\Controllers\Controller;
use App\Models\ProjectCategory;
use App\Models\ProjectRequirement;
use App\Models\ProjectSubmission;
use App\Models\StudentGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PerformanceController extends Controller
{
    public function getClasses(Request $request)
    {
        $user = $request->user();
        $query = StudentGroup::query();

        if ($user->role === 'guru') {
            // Get classes where guru is Wali Kelas OR a teacher
            $managedClassIds = StudentGroup::where('wali_kelas_id', $user->id)->pluck('id')->toArray();
            $teachingClassIds = DB::table('class_teacher')->where('user_id', $user->id)->pluck('student_group_id')->toArray();
            
            // For now, simpler inclusion if teacher has projects
            $hasProjects = DB::table('project_categories')
                ->where('guru_id', $user->id)
                ->where('is_active', true)
                ->exists();
                
            if ($hasProjects) {
                // If they have project categories, let them see all classes for now 
                // as there is no tingkat_kelas column to filter by.
                $allClassIds = StudentGroup::pluck('id')->toArray();
            } else {
                $allClassIds = array_unique(array_merge($managedClassIds, $teachingClassIds));
            }
            
            $query->whereIn('id', $allClassIds);
        }

        return response()->json(['classes' => $query->select('id', 'name')->get()]);
    }

    public function getCategories(Request $request)
    {
        // Admin or Guru can see all active categories for stats
        $categories = ProjectCategory::where('is_active', true)->get();
        return response()->json(['categories' => $categories]);
    }

    public function getPerformanceData(Request $request, $classId, $categoryId)
    {
        $class = StudentGroup::findOrFail($classId);
        $category = ProjectCategory::with('requirements')->findOrFail($categoryId);
        
        $students = $class->students()->select('users.id', 'users.name', 'users.nis')->get();
        $requirements = $category->requirements;
        
        if ($requirements->isEmpty()) {
            return response()->json([
                'summary' => ['total_students' => $students->count(), 'total_tasks' => 0, 'overall_completion_pct' => 0],
                'tasks' => [],
                'students' => []
            ]);
        }

        $studentIds = $students->pluck('id');
        
        // Get all submissions for this category and these students
        $submissions = ProjectSubmission::whereIn('user_id', $studentIds)
            ->where('category_id', $categoryId)
            ->with('files')
            ->get()
            ->keyBy('user_id');

        $requirementsData = [];
        foreach ($requirements as $req) {
            $requirementsData[$req->id] = [
                'id' => $req->id,
                'label' => $req->label,
                'slug' => $req->slug,
                'completed_count' => 0,
            ];
        }

        $studentProgress = [];
        $totalCompletedTasks = 0;
        
        foreach ($students as $student) {
            $submission = $submissions->get($student->id);
            $completedInSub = 0;
            $tasksStatus = [];
            
            foreach ($requirements as $req) {
                // Check if student has a file for this requirement
                $isFileSubmitted = false;
                if ($submission) {
                    $isFileSubmitted = $submission->files->contains('requirement_id', $req->id);
                }
                
                if ($isFileSubmitted) {
                    $completedInSub++;
                    $requirementsData[$req->id]['completed_count']++;
                    $tasksStatus[$req->slug] = 'done';
                } else {
                    $tasksStatus[$req->slug] = 'pending';
                }
            }
            
            $totalCompletedTasks += $completedInSub;
            $studentProgress[] = [
                'id' => $student->id,
                'name' => $student->name,
                'nis' => $student->nis,
                'kelas' => $student->kelas,
                'specialty' => $student->specialty,
                'completed_count' => $completedInSub,
                'total_tasks' => $requirements->count(),
                'completion_pct' => round(($completedInSub / $requirements->count()) * 100, 1),
                'tasks' => $tasksStatus
            ];
        }

        $totalExpectedTasks = $students->count() * $requirements->count();
        $overallPct = $totalExpectedTasks > 0 ? round(($totalCompletedTasks / $totalExpectedTasks) * 100, 1) : 0;

        // Finalize requirements stats
        $finalTasks = [];
        foreach ($requirementsData as $rd) {
            $rd['total_count'] = $students->count();
            $rd['completion_pct'] = $students->count() > 0 ? round(($rd['completed_count'] / $students->count()) * 100, 1) : 0;
            $finalTasks[] = $rd;
        }

        return response()->json([
            'summary' => [
                'class_name' => $class->name,
                'category_name' => $category->name,
                'total_students' => $students->count(),
                'total_tasks' => $requirements->count(),
                'completed_tasks_count' => $totalCompletedTasks,
                'expected_tasks_count' => $totalExpectedTasks,
                'overall_completion_pct' => $overallPct
            ],
            'tasks' => $finalTasks,
            'students' => $studentProgress
        ]);
    }

    public function getClassMonitoring(Request $request, $classId)
    {
        $user = $request->user();
        $class = StudentGroup::findOrFail($classId);
        
        // Get all active categories targeting this class (regardless of guru)
        $categories = ProjectCategory::with('guru:id,name,specialty')
            ->where('is_active', true)
            ->get();
            
        // Filter categories locally if target_kelas is set
        $targetKelas = (string)$class->tingkat_kelas;
        $categories = $categories->filter(function ($cat) use ($targetKelas) {
            if (!$cat->target_kelas || $cat->target_kelas === 'all') return true;
            $allowed = explode(',', $cat->target_kelas);
            return in_array($targetKelas, $allowed);
        })->values();
        
        $students = $class->students()->select('users.id', 'users.name', 'users.nis')->get();
        $studentIds = $students->pluck('id');

        // Apply fallback specialties to categories once
        foreach ($categories as $cat) {
            if ($cat->guru && empty($cat->guru->specialty)) {
                $name = strtolower($cat->name);
                if (str_contains($name, 'smart') || str_contains($name, 'portofolio') || str_contains($name, 'cv') || str_contains($name, 'web') || str_contains($name, 'app')) {
                    $cat->guru->specialty = 'IT';
                } elseif (str_contains($name, 'iqro') || str_contains($name, 'diniyah') || str_contains($name, 'bacaan')) {
                    $cat->guru->specialty = 'DINIYAH';
                } elseif (str_contains($name, 'english') || str_contains($name, 'speech') || str_contains($name, 'vocab')) {
                    $cat->guru->specialty = 'ENGLISH';
                } else {
                    $cat->guru->specialty = 'LAINNYA';
                }
            } elseif ($cat->guru) {
                $cat->guru->specialty = strtoupper($cat->guru->specialty);
            }
        }
        
        // Sort categories by specialty (IT, Diniyah, English, etc.)
        $categories = $categories->sortBy(function($cat) {
            $specialty = strtolower($cat->guru->specialty ?? 'zz');
            if ($specialty === 'it') return 'a';
            if ($specialty === 'diniyah') return 'b';
            if ($specialty === 'english') return 'c';
            return 'd' . $specialty;
        })->values();
        $studentIds = $students->pluck('id');
        
        // All submissions for these categories and students
        $submissions = ProjectSubmission::whereIn('user_id', $studentIds)
            ->whereIn('category_id', $categories->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $categoryStats = [];
        foreach ($categories as $cat) {
            $categoryStats[$cat->id] = [
                'id' => $cat->id,
                'name' => $cat->name,
                'completed_students' => 0,
            ];
        }

        $studentProgress = [];
        $totalCompletedSubmissions = 0;

        foreach ($students as $student) {
            $studentSubmissions = $submissions->get($student->id, collect());
            $catStatus = [];
            $completedCount = 0;

            foreach ($categories as $cat) {
                $sub = $studentSubmissions->where('category_id', $cat->id)->first();
                $isApproved = $sub && in_array($sub->status, ['approved', 'skl_issued']);
                $isUnderReview = $sub && in_array($sub->status, ['submitted', 'under_review']);
                
                if ($isApproved) {
                    $status = 'done';
                    $completedCount++;
                    $categoryStats[$cat->id]['completed_students']++;
                } elseif ($isUnderReview) {
                    $status = 'review';
                } else {
                    $status = 'pending';
                }
                
                $catStatus[$cat->id] = $status;
            }

            $totalCompletedSubmissions += $completedCount;
            $studentProgress[] = [
                'id' => $student->id,
                'name' => $student->name,
                'nis' => $student->nis,
                'kelas' => $student->kelas,
                'specialty' => $student->specialty,
                'completed_count' => $completedCount,
                'total_categories' => $categories->count(),
                'completion_pct' => $categories->count() > 0 ? round(($completedCount / $categories->count()) * 100, 1) : 0,
                'status_per_category' => $catStatus
            ];
        }

        $totalExpectedSubmissions = $students->count() * $categories->count();
        $overallPct = $totalExpectedSubmissions > 0 ? round(($totalCompletedSubmissions / $totalExpectedSubmissions) * 100, 1) : 0;

        // Finalize category data for chart
        $finalCategories = [];
        $specialtyStats = [];

        foreach ($categoryStats as $cs) {
            $cat = $categories->firstWhere('id', $cs['id']);
            $specialty = strtoupper($cat->guru->specialty ?? 'LAINNYA');
            
            $cs['total_students'] = $students->count();
            $cs['completion_pct'] = $students->count() > 0 ? round(($cs['completed_students'] / $students->count()) * 100, 1) : 0;
            $cs['specialty'] = $specialty;
            $finalCategories[] = $cs;

            if (!isset($specialtyStats[$specialty])) {
                $specialtyStats[$specialty] = [
                    'name' => $specialty,
                    'total_categories' => 0,
                    'completed_submissions' => 0,
                    'total_expected' => 0,
                ];
            }
            $specialtyStats[$specialty]['total_categories']++;
            $specialtyStats[$specialty]['completed_submissions'] += $cs['completed_students'];
            $specialtyStats[$specialty]['total_expected'] += $students->count();
        }

        $finalSpecialtyStats = [];
        $requiredSpecialties = ['IT', 'DINIYAH', 'ENGLISH'];
        
        foreach ($requiredSpecialties as $rs) {
            if (isset($specialtyStats[$rs])) {
                $ss = $specialtyStats[$rs];
                $ss['completion_pct'] = $ss['total_expected'] > 0 ? round(($ss['completed_submissions'] / $ss['total_expected']) * 100, 1) : 0;
                $finalSpecialtyStats[] = $ss;
                unset($specialtyStats[$rs]);
            } else {
                $finalSpecialtyStats[] = [
                    'name' => $rs,
                    'total_categories' => 0,
                    'completed_submissions' => 0,
                    'total_expected' => 0,
                    'completion_pct' => 0,
                ];
            }
        }

        // Add any other specialties that might exist
        foreach ($specialtyStats as $ss) {
            $ss['completion_pct'] = $ss['total_expected'] > 0 ? round(($ss['completed_submissions'] / $ss['total_expected']) * 100, 1) : 0;
            $finalSpecialtyStats[] = $ss;
        }

        return response()->json([
            'summary' => [
                'guru_name' => $user->name,
                'class_name' => $class->name,
                'total_categories' => $categories->count(),
                'total_students' => $students->count(),
                'completed_submissions_count' => $totalCompletedSubmissions,
                'expected_submissions_count' => $totalExpectedSubmissions,
                'overall_completion_pct' => $overallPct,
            ],
            'categories' => $finalCategories,
            'specialties' => $finalSpecialtyStats,
            'students' => $studentProgress
        ]);
    }
}
