<div align="center">

# ✦ Shaturne

<p>Personal portfolio — dark, bilingual, full-stack.</p>

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white&labelColor=0d1117)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white&labelColor=0d1117)](https://www.typescriptlang.org)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat-square&logo=laravel&logoColor=white&labelColor=0d1117)](https://laravel.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=0d1117)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white&labelColor=0d1117)](https://vitejs.dev)

[![CI](https://img.shields.io/github/actions/workflow/status/aufaramdhn/shaturne/ci.yml?branch=main&style=flat-square&label=CI&labelColor=0d1117)](https://github.com/aufaramdhn/shaturne/actions)
[![License](https://img.shields.io/badge/license-MIT-a855f7?style=flat-square&labelColor=0d1117)](LICENSE)

</div>

---

## Overview

Shaturne is a personal portfolio built as a production-grade monorepo. The public site is bilingual (ID/EN) with a dark navy × cyan × violet design system. A private dashboard lets the owner manage projects, skills, and work experience — all gated behind Sanctum SPA cookie auth.

```
frontend/   React SPA (Vite + TypeScript) — Vercel / Netlify
backend/    Laravel 13 REST API           — VPS / Railway
docs/       PRD.md · DESIGN.md
```

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19 + Vite 6 + TypeScript
- Redux Toolkit · React Router v7
- Framer Motion (forced-on animations)
- Tailwind CSS v4 (CSS-first, OKLCH tokens)
- Custom i18n — ID/EN, locale in URL (`/:lang`)
- Vitest · Playwright E2E

</td>
<td valign="top" width="50%">

**Backend**
- Laravel 13 + PHP 8.4
- Sanctum SPA cookie auth (no JWT in localStorage)
- spatie/laravel-permission
- spatie/laravel-translatable (JSON `{id,en}` columns)
- UUID primary keys · DB::transaction fail-closed
- PHPStan level 5 · PHPUnit / Pest

</td>
</tr>
</table>

---

## Getting Started

### Prerequisites

- Node 22+ · npm
- PHP 8.4+ · Composer
- PostgreSQL 16+ (or MySQL 8+)

### Frontend

```bash
cd frontend
cp .env.example .env          # set VITE_API_URL
npm install
npm run dev                   # http://localhost:5173
```

### Backend

```bash
cd backend
cp .env.example .env          # fill DB_*, APP_KEY, GROQ_API_KEY, SPOTIFY_*
composer install
php artisan key:generate
php artisan migrate --seed    # seeds bilingual demo data
php artisan storage:link
php artisan serve             # http://localhost:8000
```

> First-run admin credentials are set in `DatabaseSeeder.php`.

---

## Features

| Area | Detail |
|---|---|
| **Public site** | Home · Projects · Project detail · Contact |
| **i18n** | ID + EN, `/:lang` prefix, custom `t()` / `tx()` helpers |
| **Playground** | AI chat · API Explorer · Tech Stack viewer · GitHub stats · Dev Tools · Qur'an Guidance |
| **Qur'an Guidance** | Write your feeling → AI finds relevant Quranic verses with Arabic, transliteration, and translation |
| **Dashboard** | Projects (with image upload) · Skills · Experience · Inbox |
| **Auth** | Sanctum SPA cookie, httpOnly, CSRF-refresh interceptor |
| **Media** | MIME whitelist (jpg/png/webp), randomised filename, `storage/app/public` |
| **SEO** | Per-page meta/OG/JSON-LD/hreflang, `robots.txt` |
| **Spotify** | "Now playing" proxy — Authorization Code refresh token, fail-soft offline |
| **Design** | Aurora glow background · floating glow cards · skill marquee · branded preloader |

---

## Project Structure

```
frontend/src/
├── Animations/          Framer Motion variants + transitions
├── Components/
│   ├── Elements/        Atoms  — no Hooks / Services / Redux
│   ├── Fragments/
│   │   ├── Auth/        AuthBootstrap
│   │   ├── Backgrounds/ AuroraBackground
│   │   ├── Cards/       ProjectCard · SpotifyCard · NotesCard · skeletons
│   │   ├── Chat/        ChatWindow · ChatMessage · ChatShortcuts
│   │   ├── DevTools/    DevToolsWindow
│   │   ├── Forms/       ContactForm · LoginForm
│   │   ├── GitHub/      GitHubWindow
│   │   ├── Navigation/  Navbar · Footer · LanguageSwitcher · ThemeToggle
│   │   ├── Quran/       QuranWindow
│   │   ├── Sandbox/     SandboxWindow · EndpointList · ParamForm · ResponseViewer
│   │   ├── Sections/    HeroSection · AboutSection · SkillsSection · …
│   │   ├── TechStack/   TechStackWindow
│   │   └── UI/          Section · Marquee · Preloader · ScrollProgressBar
│   └── Layouts/         MainLayout · AuthLayout · DashboardLayout
├── Context/             Local UI state (theme, sidebar, language)
├── Hooks/
│   ├── Auth/            useAuth · useLogin · useAuthCheck
│   ├── Common/          useSeo
│   ├── Dashboard/       useDashProjects · useDashSkills · …
│   └── Public/          useProjects · useSkills · useChat · useSandbox · …
├── Pages/
│   ├── Auth/Login/
│   ├── Common/NotFound/
│   ├── Dashboard/       Overview · Projects · Skills · Experience · Inbox · Profile
│   └── Public/          Home · Projects · ProjectDetail · Contact · Playground
├── Redux/               AuthSlice · UiSlice · ProjectSlice
├── Services/
│   ├── Auth/            authService
│   ├── Common/          axiosInstance · locale
│   ├── Dashboard/       dashboardService
│   └── Public/          projectService · skillService · chatService · quranService · …
└── Types/               api.ts

backend/app/
├── Http/Controllers/Api/V1/
├── Http/Requests/       Form Requests — one per write endpoint
├── Http/Resources/      Public + Dashboard\ namespaces
├── Models/              HasUuids · HasTranslations · explicit $fillable
└── Services/            ChatService · QuranGuidanceService · PromptGuard · …
```

---

## Design System

**Dark SaaS** — navy background, cyan accent, violet gradient pair.

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `oklch(15% 0.024 265)` | Page background |
| `--color-surface` | `oklch(19% 0.028 265)` | Card / section background |
| `--color-accent` | `oklch(82% 0.135 195)` | Cyan — links, focus, glow |
| `--color-accent-2` | `oklch(70% 0.15 285)` | Violet — gradient pair |
| `--color-text` | `oklch(97% 0.005 250)` | Primary text |
| `--color-text-muted` | `oklch(71% 0.022 258)` | Caption, meta, placeholder |

Typography: **Bricolage Grotesque** (display) · **Hanken Grotesk** (body) · **IBM Plex Mono** (mono/code).

Animations run unconditionally (`MotionConfig reducedMotion="never"` — intentional design decision).

---

## API

All endpoints prefixed `/api/v1/`. Standard response envelope:

```json
{ "success": true,  "data": {},    "message": "OK" }
{ "success": false, "message": "…", "errors": { "field": ["…"] } }
```

Public endpoints are language-aware via `?lang=id|en`.

### Rate limits (per IP)

| Endpoint | Limit |
|---|---|
| `POST /auth/login` | 5 / min |
| `GET /projects`, `/skills`, `/experience` | 120 / min |
| `POST /contact` | 3 / 10 min |
| `GET /now-playing` | 60 / min |
| `POST /chat` | 10 / min · 50 / day |
| `POST /quran` | 10 / min · 30 / day |

---

## Security

- Sanctum SPA cookie auth — `httpOnly`, no token in `localStorage`
- All write endpoints use dedicated Form Request classes
- Dashboard routes double-gated: `auth:sanctum` + `role:admin` Policy
- File uploads: MIME whitelist, randomised filename, not served from `public/`
- AI endpoints: `PromptGuard` injection detection + output sanitization
- Exception handler: stack traces logged server-side only, never in API response
- `APP_DEBUG=false` required in staging / production

---

## CI

GitHub Actions runs on every push to `main` / `develop`:

1. **Frontend** — ESLint · npm audit · Vitest · Vite build
2. **Backend** — Pint · composer audit · PHPStan L5 · PHPUnit (PostgreSQL service)
3. **E2E** — Playwright (Chromium, frontend-only, no backend required)

---

## License

MIT — see [LICENSE](LICENSE).
