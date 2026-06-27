<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LombaTim extends Model
{
    protected $table = 'lomba_tim';

    protected $fillable = [
        'lomba_id', 'nama_tim', 'jenis_tim', 'jumlah_anggota',
    ];

    public function lomba()
    {
        return $this->belongsTo(Lomba::class, 'lomba_id');
    }

    public function peserta()
    {
        return $this->hasMany(LombaPeserta::class, 'lomba_tim_id');
    }
}
