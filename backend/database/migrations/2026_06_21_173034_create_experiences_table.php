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
        Schema::create('experiences', function (Blueprint $table) {
            $table->uuid('id')->primary(); // HasUuids (§10.2)
            $table->json('title'); // translatable {id, en}
            $table->string('organization'); // org name — language-neutral
            $table->date('start_date');
            $table->date('end_date')->nullable(); // null = present/ongoing
            $table->json('description')->nullable(); // translatable {id, en}
            $table->string('type')->default('organization'); // organization | internship | education
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
