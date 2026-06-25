<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GithubContributionsController extends Controller
{
    // GET /api/v1/github/contributions?year=2026 — public, cached 6h.
    public function index(Request $request, GitHubService $github): JsonResponse
    {
        $year = (int) $request->query('year', date('Y'));

        // Clamp to sensible range — GitHub was founded 2008
        $year = max(2008, min((int) date('Y'), $year));

        return $this->ok($github->contributions($year));
    }
}
