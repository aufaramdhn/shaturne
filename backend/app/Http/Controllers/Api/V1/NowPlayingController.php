<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SpotifyService;
use Illuminate\Http\JsonResponse;

class NowPlayingController extends Controller
{
    // GET /api/v1/now-playing — public, polled by the frontend (~30s).
    public function index(SpotifyService $spotify): JsonResponse
    {
        return $this->ok($spotify->nowPlaying());
    }
}
