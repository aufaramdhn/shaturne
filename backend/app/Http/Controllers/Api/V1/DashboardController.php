<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    // GET /api/v1/dashboard/overview
    public function overview(): JsonResponse
    {
        return $this->ok([
            'projects' => Project::count(),
            'published' => Project::where('is_published', true)->count(),
            'skills' => Skill::count(),
            'experiences' => Experience::count(),
            'messages' => Message::count(),
            'unread' => Message::where('is_read', false)->count(),
        ]);
    }

    // PUT /api/v1/dashboard/profile
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($data);

        return $this->ok(new UserResource($user), 'Profil diperbarui.');
    }

    // POST /api/v1/dashboard/media — single image upload (project cover/gallery)
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            // MIME whitelist (§ Security) — extension + real MIME both checked by `mimes`.
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        $file = $request->file('file');

        // Randomized filename — never trust the client name (§ Security).
        $name = Str::random(40).'.'.strtolower($file->getClientOriginalExtension());

        // storage/app/public/projects — served via the storage:link symlink.
        $path = $file->storeAs('projects', $name, 'public');

        return $this->ok([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
        ], 'Terunggah.', 201);
    }

    // DELETE /api/v1/dashboard/media/{filename}
    public function deleteMedia(string $filename): JsonResponse
    {
        // basename() strips any path-traversal (../) — only a bare filename survives.
        $safe = basename($filename);
        $path = 'projects/'.$safe;

        if (! Storage::disk('public')->exists($path)) {
            return $this->fail('Berkas tidak ditemukan.', 404);
        }

        Storage::disk('public')->delete($path);

        return $this->ok(null, 'Terhapus.');
    }
}
