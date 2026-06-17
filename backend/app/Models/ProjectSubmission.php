<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ProjectSubmission extends Model
{
    protected $fillable = [
        'user_id', 'category_id', 'slug', 'judul_project', 'deskripsi_project', 'teknologi_digunakan',
        'nama_pembimbing', 'status', 'submitted_at', 'reviewed_at',
        'skl_issued_at', 'is_locked', 'guru_reviewer_id', 'skl_drive_link', 'catatan_guru',
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($submission) {
            if (empty($submission->slug)) {
                $submission->slug = $submission->generateUniqueSlug($submission->judul_project);
            }
        });

        static::updating(function ($submission) {
            if ($submission->isDirty('judul_project') && !$submission->is_locked) {
                $submission->slug = $submission->generateUniqueSlug($submission->judul_project);
            }
        });
    }

    public function generateUniqueSlug($title): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected function casts(): array
    {
        return [
            'teknologi_digunakan' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'skl_issued_at' => 'datetime',
            'is_locked' => 'boolean',
        ];
    }

    // Scopes
    public function scopeByStatus($query, string $status) { return $query->where('status', $status); }
    public function scopeByKelas($query, string $kelas) { return $query->whereHas('user', fn($q) => $q->where('kelas', $kelas)); }

    // Relationships
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'guru_reviewer_id'); }
    public function category(): BelongsTo { return $this->belongsTo(ProjectCategory::class, 'category_id'); }
    public function files(): HasMany { return $this->hasMany(SubmissionFile::class, 'submission_id'); }
    public function checklistReviews(): HasMany { return $this->hasMany(ChecklistReview::class, 'submission_id'); }
    public function notifications(): HasMany { return $this->hasMany(Notification::class, 'related_submission_id'); }

    // Helpers
    public function isEditable(): bool
    {
        return !$this->is_locked && !in_array($this->status, ['approved', 'skl_issued']);
    }

    public function isDeletable(): bool
    {
        return $this->status === 'draft';
    }
}
