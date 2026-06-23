<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:80'],
            'category' => ['required', 'array'],
            'category.id' => ['required', 'string', 'max:60'],
            'category.en' => ['required', 'string', 'max:60'],
            'proficiency' => ['nullable', 'integer', 'min:0', 'max:100'],
            'icon' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['integer'],
        ];
    }
}
