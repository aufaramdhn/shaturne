<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Experience extends Model
{
    use HasTranslations;
    use HasUuids;

    /** @var array<int, string> */
    public array $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'organization',
        'start_date',
        'end_date',
        'description',
        'type',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'sort_order' => 'integer',
    ];
}
