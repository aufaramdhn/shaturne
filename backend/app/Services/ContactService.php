<?php

namespace App\Services;

use App\Mail\ContactAutoReply;
use App\Mail\ContactNotification;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Message
    {
        $message = DB::transaction(fn () => Message::create([
            'name'    => $data['name'],
            'email'   => $data['email'],
            'message' => $data['message'],
        ]));

        try {
            Mail::queue(new ContactNotification($message));
            Mail::queue(new ContactAutoReply($message));
        } catch (\Exception $e) {
            Log::error('Mail dispatch failed', [
                'message_id' => $message->id,
                'error'      => $e->getMessage(),
            ]);
        }

        return $message;
    }
}
