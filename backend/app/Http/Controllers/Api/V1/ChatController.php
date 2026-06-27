<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChatRequest;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    public function store(StoreChatRequest $request, ChatService $chat): JsonResponse
    {
        $reply = $chat->respond($request->string('message')->toString());

        return $this->ok(['reply' => $reply]);
    }
}
