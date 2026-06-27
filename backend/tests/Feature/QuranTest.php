<?php

namespace Tests\Feature;

use Tests\TestCase;

class QuranTest extends TestCase
{
    public function test_quran_endpoint_validates_feeling(): void
    {
        $res = $this->postJson('/api/v1/quran', ['feeling' => '']);
        $res->assertStatus(422);
    }

    public function test_quran_endpoint_validates_min_length(): void
    {
        $res = $this->postJson('/api/v1/quran', ['feeling' => 'ok']);
        $res->assertStatus(422);
    }

    public function test_quran_endpoint_validates_max_length(): void
    {
        $res = $this->postJson('/api/v1/quran', ['feeling' => str_repeat('a', 501)]);
        $res->assertStatus(422);
    }

    public function test_quran_endpoint_requires_feeling_field(): void
    {
        $res = $this->postJson('/api/v1/quran', []);
        $res->assertStatus(422)
            ->assertJsonValidationErrors(['feeling']);
    }
}
