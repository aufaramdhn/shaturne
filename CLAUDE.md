# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo with two independent deployable units:

```
frontend/   React SPA (Vite + TypeScript) — deployed to Vercel/Netlify
backend/    Laravel 13 REST API — deployed to VPS/Railway
docs/       PRD.md (product requirements) + DESIGN.md (architecture & design system)
```

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React (Vite), TypeScript, Redux Toolkit, Framer Motion, React Router, Axios |
| Styling | Tailwind CSS + design tokens in `Constants/theme.ts` |
| Backend | Laravel 13, Sanctum (SPA cookie auth), Eloquent, spatie/laravel-permission |
| Database | MySQL / PostgreSQL |
| Testing FE | Vitest + React Testing Library, Playwright (E2E) |
| Testing BE | Pest / PHPUnit |

## Frontend Architecture

Atomic Design with strict dependency rules:

```
Elements (atoms)     → no Hooks, Services, or Redux imports
Fragments (molecules/organisms) → can use Elements, Hooks, Animations
Layouts (templates)  → wraps Fragments
Pages                → top level, can import anything below
Hooks                → can use Services and Redux, never Components
Services             → can use Config and Constants only
```

Animations are centralized in `Animations/`:
- `variants.ts` — reusable Framer Motion variants (`fadeUp`, `staggerContainer`, `scaleIn`)
- `transitions.ts` — page transition presets for `<AnimatePresence>`
- `useScrollReveal.ts` — thin wrapper over `useInView({ once: true, margin: "-100px" })`

Every animation variant must have a `prefers-reduced-motion` instant fallback. Use `useReducedMotion()` from Framer Motion — never gate content visibility on an animation class.

Only animate `transform` and `opacity` (GPU-accelerated). Never animate `width`, `height`, or `top`.

## State Management

- **Redux** (`AuthSlice`, `UiSlice`, `ProjectSlice`) for cross-page domain state
- **Context API** for local UI state (sidebar open/closed, theme toggle)
- Data flow: `Component → Hook → Thunk → Service (Axios) → Redux slice → useSelector via Hook`
  Components never import Services or dispatch directly — always through Hooks.

## API Conventions

All endpoints prefixed `/api/v1/`. Public vs dashboard endpoints:

```
GET  /api/v1/projects          public list (paginated)
GET  /api/v1/projects/{slug}   public detail
POST /api/v1/dashboard/projects   auth required (CRUD)
```

Standard response envelope:
```json
{ "success": true, "data": {}, "message": "OK" }
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```

Axios instance (`Services/Common/axiosInstance.ts`) must have `withCredentials: true`. Interceptors handle: `401` → dispatch logout + redirect; `419` → refresh CSRF cookie + retry once; `422` → surface validation errors to the calling form.

## Auth Architecture

Laravel Sanctum SPA cookie mode — **not JWT in localStorage**. The cookie is `httpOnly` so JS cannot read it. Frontend Protected route is UX-only; every sensitive action must be authorized server-side via Policy classes.

## Backend Rules

- Controllers are thin: receive request → call Service → return Resource. No business logic in Controllers.
- Every write endpoint uses a dedicated Form Request for validation. Never `$request->all()` directly into a Model.
- All Models declare explicit `$fillable`. Never use `$guarded = []`.
- Every sensitive action has a corresponding Policy class (`$this->authorize()` in Controller).
- **UUID primary keys**: `Project`, `Skill`, `Experience`, `Message` models use `HasUuids` trait. Dashboard endpoints use `{uuid}` as route parameter. Public endpoints keep `{slug}`. See §10.2 DESIGN.md.
- **Fail-closed**: Any Service method writing to 2+ tables must be wrapped in `DB::transaction()`. No partial writes. See §10.3 DESIGN.md.
- **Exception handler**: Never expose stack traces to clients. Custom handler returns generic JSON envelope; full detail goes to Laravel log only. `APP_DEBUG=false` in staging/production. See §10.11 DESIGN.md.

## Security Non-Negotiables

- Never `dangerouslySetInnerHTML` without DOMPurify sanitization first.
- API Resources (`ProjectResource`, etc.) control exactly what fields are exposed — never `toJson()` a raw Model.
- File uploads: MIME whitelist (`jpg`, `png`, `webp`), randomize filename on save, store in `storage/app/public` (not `public/uploads`).
- `.env` is never committed. Run `composer audit` and `npm audit` in CI before deploy.

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `ProjectCard.tsx` |
| Custom hooks | camelCase + `use` prefix | `useProjects.ts` |
| Redux slices | PascalCase + `Slice` | `AuthSlice.ts` |
| Services | camelCase | `projectService.ts` |
| Route paths | kebab-case | `/project-detail/:slug` |
| Commit messages | Conventional Commits | `feat:`, `fix:`, `chore:` |

## Linting & Commits

- Frontend: ESLint + Prettier, enforced via Husky pre-commit hook. Must pass before commit.
- Backend: Laravel Pint (PSR-12).

## Design System

Visual concept: **dark modern SaaS** (navy + cyan glow). The original "Catatan Kerja" editorial concept was dropped 2026-06-22 by user decision (full detail: DESIGN.md §6). The "working notes" motif survives only as concrete cards (NotesCard `catatan-kerja.md`, SpotifyCard now-playing), not as the overall theme.

Theme controlled via `data-theme="dark"|"light"` on `<html>`, default dark. Preference saved to `localStorage` via `UiSlice`/`ThemeContext`. All colors are OKLCH CSS custom properties defined directly in `Resources/Global.css` (`:root` dark + `[data-theme='light']` override); `Constants/theme.ts` only references the variable names.

Key color tokens (OKLCH; navy bg + cyan accent + violet pair):

| Token | OKLCH (dark) | Role |
|---|---|---|
| `--color-bg` | `oklch(15% 0.024 265)` | Page background — navy |
| `--color-surface` | `oklch(19% 0.028 265)` | Card / section background |
| `--color-surface-raised` | `oklch(24% 0.032 265)` | Dropdown / modal / tooltip |
| `--color-text` | `oklch(97% 0.005 250)` | Primary text |
| `--color-text-muted` | `oklch(71% 0.022 258)` | Caption, meta, placeholder |
| `--color-accent` | `oklch(82% 0.135 195)` | **Cyan** — interactive, link, focus ring, glow |
| `--color-accent-2` | `oklch(62% 0.19 285)` | **Violet** — gradient pair, secondary badge |
| `--color-error` | `oklch(68% 0.19 25)` | Error state |

`--color-accent-strong` (pekat) + `--glow-accent` (box-shadow cyan) round it out. Light mode darkens accents for contrast.

Typography (Google Fonts — no browser defaults; Fraunces dropped):
- **Display**: Bricolage Grotesque (variable) — h1–h4, hero, wordmark
- **Body**: Hanken Grotesk (wght 300–800) — all UI text
- **Mono**: IBM Plex Mono — stack tags, dates, eyebrow, code, status

**All form components are custom-built** (`appearance: none` everywhere). Explicit default / hover / focus / disabled / error states in both themes. Focus rings never removed.

Signature: **aurora glow** (`AuroraBackground` — 2 drifting blurred cyan/violet blobs) + floating glow cards (hover lift + glow border) + scrolling skill `Marquee` + branded `Preloader`.

**Animation: forced on.** `<MotionConfig reducedMotion="never">` in `App.tsx` + the `@media (prefers-reduced-motion)` block removed from `Global.css`. `prefers-reduced-motion` is intentionally ignored (user decision). Do NOT re-enable reduced-motion gating without asking.

**Performance:** never put `backdrop-blur` over the animated aurora (causes jank) — use solid translucent bg (`/80`–`/95`). Animate `transform`/`opacity` only (use `scaleX`/`scaleY`, not `width`/`height`).

## i18n

Public site is bilingual (ID + EN), custom implementation (no library). **Locale in URL**: public routes prefixed `/:lang` (`/id/projects`, `/en/contact`); `/` redirects to detected lang; dashboard/login not prefixed. `Locales/{id,en}.ts` dictionaries + `Locales/index.ts` (`Lang`, `detectLang`, `tx`); `Context/LanguageContext.tsx` provides `{ lang, t, switchLang }`. Use `t('a.b', {var})` for UI strings, `tx(field, lang)` for `LocalizedText` dummy content, `localePath(lang, route)` for every internal `Link`. `id.ts` must NOT use `as const` (literal types break `en`). Full spec: DESIGN.md §16.

**Backend i18n**: DB prose is localized via `spatie/laravel-translatable` — JSON `{id, en}` columns (`projects.title/description`, `skills.category`, `experiences.title/description`); `slug`/`name`/`organization`/`type` stay single. `SetLocale` middleware resolves locale (`?lang=` → `Accept-Language` → default). Public Resources output the resolved string; `App\Http\Resources\Dashboard\*` output the full `{id, en}` map for editing. Form Requests validate `field.id` + `field.en`. The axios interceptor appends `?lang=<UI lang>` (see `Services/Common/locale.ts`). Never `orderBy()` a translatable JSON column (Postgres can't order it).

## Skeleton Loading

Every API-fetching component requires a skeleton counterpart (not a generic spinner):

| Component | Skeleton |
|---|---|
| `ProjectCard` | `ProjectCardSkeleton` |
| `ProjectDetail` | `ProjectDetailSkeleton` |
| Dashboard tables | `TableRowSkeleton` |

Base atom: `SkeletonBox.tsx` with CSS shimmer animation.

## Key Docs

- `docs/PRD.md` — full feature requirements, personas, success metrics
- `docs/DESIGN.md` — folder structure, dependency rules, animation system, security checklist, API conventions, DB schema
