<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Http\Resources\Dashboard\SkillResource;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardSkillController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        // category is a translatable JSON column (not orderable in pgsql).
        $skills = Skill::orderBy('sort_order')->get();

        return SkillResource::collection($skills)
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $skill = Skill::create($request->validated());

        return (new SkillResource($skill))
            ->additional(['success' => true, 'message' => 'Keahlian dibuat.'])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Skill $skill): JsonResource
    {
        return (new SkillResource($skill))->additional(['success' => true, 'message' => 'OK']);
    }

    public function update(UpdateSkillRequest $request, Skill $skill): JsonResource
    {
        $skill->update($request->validated());

        return (new SkillResource($skill))
            ->additional(['success' => true, 'message' => 'Keahlian diperbarui.']);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return $this->ok(null, 'Keahlian dihapus.');
    }
}
