<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'specialty', 'nis', 'nip',
        'kelas', 'angkatan', 'phone', 'avatar', 'is_active', 'google_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'angkatan' => 'integer',
        ];
    }

    public function isSuperadmin(): bool { return $this->role === 'superadmin'; }
    public function isGuru(): bool { return $this->role === 'guru'; }
    public function isSiswa(): bool { return $this->role === 'siswa'; }

    public function submissions() { return $this->hasMany(ProjectSubmission::class); }
    public function reviewedSubmissions() { return $this->hasMany(ProjectSubmission::class, 'guru_reviewer_id'); }
    public function checklistReviews() { return $this->hasMany(ChecklistReview::class, 'guru_id'); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function activityLogs() { return $this->hasMany(ActivityLog::class); }

    public function studentGroups()
    {
        return $this->belongsToMany(StudentGroup::class, 'student_group_user', 'user_id', 'student_group_id');
    }

    public function managedCategories()
    {
        return $this->hasMany(ProjectCategory::class, 'guru_id');
    }

    public function waliKelasGroups()
    {
        return $this->hasMany(StudentGroup::class, 'wali_kelas_id');
    }

    public function teachingGroups()
    {
        return $this->belongsToMany(StudentGroup::class, 'class_teacher', 'user_id', 'student_group_id');
    }
}
