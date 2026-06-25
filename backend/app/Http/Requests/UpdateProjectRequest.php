<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'array'],
            'title.id' => ['required_with:title', 'string', 'max:160'],
            'title.en' => ['required_with:title', 'string', 'max:160'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:180'],
            'description' => ['sometimes', 'required', 'array'],
            'description.id' => ['required_with:description', 'string'],
            'description.en' => ['required_with:description', 'string'],
            'stack' => ['sometimes', 'nullable', 'array'],
            'stack.*' => ['string', 'max:60'],
            'repo_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'demo_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer'],
            'images' => ['sometimes', 'nullable', 'array'],
            'images.*' => ['string', 'max:255'],
        ];
    }
}
