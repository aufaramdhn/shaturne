<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SkillController extends Controller
{
    // GET /api/v1/skills — public, grouped client-side by category.
    public function index(): AnonymousResourceCollection
    {
        // category is a translatable JSON column (not orderable in pgsql);
        // the frontend groups by category client-side.
        $skills = Skill::query()
            ->orderBy('sort_order')
            ->orderByDesc('proficiency')
            ->get();

        return SkillResource::collection($skills)
            ->additional(['success' => true, 'message' => 'OK']);
    }
}
