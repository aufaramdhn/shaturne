<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /** Login goes through Sanctum's stateful guard — needs a frontend Origin. */
    private function stateful(): self
    {
        return $this->withHeaders(['Origin' => 'http://localhost']);
    }

    public function test_login_succeeds_with_valid_credentials(): void
    {
        User::factory()->create(['email' => 'a@b.com', 'password' => Hash::make('secret123')]);

        $this->stateful()
            ->postJson('/api/v1/auth/login', ['email' => 'a@b.com', 'password' => 'secret123'])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', 'a@b.com');
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'a@b.com', 'password' => Hash::make('secret123')]);

        $this->stateful()
            ->postJson('/api/v1/auth/login', ['email' => 'a@b.com', 'password' => 'wrong'])
            ->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_login_is_rate_limited_after_five_attempts(): void
    {
        User::factory()->create(['email' => 'a@b.com', 'password' => Hash::make('secret123')]);

        for ($i = 0; $i < 5; $i++) {
            $this->stateful()->postJson('/api/v1/auth/login', ['email' => 'a@b.com', 'password' => 'wrong']);
        }

        $this->stateful()
            ->postJson('/api/v1/auth/login', ['email' => 'a@b.com', 'password' => 'wrong'])
            ->assertStatus(429);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_me_returns_current_user_when_authenticated(): void
    {
        $user = User::factory()->create(['email' => 'me@b.com']);
        Sanctum::actingAs($user);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'me@b.com');
    }

    public function test_logout_clears_session(): void
    {
        // The logout endpoint uses the web guard (session-based). We must send the
        // request through the stateful Sanctum middleware so $request->session()
        // is available. actingAs() on the web guard provides the authenticated
        // session for the single request.
        $user = User::factory()->create();
        $this->actingAs($user, 'web');

        $this->stateful()
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}
