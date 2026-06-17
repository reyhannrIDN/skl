<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'school_name' => 'SMK Digital Nusantara',
            'academic_year' => '2025/2026',
            'registration_open' => 'true',
            'school_logo' => null,
            'max_file_size_mb' => '500',
            'allowed_classes' => json_encode(['XII RPL 1', 'XII RPL 2', 'XII MM 1', 'XII MM 2', 'XII TKJ 1']),
        ];

        foreach ($settings as $key => $value) {
            SystemSetting::create([
                'key' => $key,
                'value' => $value,
                'updated_by' => 1,
                'updated_at' => now(),
            ]);
        }
    }
}
