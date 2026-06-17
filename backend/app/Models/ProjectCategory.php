<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectCategory extends Model
{
    protected $fillable = [
        'name', 
        'description', 
        'target_kelas', 
        'is_active', 
        'guru_id',
        'start_date',
        'end_date'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(ProjectRequirement::class, 'category_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ProjectSubmission::class, 'category_id');
    }
}
