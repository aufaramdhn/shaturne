<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChatTest extends TestCase
{
    public function test_returns_reply(): void
    {
        Http::fake([
            'api.groq.com/*' => Http::response([
                'choices' => [['message' => ['content' => 'Saya bisa React dan Laravel.']]],
            ], 200),
        ]);

        $res = $this->postJson('/api/v1/chat', ['message' => 'skill apa?']);

        $res->assertOk()
            ->assertJsonStructure(['success', 'data' => ['reply']]);
    }

    public function test_rejects_empty_message(): void
    {
        $res = $this->postJson('/api/v1/chat', ['message' => '']);
        $res->assertStatus(422);
    }

    public function test_rejects_message_over_500_chars(): void
    {
        $res = $this->postJson('/api/v1/chat', ['message' => str_repeat('a', 501)]);
        $res->assertStatus(422);
    }
}
