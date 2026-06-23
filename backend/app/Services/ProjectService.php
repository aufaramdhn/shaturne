<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
    /**
     * Create a project (+ optional images). Multi-table write → DB::transaction
     * (fail-closed §10.3): all-or-nothing.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $project = Project::create([
                'title' => $data['title'], // translatable {id, en}
                'slug' => $this->uniqueSlug($data['slug'] ?? $this->slugSource($data['title'])),
                'description' => $data['description'], // translatable {id, en}
                'stack' => $data['stack'] ?? [],
                'repo_url' => $data['repo_url'] ?? null,
                'demo_url' => $data['demo_url'] ?? null,
                'is_published' => $data['is_published'] ?? false,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            foreach (array_values($data['images'] ?? []) as $i => $path) {
                $project->images()->create(['path' => $path, 'order' => $i]);
            }

            return $project->load('images');
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Project $project, array $data): Project
    {
        return DB::transaction(function () use ($project, $data) {
            if (isset($data['slug'])) {
                $data['slug'] = $this->uniqueSlug($data['slug'], $project->id);
            }

            $project->update(array_intersect_key($data, array_flip([
                'title', 'slug', 'description', 'stack', 'repo_url', 'demo_url',
                'is_published', 'sort_order',
            ])));

            // Replace images only when the field is explicitly provided.
            if (array_key_exists('images', $data)) {
                $project->images()->delete();
                foreach (array_values($data['images'] ?? []) as $i => $path) {
                    $project->images()->create(['path' => $path, 'order' => $i]);
                }
            }

            return $project->fresh('images');
        });
    }

    public function delete(Project $project): void
    {
        // project_images cascade on delete (FK).
        $project->delete();
    }

    /**
     * Pick a string to derive the slug from a translatable title ({id, en}).
     *
     * @param  array<string, string>|string  $title
     */
    private function slugSource(array|string $title): string
    {
        if (is_string($title)) {
            return $title;
        }

        return $title['en'] ?? $title['id'] ?? (string) reset($title);
    }

    private function uniqueSlug(string $slug, ?string $ignoreId = null): string
    {
        $base = Str::slug($slug) ?: 'project';
        $candidate = $base;
        $n = 1;

        while (
            Project::where('slug', $candidate)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $candidate = "{$base}-{$n}";
            $n++;
        }

        return $candidate;
    }
}
