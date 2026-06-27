<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LombaPeserta extends Model
{
    protected $table = 'lomba_peserta';

    protected $fillable = [
        'lomba_tim_id', 'user_id', 'nama', 'nis', 'kelas',
    ];

    public function tim()
    {
        return $this->belongsTo(LombaTim::class, 'lomba_tim_id');
    }

    public function siswa()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
