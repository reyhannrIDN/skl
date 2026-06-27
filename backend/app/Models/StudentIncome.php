<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentIncome extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'amount',
        'transaction_date',
        'description',
        'file_path',
        'input_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transaction_date' => 'date',
        ];
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function inputter()
    {
        return $this->belongsTo(User::class, 'input_by');
    }
}
