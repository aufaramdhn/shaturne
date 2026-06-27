<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // Spotify "now playing" — Authorization Code refresh token (user-scoped).
    // All three required; if any is empty the now-playing endpoint stays offline.
    'spotify' => [
        'client_id' => env('SPOTIFY_CLIENT_ID'),
        'client_secret' => env('SPOTIFY_CLIENT_SECRET'),
        'refresh_token' => env('SPOTIFY_REFRESH_TOKEN'),
    ],

    // GitHub contributions heatmap — PAT with read:user scope.
    // Both required; if missing the endpoint returns empty weeks (fail-soft).
    'github' => [
        'token' => env('GITHUB_PAT'),
        'username' => env('GITHUB_USERNAME'),
    ],

    // Groq AI chat — free tier (console.groq.com). Key required; if missing
    // ChatService returns the fallback string instead of calling the API.
    'groq' => [
        'key' => env('GROQ_API_KEY'),
        'model' => 'llama-3.1-8b-instant',
        'max_tokens' => 400,
    ],

];
