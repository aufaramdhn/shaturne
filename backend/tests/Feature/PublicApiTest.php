<?php

namespace Tests\Feature;

use App\Mail\ContactAutoReply;
use App\Mail\ContactNotification;
use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_index_returns_only_published_in_envelope(): void
    {
        Project::create(['title' => ['id' => 'Live', 'en' => 'Live'], 'slug' => 'live', 'description' => ['id' => 'x', 'en' => 'x'], 'stack' => ['A'], 'is_published' => true]);
        Project::create(['title' => ['id' => 'Draft', 'en' => 'Draft'], 'slug' => 'draft', 'description' => ['id' => 'x', 'en' => 'x'], 'stack' => [], 'is_published' => false]);

        $res = $this->getJson('/api/v1/projects');

        $res->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'live');
    }

    public function test_project_detail_returns_published_project(): void
    {
        Project::create(['title' => ['id' => 'Live', 'en' => 'Live'], 'slug' => 'live', 'description' => ['id' => 'desc', 'en' => 'desc'], 'stack' => ['A'], 'is_published' => true]);

        $this->getJson('/api/v1/projects/live')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Live');
    }

    public function test_content_resolves_by_accept_language(): void
    {
        Project::create([
            'title' => ['id' => 'Judul', 'en' => 'Title'],
            'slug' => 'dual',
            'description' => ['id' => 'Deskripsi', 'en' => 'Description'],
            'stack' => [],
            'is_published' => true,
        ]);

        $this->getJson('/api/v1/projects/dual', ['Accept-Language' => 'en'])
            ->assertJsonPath('data.title', 'Title');
        $this->getJson('/api/v1/projects/dual?lang=id')
            ->assertJsonPath('data.title', 'Judul');
    }

    public function test_unpublished_project_detail_is_404(): void
    {
        Project::create(['title' => ['id' => 'Hidden', 'en' => 'Hidden'], 'slug' => 'hidden', 'description' => ['id' => 'x', 'en' => 'x'], 'stack' => [], 'is_published' => false]);

        $this->getJson('/api/v1/projects/hidden')
            ->assertNotFound()
            ->assertJsonPath('success', false);
    }

    public function test_skills_and_experience_are_public(): void
    {
        Skill::create(['name' => 'PHP', 'category' => ['id' => 'Backend', 'en' => 'Backend'], 'proficiency' => 90]);
        Experience::create([
            'title' => ['id' => 'Dev', 'en' => 'Dev'],
            'organization' => 'Acme',
            'start_date' => '2024-01-01',
            'description' => ['id' => 'd', 'en' => 'd'],
            'type' => 'work',
        ]);

        $this->getJson('/api/v1/skills')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/v1/experience')->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_contact_stores_message(): void
    {
        $this->postJson('/api/v1/contact', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'message' => 'Halo, ini pesan uji yang cukup panjang.',
        ])->assertCreated()->assertJsonPath('success', true);

        $this->assertDatabaseHas('messages', ['email' => 'budi@example.com', 'is_read' => false]);
    }

    public function test_contact_validation_rejects_short_message(): void
    {
        $this->postJson('/api/v1/contact', [
            'name' => 'Budi',
            'email' => 'budi@example.com',
            'message' => 'pendek',
        ])->assertStatus(422)->assertJsonValidationErrors(['message']);

        $this->assertDatabaseCount('messages', 0);
    }

    public function test_now_playing_reports_offline_without_credentials(): void
    {
        // No Spotify config in the test env → fail-soft offline, never an error.
        $this->getJson('/api/v1/now-playing')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_playing', false);
    }

    public function test_contact_queues_notification_and_autoreply_emails(): void
    {
        Mail::fake();

        $this->postJson('/api/v1/contact', [
            'name'    => 'Budi',
            'email'   => 'budi@example.com',
            'message' => 'Halo, ini pesan uji yang cukup panjang.',
        ])->assertCreated()->assertJsonPath('success', true);

        // Owner-notification mail queued once, addressed to the owner.
        Mail::assertQueued(ContactNotification::class, 1);
        Mail::assertQueued(ContactNotification::class, function (ContactNotification $mail) {
            return $mail->envelope()->to[0]->address
                === config('mail.owner_email', 'rathermyself08@gmail.com');
        });

        // Auto-reply queued once, addressed back to the sender.
        Mail::assertQueued(ContactAutoReply::class, 1);
        Mail::assertQueued(ContactAutoReply::class, function (ContactAutoReply $mail) {
            return $mail->envelope()->to[0]->address === 'budi@example.com';
        });
    }

    public function test_contact_honeypot_silently_drops_bot_submissions(): void
    {
        $this->postJson('/api/v1/contact', [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'Pesan yang cukup panjang dari bot.',
            'honeypot' => 'i-am-a-bot',
        ])->assertCreated()->assertJsonPath('success', true);

        // Pretends success but stores nothing.
        $this->assertDatabaseCount('messages', 0);
    }
}
