<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public static function create(int $userId, string $title, string $message, string $type = 'info', ?int $submissionId = null): Notification
    {
        return Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'is_read' => false,
            'related_submission_id' => $submissionId,
            'created_at' => now(),
        ]);
    }

    public static function notifyGurus(string $title, string $message, string $type = 'info', ?int $submissionId = null): void
    {
        $gurus = \App\Models\User::where('role', 'guru')->where('is_active', true)->get();
        foreach ($gurus as $guru) {
            self::create($guru->id, $title, $message, $type, $submissionId);
        }
    }

    public static function notifyProjectTeachers(\App\Models\ProjectSubmission $submission, string $title, string $message, string $type = 'info'): void
    {
        $student = $submission->user;
        
        // Find all teachers associated with the student's groups
        $teacherIds = DB::table('class_teacher')
            ->join('student_groups', 'class_teacher.student_group_id', '=', 'student_groups.id')
            ->join('student_group_user', 'student_groups.id', '=', 'student_group_user.student_group_id')
            ->where('student_group_user.user_id', $student->id)
            ->pluck('class_teacher.teacher_id')
            ->unique();

        // Also include the category owner if applicable
        $categoryOwnerId = $submission->category->guru_id;
        if ($categoryOwnerId) {
            $teacherIds->push($categoryOwnerId);
        }

        // Also include the Wali Kelas if applicable
        $waliKelasIds = DB::table('student_groups')
            ->join('student_group_user', 'student_groups.id', '=', 'student_group_user.student_group_id')
            ->where('student_group_user.user_id', $student->id)
            ->pluck('student_groups.wali_kelas_id')
            ->unique();
        
        $allTeacherIds = $teacherIds->merge($waliKelasIds)
            ->filter(fn($id) => !is_null($id))
            ->unique();

        foreach ($allTeacherIds as $teacherId) {
            self::create((int)$teacherId, $title, $message, $type, $submission->id);
        }
    }

    public static function notifyStudents(int $teacherId, string $title, string $message, string $type = 'info'): void
    {
        // Get all student IDs that are in groups managed by this teacher
        $managedGroupIds = DB::table('student_groups')
            ->where('wali_kelas_id', $teacherId)
            ->pluck('id')
            ->toArray();
            
        $teachingGroupIds = DB::table('class_teacher')
            ->where('user_id', $teacherId)
            ->pluck('student_group_id')
            ->toArray();
            
        $allGroupIds = array_unique(array_merge($managedGroupIds, $teachingGroupIds));
        
        $studentIds = DB::table('student_group_user')
            ->whereIn('student_group_id', $allGroupIds)
            ->pluck('user_id')
            ->unique();

        foreach ($studentIds as $userId) {
            self::create((int)$userId, $title, $message, $type);
        }
    }

    public static function logActivity(string $action, ?string $description = null, ?int $userId = null): void
    {
        ActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
    }
}
