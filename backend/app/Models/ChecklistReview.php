<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChecklistReview extends Model
{
    protected $fillable = [
        'submission_id', 'guru_id', 'checklist_item', 'status', 'catatan', 'reviewed_at',
    ];

    protected function casts(): array
    {
        return ['reviewed_at' => 'datetime'];
    }

    public function submission(): BelongsTo { return $this->belongsTo(ProjectSubmission::class, 'submission_id'); }
    public function guru(): BelongsTo { return $this->belongsTo(User::class, 'guru_id'); }
}
