<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectController extends Controller
{
    // GET /api/v1/projects — public, published only, paginated.
    public function index(): AnonymousResourceCollection
    {
        $projects = Project::query()
            ->where('is_published', true)
            ->with('images')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate(12);

        return ProjectResource::collection($projects)
            ->additional(['success' => true, 'message' => 'OK']);
    }

    // GET /api/v1/projects/{slug} — public detail.
    public function show(string $slug): JsonResource|JsonResponse
    {
        $project = Project::query()
            ->where('slug', $slug)
            ->where('is_published', true)
            ->with('images')
            ->first();

        if (! $project) {
            return $this->fail('Proyek tidak ditemukan', 404);
        }

        return (new ProjectResource($project))
            ->additional(['success' => true, 'message' => 'OK']);
    }
}
