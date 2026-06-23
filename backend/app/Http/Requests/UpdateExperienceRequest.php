<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienceRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'array'],
            'title.id' => ['required_with:title', 'string', 'max:160'],
            'title.en' => ['required_with:title', 'string', 'max:160'],
            'organization' => ['sometimes', 'required', 'string', 'max:160'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['sometimes', 'nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['sometimes', 'nullable', 'array'],
            'description.id' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'type' => ['sometimes', 'required', 'string', 'in:work,organization,education,internship'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
