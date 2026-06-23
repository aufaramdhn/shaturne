<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExperienceController extends Controller
{
    // GET /api/v1/experience — public, newest first.
    public function index(): AnonymousResourceCollection
    {
        $experiences = Experience::query()
            ->orderBy('sort_order')
            ->orderByDesc('start_date')
            ->get();

        return ExperienceResource::collection($experiences)
            ->additional(['success' => true, 'message' => 'OK']);
    }
}
