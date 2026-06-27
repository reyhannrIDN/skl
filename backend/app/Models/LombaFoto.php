<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LombaFoto extends Model
{
    protected $table = 'lomba_foto';

    protected $fillable = [
        'lomba_id', 'file_path', 'original_name', 'file_size', 'urutan',
    ];

    public function lomba()
    {
        return $this->belongsTo(Lomba::class, 'lomba_id');
    }
}
