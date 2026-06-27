<?php

namespace App\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class QuranGuidanceService
{
    private const QURAN_API = 'https://api.alquran.cloud/v1/ayah';
    // Arabic (Uthmani) + Latin transliteration + Indonesian translation
    private const EDITIONS = 'quran-uthmani,en.transliteration,id.indonesian';

    public function guide(string $feeling): array
    {
        $lang = $this->detectLang($feeling);
        $groqData = $this->askGroq($feeling, $lang);

        if ($groqData === null) {
            throw new \RuntimeException('AI service unavailable.');
        }

        $refs = array_slice($groqData['verses'], 0, 3);
        $verses = $this->fetchVerses($refs);

        return [
            'reflection' => $groqData['reflection'] ?? '',
            'verses' => array_values(array_filter($verses)),
        ];
    }

    private function askGroq(string $feeling, string $lang): ?array
    {
        $key = config('services.groq.key');
        if (empty($key)) {
            return null;
        }

        try {
            $res = Http::withToken($key)
                ->timeout(20)
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model'           => config('services.groq.model', 'llama-3.1-8b-instant'),
                    'max_tokens'      => 300,
                    'temperature'     => 0.3,
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

    /** Fetch 1-3 verses in parallel. */
    private function fetchVerses(array $refs): array
    {
        if (empty($refs)) {
            return [];
        }

        try {
            $responses = Http::pool(function (Pool $pool) use ($refs) {
                return array_map(
                    fn ($ref) => $pool->timeout(10)->get(
                        self::QURAN_API . "/{$ref['surah']}:{$ref['ayah']}/editions/" . self::EDITIONS
                    ),
                    $refs
                );
            });

            return array_map(function ($res, $ref) {
                if (! $res->ok()) {
                    return null;
                }
                $data = $res->json('data');
                if (! is_array($data) || count($data) < 3) {
                    return null;
                }

                return [
                    'surah_number'      => (int) $ref['surah'],
                    'ayah_number'       => (int) $ref['ayah'],
                    'surah_name_arabic' => data_get($data, '0.surah.name'),
                    'surah_name_latin'  => data_get($data, '0.surah.englishName'),
                    'arabic'            => data_get($data, '0.text'),
                    'transliteration'   => data_get($data, '1.text'),
                    'translation'       => data_get($data, '2.text'),
                ];
            }, $responses, $refs);
        } catch (\Throwable $e) {
            report($e);

            return [];
        }
    }

    /** Extract JSON even if the model wraps it in markdown fences. */
    private function parseJson(string $raw): ?array
    {
        // Strip ```json ... ``` or ``` ... ``` fences
        $raw = preg_replace('/^```(?:json)?\s*/i', '', trim($raw)) ?? $raw;
        $raw = preg_replace('/\s*```$/', '', $raw) ?? $raw;

        $data = json_decode(trim($raw), true);

        if (! is_array($data) || empty($data['verses'])) {
            return null;
        }

        // Validate: surah must be 1-114
        $data['verses'] = array_filter($data['verses'], fn ($v) =>
            isset($v['surah'], $v['ayah'])
            && is_numeric($v['surah']) && (int) $v['surah'] >= 1 && (int) $v['surah'] <= 114
            && is_numeric($v['ayah']) && (int) $v['ayah'] >= 1
        );

        return empty($data['verses']) ? null : $data;
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
        $reflLang = $lang === 'Indonesian' ? 'Indonesian (Bahasa Indonesia)' : 'English';

        return <<<PROMPT
You are a compassionate Islamic scholar assistant. Given the user's emotional state, identify 1-3 Quran verses that are most relevant, comforting, or guiding for that feeling.

Return ONLY valid JSON in exactly this format:
{
  "verses": [
    {"surah": <integer 1-114>, "ayah": <integer>}
  ],
  "reflection": "<2-3 sentences in {$reflLang} that compassionately connect these verses to the user's feeling>"
}

Rules:
- Only real, verifiable Quran references (surah 1-114, ayah within valid range for that surah)
- 1-3 verses maximum
- reflection MUST be in {$reflLang}
- Be warm, spiritually thoughtful, and supportive
- No text outside the JSON object
PROMPT;
    }
}
