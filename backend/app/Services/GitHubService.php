<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GitHubService
{
    private const GRAPHQL = 'https://api.github.com/graphql';
    private const CACHE_TTL = 21600; // 6 hours

    /** @return array{weeks: array<int, array{firstDay: string, contributionDays: array<int, array{date: string, contributionCount: int, weekday: int}>}>, totalContributions: int, availableYears: int[]} */
    public function contributions(int $year): array
    {
        $token = config('services.github.token');
        $username = config('services.github.username');

        if (empty($token) || empty($username)) {
            return $this->empty($year);
        }

        $cacheKey = "github_contributions_{$username}_{$year}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($token, $username, $year) {
            return $this->fetch($token, $username, $year);
        });
    }

    private function fetch(string $token, string $username, int $year): array
    {
        $from = "{$year}-01-01T00:00:00Z";
        $to   = "{$year}-12-31T23:59:59Z";

        $query = <<<'GQL'
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  firstDay
                  contributionDays {
                    date
                    contributionCount
                    weekday
                  }
                }
              }
            }
            createdAt
          }
        }
        GQL;

        $response = Http::withToken($token)
            ->withHeaders(['Accept' => 'application/vnd.github+json'])
            ->timeout(10)
            ->post(self::GRAPHQL, [
                'query'     => $query,
                'variables' => ['login' => $username, 'from' => $from, 'to' => $to],
            ]);

        if (! $response->successful()) {
            return $this->empty($year);
        }

        $calendar = data_get($response->json(), 'data.user.contributionsCollection.contributionCalendar');
        $createdAt = data_get($response->json(), 'data.user.createdAt');

        if (! $calendar) {
            return $this->empty($year);
        }

        $startYear = $createdAt ? (int) substr($createdAt, 0, 4) : $year;
        $availableYears = range(date('Y'), $startYear);

        return [
            'weeks'              => $calendar['weeks'],
            'totalContributions' => $calendar['totalContributions'],
            'availableYears'     => $availableYears,
        ];
    }

    /** @return array{weeks: array<empty>, totalContributions: int, availableYears: int[]} */
    private function empty(int $year): array
    {
        return [
            'weeks'              => [],
            'totalContributions' => 0,
            'availableYears'     => [$year],
        ];
    }
}
