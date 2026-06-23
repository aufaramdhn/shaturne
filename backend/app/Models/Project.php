<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations;
    use HasUuids;

    /** @var array<int, string> */
    public array $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'slug',
        'description',
        'stack',
        'repo_url',
        'demo_url',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'stack' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    /**
     * @return HasMany<ProjectImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('order');
    }
}
