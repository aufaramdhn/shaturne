<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\Dashboard\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projects) {}

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Project::class);

        $projects = Project::with('images')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate(20);

        return ProjectResource::collection($projects)
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projects->create($request->validated());

        return (new ProjectResource($project))
            ->additional(['success' => true, 'message' => 'Proyek dibuat.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Project $project): JsonResource
    {
        $project->load('images');

        return (new ProjectResource($project))
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResource
    {
        $updated = $this->projects->update($project, $request->validated());

        return (new ProjectResource($updated))
            ->additional(['success' => true, 'message' => 'Proyek diperbarui.']);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);
        $this->projects->delete($project);

        return $this->ok(null, 'Proyek dihapus.');
    }
}
