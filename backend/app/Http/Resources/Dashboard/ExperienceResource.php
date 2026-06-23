<?php

namespace App\Http\Resources\Dashboard;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Dashboard view — `title`/`description` as full {id, en} translation maps.
/** @mixin Experience */
class ExperienceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->id,
            'title' => $this->getTranslations('title'),
            'organization' => $this->organization,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'description' => $this->getTranslations('description'),
            'type' => $this->type,
        ];
    }
}
