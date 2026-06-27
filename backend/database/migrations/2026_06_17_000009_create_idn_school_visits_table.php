<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('idn_school_visits', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->text('address')->nullable();
            $table->date('visit_date')->nullable();
            $table->string('team_name');
            $table->text('team_members')->nullable();
            $table->integer('total_audience')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('idn_school_visits');
    }
};
