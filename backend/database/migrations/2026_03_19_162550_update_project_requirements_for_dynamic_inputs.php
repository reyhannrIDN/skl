<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_requirements', function (Blueprint $table) {
            $table->foreignId('teacher_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->json('input_config')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('project_requirements', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropColumn(['teacher_id', 'input_config']);
        });
    }
};
