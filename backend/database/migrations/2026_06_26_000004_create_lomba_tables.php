<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lomba', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lomba');
            $table->enum('tingkat', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional']);
            $table->string('kategori');
            $table->string('penyelenggara')->nullable();
            $table->string('lokasi');
            $table->text('alamat')->nullable();
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->text('deskripsi')->nullable();
            $table->enum('status_hasil', ['belum_ada_hasil', 'juara', 'tidak_juara'])->default('belum_ada_hasil');
            $table->string('juara_ke')->nullable();
            $table->string('juara_ke_lainnya')->nullable();
            $table->integer('total_tim')->default(0);
            $table->integer('total_peserta')->default(0);
            $table->foreignId('created_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('lomba_tim', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lomba_id')->constrained('lomba')->cascadeOnDelete();
            $table->string('nama_tim');
            $table->enum('jenis_tim', ['individu', 'beregu']);
            $table->integer('jumlah_anggota')->default(0);
            $table->timestamps();
        });

        Schema::create('lomba_peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lomba_tim_id')->constrained('lomba_tim')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->string('nama');
            $table->string('nis')->nullable();
            $table->string('kelas')->nullable();
            $table->timestamps();
        });

        Schema::create('lomba_pendamping', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lomba_id')->constrained('lomba')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users');
            $table->string('nama');
            $table->string('jabatan')->nullable();
            $table->timestamps();
        });

        Schema::create('lomba_foto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lomba_id')->constrained('lomba')->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name')->nullable();
            $table->integer('file_size')->nullable();
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lomba_foto');
        Schema::dropIfExists('lomba_pendamping');
        Schema::dropIfExists('lomba_peserta');
        Schema::dropIfExists('lomba_tim');
        Schema::dropIfExists('lomba');
    }
};
