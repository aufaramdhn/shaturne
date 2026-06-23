<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Resolves the request locale for translatable content (spatie). Precedence:
// ?lang query → Accept-Language header → app default. Only supported locales win.
class SetLocale
{
    private const SUPPORTED = ['id', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $lang = $request->query('lang');

        if (! is_string($lang) || ! in_array($lang, self::SUPPORTED, true)) {
            $lang = $request->getPreferredLanguage(self::SUPPORTED);
        }

        if (is_string($lang) && in_array($lang, self::SUPPORTED, true)) {
            app()->setLocale($lang);
        }

        return $next($request);
    }
}
