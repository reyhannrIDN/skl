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
        Schema::create('project_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('project_categories')->cascadeOnDelete();
            $table->string('label');
            $table->string('slug');
            $table->string('type'); // enum candidates: local_file, drive_file, link
            $table->boolean('is_required')->default(true);
            $table->string('allowed_extensions')->nullable(); // e.g., ".jpg,.png"
            $table->integer('max_size_mb')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_requirements');
    }
};
