<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Services\ContactService;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    // POST /api/v1/contact — public (throttled), honeypot anti-bot.
    public function store(StoreMessageRequest $request, ContactService $contact): JsonResponse
    {
        // Honeypot filled → a bot. Pretend success, store nothing.
        if (filled($request->input('honeypot'))) {
            return $this->ok(null, 'Pesan terkirim.', 201);
        }

        $contact->store($request->validated());

        return $this->ok(null, 'Pesan terkirim.', 201);
    }
}
