<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('judul_project');
            $table->text('deskripsi_project')->nullable();
            $table->json('teknologi_digunakan')->nullable();
            $table->string('nama_pembimbing')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'revision', 'approved', 'skl_issued'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('skl_issued_at')->nullable();
            $table->boolean('is_locked')->default(false);
            $table->foreignId('guru_reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('skl_drive_link')->nullable();
            $table->text('catatan_guru')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
    }
};
