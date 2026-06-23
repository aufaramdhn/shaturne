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
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary(); // HasUuids — IDOR prevention (§10.2)
            $table->json('title'); // translatable {id, en} (spatie/laravel-translatable)
            $table->string('slug')->unique(); // single canonical slug (language-neutral)
            $table->json('description'); // translatable {id, en}
            $table->json('stack')->default('[]');
            $table->string('repo_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->boolean('is_published')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
