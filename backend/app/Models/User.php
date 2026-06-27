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
        'kelas', 'angkatan', 'phone', 'avatar', 'is_active', 'google_id', 'last_activity_at',
        'permissions',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'angkatan' => 'integer',
            'permissions' => 'array',
        ];
    }

    public function isSuperadmin(): bool { return $this->role === 'superadmin'; }
    public function isGuru(): bool { return $this->role === 'guru'; }
    public function isSiswa(): bool { return $this->role === 'siswa'; }
    public function isKepalaSekolah(): bool { return $this->role === 'kepala_sekolah'; }

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

    public function chatGroups()
    {
        return $this->belongsToMany(ChatGroup::class, 'chat_group_members', 'user_id', 'group_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(ChatMessage::class, 'sender_id');
    }

    public function studentIncomes()
    {
        return $this->hasMany(StudentIncome::class, 'user_id');
    }

    public function lombaCreated()
    {
        return $this->hasMany(Lomba::class, 'created_by');
    }

    public function lombaPendamping()
    {
        return $this->hasMany(LombaPendamping::class, 'user_id');
    }

    public function lombaPeserta()
    {
        return $this->hasMany(LombaPeserta::class, 'user_id');
    }

    public function isOnline(): bool
    {
        return $this->last_activity_at && $this->last_activity_at->gt(now()->subMinutes(5));
    }

    public function hasPermissionTo(string $module, string $action): bool
    {
        if ($this->isSuperadmin()) return true;
        if (empty($this->permissions)) return true;
        $perms = $this->permissions;
        if (!isset($perms[$module])) return false;
        return in_array($action, $perms[$module]);
    }

    public static function availablePermissions(): array
    {
        return [
            'guru' => [
                'dashboard'   => ['view'],
                'submissions' => ['view', 'create', 'edit', 'delete', 'review'],
                'categories'  => ['view', 'create', 'edit', 'delete'],
                'students'    => ['view', 'create', 'edit', 'delete'],
                'monitoring'  => ['view'],
                'pendapatan'  => ['view', 'create', 'edit', 'delete'],
                'chat'        => ['view', 'send'],
                'tasks'       => ['view', 'create', 'edit', 'delete'],
                'profile'     => ['view', 'edit'],
                'lomba'       => ['view', 'create', 'edit', 'delete'],
            ],
            'siswa' => [
                'dashboard' => ['view'],
                'projects'  => ['view', 'create', 'edit', 'delete'],
                'skl'       => ['view'],
                'chat'      => ['view', 'send'],
                'profile'   => ['view', 'edit'],
            ],
            'idn' => [
                'dashboard'    => ['view'],
                'students'     => ['view', 'create', 'edit', 'delete'],
                'school_visits'=> ['view', 'create', 'edit', 'delete'],
                'lomba'        => ['view', 'create', 'edit', 'delete'],
                'chat'         => ['view', 'send'],
                'profile'      => ['view', 'edit'],
            ],
            'kepala_sekolah' => [
                'dashboard' => ['view'],
                'lomba'     => ['view'],
                'profile'   => ['view', 'edit'],
            ],
        ];
    }
}
