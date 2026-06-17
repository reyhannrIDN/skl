<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionFile extends Model
{
    protected $fillable = [
        'submission_id', 'requirement_id', 'file_type', 'file_path', 'link_url', 'file_name', 'file_size', 'mime_type', 'metadata',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) return null;
        if (filter_var($this->file_path, FILTER_VALIDATE_URL)) return $this->file_path;
        return asset('storage/' . $this->file_path);
    }

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'metadata' => 'array',
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ProjectSubmission::class, 'submission_id');
    }

    public function requirement(): BelongsTo
    {
        return $this->belongsTo(ProjectRequirement::class, 'requirement_id');
    }
}
