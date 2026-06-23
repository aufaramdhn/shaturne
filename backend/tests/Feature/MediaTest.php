<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MediaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_uploads_image_with_randomized_name(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->createAdmin());

        $res = $this->postJson('/api/v1/dashboard/media', [
            'file' => UploadedFile::fake()->image('photo.png', 100, 100),
        ]);

        $res->assertCreated()->assertJsonPath('success', true);
        $path = $res->json('data.path');

        $this->assertStringStartsWith('projects/', $path);
        $this->assertStringNotContainsString('photo', $path); // name randomized
        Storage::disk('public')->assertExists($path);
    }

    public function test_upload_rejects_non_image(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->createAdmin());

        $this->postJson('/api/v1/dashboard/media', [
            'file' => UploadedFile::fake()->create('malware.php', 10, 'application/x-php'),
        ])->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    public function test_upload_requires_authentication(): void
    {
        $this->postJson('/api/v1/dashboard/media', [
            'file' => UploadedFile::fake()->image('photo.png'),
        ])->assertUnauthorized();
    }

    public function test_admin_deletes_uploaded_media(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->createAdmin());

        $path = UploadedFile::fake()->image('x.png')->storeAs('projects', 'todelete.png', 'public');
        Storage::disk('public')->assertExists($path);

        $this->deleteJson('/api/v1/dashboard/media/todelete.png')->assertOk();
        Storage::disk('public')->assertMissing('projects/todelete.png');
    }

    public function test_delete_ignores_path_traversal(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->createAdmin());

        // basename() neutralizes traversal; nothing to delete → 404.
        $this->deleteJson('/api/v1/dashboard/media/'.urlencode('../../.env'))
            ->assertNotFound();
    }
}
