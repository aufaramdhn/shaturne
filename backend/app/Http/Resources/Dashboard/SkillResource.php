<?php

namespace App\Http\Resources\Dashboard;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Dashboard view — `category` as the full {id, en} translation map.
/** @mixin Skill */
class SkillResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->id,
            'name' => $this->name,
            'category' => $this->getTranslations('category'),
            'proficiency' => $this->proficiency,
            'icon' => $this->icon,
        ];
    }
}
