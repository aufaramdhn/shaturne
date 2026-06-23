<?php

use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\SetLocale;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Apply to all API routes
        $middleware->api(prepend: [
            ForceJsonResponse::class,
            SecurityHeaders::class,
            SetLocale::class,
        ]);

        // Sanctum SPA stateful auth
        $middleware->statefulApi();

        // spatie/laravel-permission middleware aliases
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Never expose stack traces — always JSON for API routes
        $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*'));

        // Validation errors: structured errors envelope (§9)
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal.',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // Unauthenticated
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
            }
        });

        // HTTP exceptions (404, 403, etc.) — hide internal message from client
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => match ($e->getStatusCode()) {
                        403 => 'Anda tidak memiliki izin untuk aksi ini.',
                        404 => 'Resource tidak ditemukan.',
                        405 => 'Metode tidak diizinkan.',
                        429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
                        default => 'Terjadi kesalahan.',
                    },
                ], $e->getStatusCode());
            }
        });

        // Catch-all: log full detail, return generic message — stack trace NEVER to client
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                report($e);

                return response()->json([
                    'success' => false,
                    'message' => 'Terjadi kesalahan, silakan coba lagi.',
                ], 500);
            }
        });
    })->create();
