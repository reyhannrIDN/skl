<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('student_incomes', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('student_incomes', function (Blueprint $table) {
            $table->dropColumn('file_path');
        });
    }
};
