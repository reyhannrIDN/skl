<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        User::create([
            'name' => 'Admin IPSA',
            'email' => 'admin@skl.test',
            'password' => 'password',
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        // Guru sample
        User::create([
            'name' => 'Pak Budi Santoso',
            'email' => 'guru@skl.test',
            'password' => 'password',
            'role' => 'guru',
            'nip' => '198501012010011001',
            'is_active' => true,
        ]);

        User::create([
            'name' => 'Bu Siti Rahayu',
            'email' => 'guru2@skl.test',
            'password' => 'password',
            'role' => 'guru',
            'nip' => '198702032012012002',
            'is_active' => true,
        ]);

        // Siswa samples
        $siswaData = [
            ['name' => 'Ahmad Fauzi', 'email' => 'siswa@skl.test', 'nis' => '2024001', 'kelas' => '9'],
            ['name' => 'Siti Nurhaliza', 'email' => 'siswa2@skl.test', 'nis' => '2024002', 'kelas' => '9'],
            ['name' => 'Budi Prakoso', 'email' => 'siswa3@skl.test', 'nis' => '2024003', 'kelas' => '7'],
            ['name' => 'Dewi Lestari', 'email' => 'siswa4@skl.test', 'nis' => '2024004', 'kelas' => '7'],
            ['name' => 'Rizky Ramadhan', 'email' => 'siswa5@skl.test', 'nis' => '2024005', 'kelas' => '8'],
        ];

        foreach ($siswaData as $data) {
            User::create(array_merge($data, [
                'password' => 'password',
                'role' => 'siswa',
                'angkatan' => 2024,
                'is_active' => true,
            ]));
        }

        // IDN Admin
        User::create([
            'name' => 'Admin IDN',
            'email' => 'admin@idnbogor.id',
            'password' => 'password',
            'role' => 'idn',
            'is_active' => true,
        ]);

        // Call other seeders
        $this->call([
            SystemSettingsSeeder::class,
            ProjectCategorySeeder::class,
        ]);
    }
}
