<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuranRequest;
use App\Services\QuranGuidanceService;
use Illuminate\Http\JsonResponse;

class QuranController extends Controller
{
    public function store(StoreQuranRequest $request, QuranGuidanceService $service): JsonResponse
    {
        try {
            $result = $service->guide($request->string('feeling')->toString());

            return $this->ok($result);
        } catch (\RuntimeException $e) {
            return $this->fail($e->getMessage(), 503);
        }
    }
}
