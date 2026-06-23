<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

// Proxies the Spotify Web API "currently playing" using a user-scoped refresh
// token. Fail-soft: any missing config or upstream error reports offline so the
// public endpoint never leaks errors or credentials.
class SpotifyService
{
    /** @var array{is_playing: false} */
    private const OFFLINE = ['is_playing' => false];

    /**
     * @return array<string, mixed>
     */
    public function nowPlaying(): array
    {
        $cfg = config('services.spotify');

        if (empty($cfg['client_id']) || empty($cfg['client_secret']) || empty($cfg['refresh_token'])) {
            return self::OFFLINE;
        }

        try {
            $token = $this->accessToken($cfg);
            if (! $token) {
                return self::OFFLINE;
            }

            $res = Http::withToken($token)
                ->get('https://api.spotify.com/v1/me/player/currently-playing');

            // 204 = nothing playing; anything non-2xx → offline.
            if ($res->status() === 204 || ! $res->ok()) {
                return self::OFFLINE;
            }

            $data = $res->json();

            if (! data_get($data, 'is_playing') || data_get($data, 'currently_playing_type') !== 'track') {
                return self::OFFLINE;
            }

            $name = data_get($data, 'item.name');
            if (! $name) {
                return self::OFFLINE;
            }

            return [
                'is_playing' => true,
                'track' => (string) $name,
                'artist' => collect(data_get($data, 'item.artists', []))->pluck('name')->implode(', '),
                'album_image' => data_get($data, 'item.album.images.0.url'),
                'url' => data_get($data, 'item.external_urls.spotify'),
                'progress_ms' => (int) data_get($data, 'progress_ms', 0),
                'duration_ms' => (int) data_get($data, 'item.duration_ms', 0),
            ];
        } catch (\Throwable $e) {
            report($e);

            return self::OFFLINE;
        }
    }

    /**
     * @param  array<string, mixed>  $cfg
     */
    private function accessToken(array $cfg): ?string
    {
        $cached = Cache::get('spotify.access_token');
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        $res = Http::asForm()
            ->withBasicAuth((string) $cfg['client_id'], (string) $cfg['client_secret'])
            ->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'refresh_token',
                'refresh_token' => (string) $cfg['refresh_token'],
            ]);

        if (! $res->ok()) {
            return null;
        }

        $token = $res->json('access_token');
        $expires = (int) ($res->json('expires_in') ?? 3600);

        if (is_string($token) && $token !== '') {
            Cache::put('spotify.access_token', $token, now()->addSeconds(max($expires - 60, 60)));

            return $token;
        }

        return null;
    }
}
