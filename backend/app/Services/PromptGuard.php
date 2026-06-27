<?php

namespace App\Services;

class PromptGuard
{
    /** @var string[] */
    private const INJECTION_PATTERNS = [
        '/ignore\s+(previous|above|all)\s+instructions/i',
        '/you\s+are\s+now\b/i',
        '/act\s+as\b/i',
        '/pretend\s+you/i',
        '/jailbreak/i',
        '/\[system\]/i',
        '/new\s+instructions?/i',
        '/base64|rot13|hex\s+encode/i',
        '/[.\-]{8,}/',
    ];

    public function isInjection(string $input): bool
    {
        foreach (self::INJECTION_PATTERNS as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    public function sanitizeInput(string $input): string
    {
        // Strip dangerous tag content (script, style, etc.) before removing tags,
        // because strip_tags() keeps inner text which would leak JS code.
        $stripped = preg_replace(
            '/<(script|style|iframe|object|embed)\b[^>]*>.*?<\/\1>/is',
            '',
            $input,
        );
        $clean = strip_tags(trim((string) $stripped));

        return mb_substr($clean, 0, 500);
    }

    /**
     * @param  string[]  $sensitiveKeywords
     */
    public function sanitizeOutput(string $output, array $sensitiveKeywords = []): string
    {
        $defaults = ['GROQ_API_KEY', 'APP_KEY', 'system prompt', 'instruksi sistem'];
        $keywords = array_merge($defaults, $sensitiveKeywords);

        foreach ($keywords as $keyword) {
            if (str_contains(strtolower($output), strtolower($keyword))) {
                return 'Maaf, tidak bisa menjawab pertanyaan itu.';
            }
        }

        return $output;
    }
}
