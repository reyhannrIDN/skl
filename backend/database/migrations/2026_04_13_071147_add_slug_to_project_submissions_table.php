<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('judul_project')->unique();
        });

        // Generate slugs for existing records
        $submissions = DB::table('project_submissions')->get();
        foreach ($submissions as $submission) {
            $slug = Str::slug($submission->judul_project);
            
            // Ensure uniqueness
            $originalSlug = $slug;
            $count = 1;
            while (DB::table('project_submissions')->where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            DB::table('project_submissions')
                ->where('id', $submission->id)
                ->update(['slug' => $slug]);
        }
        
        // Make it non-nullable after population
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('project_submissions', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
