<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdnSchoolVisit extends Model
{
    protected $fillable = [
        'school_name', 'address', 'visit_date', 'team_name',
        'team_members', 'total_audience', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'total_audience' => 'integer',
        ];
    }
}
