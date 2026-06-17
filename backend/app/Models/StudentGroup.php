<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentGroup extends Model
{
    protected $fillable = ['name', 'description', 'wali_kelas_id'];

    public function waliKelas()
    {
        return $this->belongsTo(User::class, 'wali_kelas_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(User::class, 'class_teacher', 'student_group_id', 'user_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_group_user', 'student_group_id', 'user_id');
    }
}
