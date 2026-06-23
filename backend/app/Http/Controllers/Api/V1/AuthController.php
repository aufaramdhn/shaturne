<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Sanctum SPA cookie auth (web guard, session-based — not bearer tokens).
class AuthController extends Controller
{
    // POST /api/v1/auth/login
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
            return $this->fail('Email atau password salah.', 422);
        }

        $request->session()->regenerate();

        return $this->ok(new UserResource(Auth::user()), 'Berhasil masuk.');
    }

    // GET /api/v1/auth/me — auth:sanctum
    public function me(Request $request): JsonResponse
    {
        return $this->ok(new UserResource($request->user()));
    }

    // POST /api/v1/auth/logout — auth:sanctum
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->ok(null, 'Berhasil keluar.');
    }
}
