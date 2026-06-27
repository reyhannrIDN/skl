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
            'headmaster_name' => null,
            'headmaster_nip' => null,
            'chat_enabled' => 'true',
            'chat_file_upload_enabled' => 'true',
            'chat_max_file_size_mb' => '10',
            'chat_allowed_file_types' => json_encode(['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar']),
        ];

        foreach ($settings as $key => $value) {
            SystemSetting::setValue($key, $value, 1);
        }
    }
}
