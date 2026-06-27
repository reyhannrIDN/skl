<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_groups', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('name');
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->boolean('is_pinned')->default(false)->after('sticker_id');
            $table->json('mentions')->nullable()->after('is_pinned');
            $table->index('is_pinned');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex(['is_pinned']);
            $table->dropColumn(['is_pinned', 'mentions']);
        });
        Schema::table('chat_groups', function (Blueprint $table) {
            $table->dropColumn('photo');
        });
    }
};
