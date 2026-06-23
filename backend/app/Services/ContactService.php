<?php

namespace App\Services;

use App\Models\Message;

class ContactService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function store(array $data): Message
    {
        return Message::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'message' => $data['message'],
        ]);
    }
}
