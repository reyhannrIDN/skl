<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LombaPendamping extends Model
{
    protected $table = 'lomba_pendamping';

    protected $fillable = [
        'lomba_id', 'user_id', 'nama', 'jabatan',
    ];

    public function lomba()
    {
        return $this->belongsTo(Lomba::class, 'lomba_id');
    }

    public function guru()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
