<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectRequirement extends Model
{
    protected $fillable = [
        'category_id', 'teacher_id', 'label', 'slug', 'type', 'instructions', 'is_required', 'allowed_extensions', 'max_size_mb', 'input_config'
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'max_size_mb' => 'integer',
        'input_config' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'category_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
