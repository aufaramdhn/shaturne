<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DashboardExperienceController;
use App\Http\Controllers\Api\V1\DashboardMessageController;
use App\Http\Controllers\Api\V1\DashboardProjectController;
use App\Http\Controllers\Api\V1\DashboardSkillController;
use App\Http\Controllers\Api\V1\ExperienceController;
use App\Http\Controllers\Api\V1\GithubContributionsController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\NowPlayingController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\SkillController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — all prefixed /api/v1 (see bootstrap/app.php apiPrefix)
|--------------------------------------------------------------------------
*/

Route::prefix('api/v1')->group(function () {

    // ── Auth ─────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:5,1'); // 5 attempts/min — brute force guard (§10.1)
        Route::post('logout', [AuthController::class, 'logout'])
            ->middleware('auth:sanctum');
        Route::get('me', [AuthController::class, 'me'])
            ->middleware('auth:sanctum');
    });

    // ── Public ───────────────────────────────────────────────────────────
    Route::get('projects', [ProjectController::class, 'index']);
    Route::get('projects/{slug}', [ProjectController::class, 'show']);
    Route::get('skills', [SkillController::class, 'index']);
    Route::get('experience', [ExperienceController::class, 'index']);
    Route::post('contact', [MessageController::class, 'store'])
        ->middleware('throttle:3,10'); // anti-spam: 3 requests per 10 minutes per IP
    Route::get('now-playing', [NowPlayingController::class, 'index'])
        ->middleware('throttle:60,1'); // polled ~30s by the frontend
    Route::get('github/contributions', [GithubContributionsController::class, 'index'])
        ->middleware('throttle:30,1'); // cached 6h, light rate limit

    // ── Dashboard (auth required) — uses UUID, not integer ID ───────────
    Route::prefix('dashboard')->middleware(['auth:sanctum', 'role:admin'])->group(function () {

        Route::get('overview', [DashboardController::class, 'overview']);

        Route::apiResource('projects', DashboardProjectController::class);
        Route::apiResource('skills', DashboardSkillController::class);
        Route::apiResource('experience', DashboardExperienceController::class);
        Route::apiResource('messages', DashboardMessageController::class)
            ->only(['index', 'show', 'destroy']);

        Route::put('profile', [DashboardController::class, 'updateProfile']);
        Route::post('media', [DashboardController::class, 'uploadMedia']);
        Route::delete('media/{filename}', [DashboardController::class, 'deleteMedia']);
    });
});
