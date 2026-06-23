<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Skill extends Model
{
    use HasTranslations;
    use HasUuids;

    /** @var array<int, string> */
    public array $translatable = ['category'];

    protected $fillable = [
        'name',
        'category',
        'proficiency',
        'icon',
        'sort_order',
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'sort_order' => 'integer',
    ];
}
