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
        Schema::table('submission_files', function (Blueprint $table) {
            $table->text('link_url')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('submission_files', function (Blueprint $table) {
            $table->dropColumn('link_url');
        });
    }
};
