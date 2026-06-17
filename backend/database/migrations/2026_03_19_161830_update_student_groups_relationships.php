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
        Schema::table('student_groups', function (Blueprint $table) {
            $table->renameColumn('guru_id', 'wali_kelas_id');
        });
    }

    public function down(): void
    {
        Schema::table('student_groups', function (Blueprint $table) {
            $table->renameColumn('wali_kelas_id', 'guru_id');
        });
    }
};
