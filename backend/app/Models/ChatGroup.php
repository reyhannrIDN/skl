<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    protected $fillable = ['name', 'photo', 'description', 'notes', 'type', 'created_by', 'reference_id', 'is_active'];

    protected $appends = ['photo_url'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getPhotoUrlAttribute()
    {
        return $this->photo ? $this->photo : null;
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->hasMany(ChatGroupMember::class, 'group_id');
    }

    public function memberUsers()
    {
        return $this->belongsToMany(User::class, 'chat_group_members', 'group_id', 'user_id')
            ->withPivot('is_admin');
    }

    public function messages()
    {
        return $this->hasMany(ChatMessage::class, 'group_id');
    }

    public function lastMessage()
    {
        return $this->hasOne(ChatMessage::class, 'group_id')->latestOfMany();
    }
}
