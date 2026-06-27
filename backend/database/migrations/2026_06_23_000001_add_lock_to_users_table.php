<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('lock_enabled')->default(false);
            $table->string('lock_type')->nullable()->comment('pin or pattern');
            $table->string('lock_code')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['lock_enabled', 'lock_type', 'lock_code']);
        });
    }
};
