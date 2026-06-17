<?php

namespace Database\Seeders;

use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;

class ProjectCategorySeeder extends Seeder
{
    public function run(): void
    {
        $mobile = ProjectCategory::create([
            'name' => 'Aplikasi Mobile',
            'description' => 'Project pengembangan aplikasi mobile menggunakan MIT App Inventor, Kodular, atau Flutter.',
            'target_kelas' => '9',
            'is_active' => true,
        ]);

        $mobile->requirements()->createMany([
            [
                'label' => 'Poster Project',
                'slug' => 'poster',
                'type' => 'local_file',
                'is_required' => true,
                'allowed_extensions' => '.jpg,.jpeg,.png,.pdf',
                'max_size_mb' => 5,
            ],
            [
                'label' => 'Aplikasi .APK',
                'slug' => 'apk',
                'type' => 'local_file',
                'is_required' => true,
                'allowed_extensions' => '.apk',
                'max_size_mb' => 100,
            ],
            [
                'label' => 'Screenshot Aplikasi (1)',
                'slug' => 'screenshot_1',
                'type' => 'local_file',
                'is_required' => true,
                'allowed_extensions' => '.jpg,.jpeg,.png',
                'max_size_mb' => 2,
            ],
            [
                'label' => 'Source Code .ZIP',
                'slug' => 'source_zip',
                'type' => 'local_file',
                'is_required' => false,
                'allowed_extensions' => '.zip',
                'max_size_mb' => 200,
            ],
            [
                'label' => 'File Kodular .AIA',
                'slug' => 'kodular_aia',
                'type' => 'local_file',
                'is_required' => false,
                'allowed_extensions' => '.aia',
                'max_size_mb' => 100,
            ],
            [
                'label' => 'Link Video Demo (Drive/YouTube)',
                'slug' => 'video_link',
                'type' => 'link',
                'is_required' => false,
            ],
        ]);

        $web = ProjectCategory::create([
            'name' => 'Project Website',
            'description' => 'Project pengembangan website menggunakan HTML, CSS, JS atau CMS.',
            'target_kelas' => '7',
            'is_active' => true,
        ]);

        $web->requirements()->createMany([
            [
                'label' => 'Poster Project',
                'slug' => 'poster',
                'type' => 'local_file',
                'is_required' => true,
                'allowed_extensions' => '.jpg,.jpeg,.png',
                'max_size_mb' => 5,
            ],
            [
                'label' => 'Link Website / Demo',
                'slug' => 'website_link',
                'type' => 'link',
                'is_required' => true,
            ],
            [
                'label' => 'Source Code (GitHub/Drive)',
                'slug' => 'source_code_link',
                'type' => 'link',
                'is_required' => true,
            ],
        ]);
    }
}
