<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = ['current_password', 'password', 'password_confirmation', 'token'];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log technical details — never logs sensitive fields (see $dontFlash)
        });
    }

    public function render($request, Throwable $e)
    {
        // Validation errors — return structured errors as per §9 envelope
        if ($e instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        }

        // Unauthenticated — always JSON (ForceJsonResponse middleware handles Accept header,
        // but this ensures the response shape matches our envelope)
        if ($e instanceof AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // HTTP exceptions (404, 403, 405, etc.) — return code but hide internal message
        if ($e instanceof HttpException) {
            return response()->json([
                'success' => false,
                'message' => $this->httpMessage($e->getStatusCode()),
            ], $e->getStatusCode());
        }

        // All other exceptions: log full detail, return generic message to client.
        // Stack trace NEVER sent to client — APP_DEBUG=false enforces this at framework
        // level too, but this handler is the explicit safety net.
        report($e);

        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan, silakan coba lagi.',
        ], 500);
    }

    private function httpMessage(int $status): string
    {
        return match ($status) {
            400 => 'Permintaan tidak valid.',
            401 => 'Autentikasi diperlukan.',
            403 => 'Anda tidak memiliki izin untuk aksi ini.',
            404 => 'Resource tidak ditemukan.',
            405 => 'Metode tidak diizinkan.',
            429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
            default => 'Terjadi kesalahan.',
        };
    }
}
