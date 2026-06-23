<?php

namespace App\Http\Resources\Dashboard;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

// Dashboard view — exposes the full {id, en} translation map (not a resolved
// string) so the admin can edit every locale. Public uses App\Http\Resources.
/** @mixin Project */
class ProjectResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->id,
            'title' => $this->getTranslations('title'),
            'slug' => $this->slug,
            'description' => $this->getTranslations('description'),
            'stack' => $this->stack ?? [],
            'repo_url' => $this->repo_url,
            'demo_url' => $this->demo_url,
            'is_published' => $this->is_published,
            'images' => $this->whenLoaded(
                'images',
                fn () => $this->images->map(fn ($img) => [
                    'path' => $img->path,
                    'url' => Storage::disk('public')->url($img->path),
                    'order' => $img->order,
                ]),
                []
            ),
        ];
    }
}
