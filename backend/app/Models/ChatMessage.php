<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'group_id', 'sender_id', 'message_type', 'message',
        'file_path', 'file_name', 'file_size', 'mime_type', 'sticker_id',
        'is_pinned', 'mentions', 'is_deleted', 'deleted_at', 'deleted_for',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'is_pinned' => 'boolean',
            'is_deleted' => 'boolean',
            'deleted_at' => 'datetime',
            'mentions' => 'array',
            'deleted_for' => 'array',
        ];
    }

    public function group()
    {
        return $this->belongsTo(ChatGroup::class, 'group_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
