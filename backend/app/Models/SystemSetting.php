<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    public $timestamps = false;
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['key', 'value', 'updated_by', 'updated_at'];

    protected function casts(): array
    {
        return ['updated_at' => 'datetime'];
    }

    public static function getValue(string $key, $default = null): ?string
    {
        $setting = static::find($key);
        return $setting ? $setting->value : $default;
    }

    public static function setValue(string $key, $value, ?int $userId = null): void
    {
        static::updateOrCreate(['key' => $key], [
            'value' => $value,
            'updated_by' => $userId,
            'updated_at' => now(),
        ]);
    }
}
