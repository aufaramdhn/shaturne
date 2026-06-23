<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // dashboard group gated by auth:sanctum + role:admin
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.id' => ['required', 'string', 'max:160'],
            'title.en' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:180'],
            'description' => ['required', 'array'],
            'description.id' => ['required', 'string'],
            'description.en' => ['required', 'string'],
            'stack' => ['nullable', 'array'],
            'stack.*' => ['string', 'max:60'],
            'repo_url' => ['nullable', 'url', 'max:255'],
            'demo_url' => ['nullable', 'url', 'max:255'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'max:255'],
        ];
    }
}
