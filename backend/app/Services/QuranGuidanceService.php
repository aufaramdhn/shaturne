<?php

namespace App\Services;

use App\Services\PromptGuard;
use Illuminate\Support\Facades\Http;

class QuranGuidanceService
{
    public function __construct(private readonly PromptGuard $guard) {}

    public function guide(string $feeling): array
    {
        $clean = $this->guard->sanitizeInput($feeling);

        if ($this->guard->isInjection($clean)) {
            throw new \RuntimeException('Input tidak valid.');
        }

        $lang = $this->detectLang($clean);
        $data = $this->askGroq($clean, $lang);

        if ($data === null) {
            throw new \RuntimeException('AI service unavailable.');
        }

        return $data;
    }

    private function askGroq(string $feeling, string $lang): ?array
    {
        $key = config('services.groq.key');
        if (empty($key)) {
            return null;
        }

        try {
            $res = Http::withToken($key)
                ->timeout(30)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'           => 'llama-3.3-70b-versatile',
                    'max_tokens'      => 900,
                    'temperature'     => 0.2,
                    'response_format' => ['type' => 'json_object'],
                    'messages'        => [
                        ['role' => 'system', 'content' => $this->systemPrompt($lang)],
                        ['role' => 'user', 'content' => $feeling],
                    ],
                ]);

            if (! $res->ok()) {
                return null;
            }

            $raw = (string) data_get($res->json(), 'choices.0.message.content', '');

            return $this->parseJson($raw);
        } catch (\Throwable $e) {
            report($e);

            return null;
        }
    }

    private function parseJson(string $raw): ?array
    {
        $raw = preg_replace('/^```(?:json)?\s*/i', '', trim($raw)) ?? $raw;
        $raw = preg_replace('/\s*```$/', '', $raw) ?? $raw;

        $data = json_decode(trim($raw), true);

        if (! is_array($data) || empty($data['verses'])) {
            return null;
        }

        $verses = array_values(array_filter($data['verses'], fn ($v) =>
            isset($v['surah'], $v['ayah'], $v['arabic'], $v['translation'])
            && is_numeric($v['surah']) && (int) $v['surah'] >= 1 && (int) $v['surah'] <= 114
            && is_numeric($v['ayah']) && (int) $v['ayah'] >= 1
        ));

        if (empty($verses)) {
            return null;
        }

        return [
            'reflection' => $data['reflection'] ?? '',
            'verses'     => array_map(fn ($v) => [
                'surah_number'      => (int) $v['surah'],
                'ayah_number'       => (int) $v['ayah'],
                'surah_name_arabic' => $v['surah_name_arabic'] ?? '',
                'surah_name_latin'  => $v['surah_name_latin'] ?? '',
                'arabic'            => $v['arabic'],
                'transliteration'   => $v['transliteration'] ?? '',
                'translation'       => $v['translation'],
            ], $verses),
        ];
    }

    private function detectLang(string $text): string
    {
        $idWords = [
            'aku', 'saya', 'gue', 'lagi', 'dan', 'ini', 'itu', 'yang',
            'dengan', 'tidak', 'merasa', 'perasaan', 'sedang', 'sangat',
            'banget', 'gimana', 'marah', 'sedih', 'galau', 'takut', 'khawatir',
            'bingung', 'kecewa', 'lelah', 'bersyukur', 'bahagia', 'senang',
            'kesepian', 'rindu', 'menyesal', 'semangat', 'capek', 'stress',
            'ngerasa', 'rasanya', 'kenapa', 'ya', 'sih', 'nih', 'deh',
        ];

        $words = (array) preg_split('/\W+/u', mb_strtolower($text), -1, PREG_SPLIT_NO_EMPTY);

        foreach ($words as $word) {
            if (in_array($word, $idWords, true)) {
                return 'Indonesian';
            }
        }

        return 'English';
    }

    private function systemPrompt(string $lang): string
    {
        $reflLang    = $lang === 'Indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';
        $transLang   = $lang === 'Indonesian' ? 'Indonesian' : 'English';

        return <<<PROMPT
You are a compassionate Islamic scholar. Given the user's emotional state, identify 1-3 Quran verses that are most relevant, comforting, or guiding.

Return ONLY valid JSON in exactly this format — no extra keys, no text outside:
{
  "verses": [
    {
      "surah": <integer 1-114>,
      "ayah": <integer>,
      "surah_name_latin": "<e.g. Al-Baqarah>",
      "surah_name_arabic": "<Arabic surah name>",
      "arabic": "<exact Arabic verse text with diacritics>",
      "transliteration": "<Latin transliteration of the Arabic>",
      "translation": "<{$transLang} translation of the verse>"
    }
  ],
  "reflection": "<2-3 sentences in {$reflLang} that compassionately connect these verses to the user's feeling>"
}

Rules:
- Only real, verifiable Quran references (surah 1-114, ayah within valid range)
- 1-3 verses maximum
- Arabic text must be accurate Uthmani script with full diacritics
- Reflection must be in {$reflLang}
- Be warm, spiritually thoughtful, and supportive
PROMPT;
    }
}
