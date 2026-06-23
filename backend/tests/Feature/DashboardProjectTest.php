<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_dashboard_projects(): void
    {
        $this->getJson('/api/v1/dashboard/projects')->assertUnauthorized();
        $this->postJson('/api/v1/dashboard/projects', [])->assertUnauthorized();
    }

    public function test_non_admin_is_forbidden(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/dashboard/projects')->assertForbidden();
    }

    public function test_admin_creates_project_with_generated_slug_and_images(): void
    {
        Sanctum::actingAs($this->createAdmin());

        $res = $this->postJson('/api/v1/dashboard/projects', [
            'title' => ['id' => 'Proyek Baru', 'en' => 'My New Project'],
            'description' => ['id' => 'Deskripsi.', 'en' => 'A description.'],
            'stack' => ['React', 'Laravel'],
            'is_published' => true,
            'images' => ['projects/a.png', 'projects/b.png'],
        ]);

        $res->assertCreated()->assertJsonPath('success', true);

        // Slug derived from the English title; dashboard returns the full map.
        $this->assertDatabaseHas('projects', ['slug' => 'my-new-project']);
        $project = Project::first();
        $this->assertSame('Proyek Baru', $project->getTranslation('title', 'id'));
        $this->assertSame('My New Project', $project->getTranslation('title', 'en'));
        $this->assertCount(2, $project->images);
        $this->assertSame('projects/a.png', $project->images->firstWhere('order', 0)->path);
    }

    public function test_slug_collisions_are_made_unique(): void
    {
        Sanctum::actingAs($this->createAdmin());
        Project::create(['title' => ['id' => 'Dup', 'en' => 'Dup'], 'slug' => 'dup', 'description' => ['id' => 'x', 'en' => 'x'], 'stack' => [], 'is_published' => true]);

        $this->postJson('/api/v1/dashboard/projects', [
            'title' => ['id' => 'Dup', 'en' => 'Dup'],
            'description' => ['id' => 'another', 'en' => 'another'],
            'stack' => [],
            'is_published' => false,
        ])->assertCreated();

        $this->assertDatabaseHas('projects', ['slug' => 'dup-1']);
    }

    public function test_admin_updates_and_deletes_project(): void
    {
        Sanctum::actingAs($this->createAdmin());
        $project = Project::create(['title' => ['id' => 'Lama', 'en' => 'Old'], 'slug' => 'old', 'description' => ['id' => 'x', 'en' => 'x'], 'stack' => [], 'is_published' => false]);

        $this->putJson("/api/v1/dashboard/projects/{$project->id}", [
            'title' => ['id' => 'Judul Baru', 'en' => 'New Title'],
            'description' => ['id' => 'x', 'en' => 'x'],
            'stack' => [],
            'is_published' => true,
        ])->assertOk();

        $this->assertSame('New Title', $project->fresh()->getTranslation('title', 'en'));

        $this->deleteJson("/api/v1/dashboard/projects/{$project->id}")->assertOk();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_create_validation_requires_title(): void
    {
        Sanctum::actingAs($this->createAdmin());

        $this->postJson('/api/v1/dashboard/projects', ['description' => ['id' => 'x', 'en' => 'x']])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }
}
