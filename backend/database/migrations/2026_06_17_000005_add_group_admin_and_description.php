<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_groups', function (Blueprint $table) {
            $table->text('description')->nullable()->after('photo');
            $table->text('notes')->nullable()->after('description');
        });

        Schema::table('chat_group_members', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('last_read_at');
        });
    }

    public function down(): void
    {
        Schema::table('chat_group_members', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
        Schema::table('chat_groups', function (Blueprint $table) {
            $table->dropColumn(['description', 'notes']);
        });
    }
};
