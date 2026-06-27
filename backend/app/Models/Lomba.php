<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lomba extends Model
{
    use SoftDeletes;

    protected $table = 'lomba';

    protected $fillable = [
        'nama_lomba', 'tingkat', 'kategori', 'penyelenggara', 'lokasi', 'alamat',
        'tanggal_mulai', 'tanggal_selesai', 'deskripsi',
        'status_hasil', 'juara_ke', 'juara_ke_lainnya',
        'total_tim', 'total_peserta', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }

    public function tim()
    {
        return $this->hasMany(LombaTim::class, 'lomba_id');
    }

    public function pendamping()
    {
        return $this->hasMany(LombaPendamping::class, 'lomba_id');
    }

    public function foto()
    {
        return $this->hasMany(LombaFoto::class, 'lomba_id')->orderBy('urutan');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
