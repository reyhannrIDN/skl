<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->boolean('is_deleted')->default(false)->after('mentions');
            $table->timestamp('deleted_at')->nullable()->after('is_deleted');
            $table->json('deleted_for')->nullable()->after('deleted_at');
            $table->index('is_deleted');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropIndex(['is_deleted']);
            $table->dropColumn(['is_deleted', 'deleted_at', 'deleted_for']);
        });
    }
};
