<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardMessageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Message::class);

        $messages = Message::orderByDesc('created_at')->paginate(20);

        return MessageResource::collection($messages)
            ->additional(['success' => true, 'message' => 'OK']);
    }

    // Viewing a message marks it read.
    public function show(Message $message): JsonResource
    {
        $this->authorize('view', $message);
        if (! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        return (new MessageResource($message))
            ->additional(['success' => true, 'message' => 'OK']);
    }

    public function destroy(Message $message): JsonResponse
    {
        $this->authorize('delete', $message);
        $message->delete();

        return $this->ok(null, 'Pesan dihapus.');
    }
}
