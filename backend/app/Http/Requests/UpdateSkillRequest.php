<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:80'],
            'category' => ['sometimes', 'required', 'array'],
            'category.id' => ['required_with:category', 'string', 'max:60'],
            'category.en' => ['required_with:category', 'string', 'max:60'],
            'proficiency' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
            'icon' => ['sometimes', 'nullable', 'string', 'max:120'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
