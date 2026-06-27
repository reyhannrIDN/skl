<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IdnStudent extends Model
{
    protected $fillable = [
        'name', 'nis', 'school', 'kelas', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
