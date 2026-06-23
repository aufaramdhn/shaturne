<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreExperienceRequest;
use App\Http\Requests\UpdateExperienceRequest;
use App\Http\Resources\Dashboard\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardExperienceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $experiences = Experience::orderBy('sort_order')->orderByDesc('start_date')->get();

        return ExperienceResource::collection($experiences)
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function store(StoreExperienceRequest $request): JsonResponse
    {
        $experience = Experience::create($request->validated());

        return (new ExperienceResource($experience))
            ->additional(['success' => true, 'message' => 'Pengalaman dibuat.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Experience $experience): JsonResource
    {
        return (new ExperienceResource($experience))
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function update(UpdateExperienceRequest $request, Experience $experience): JsonResource
    {
        $experience->update($request->validated());

        return (new ExperienceResource($experience))
            ->additional(['success' => true, 'message' => 'Pengalaman diperbarui.']);
    }

    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();

        return $this->ok(null, 'Pengalaman dihapus.');
    }
}
