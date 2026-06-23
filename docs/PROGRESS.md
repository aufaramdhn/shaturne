# PROGRESS.md
Tracking implementasi per §15 DESIGN.md. Update tiap fase selesai.

---

## Phase 0 — Scaffold ✅ SELESAI

### Frontend
- [x] Vite + React + TypeScript init
- [x] `tsconfig.json` — `jsx`, path alias `@/*`, `verbatimModuleSyntax`, `ignoreDeprecations`
- [x] `vite.config.ts` — `@tailwindcss/vite`, path alias `@`
- [x] ESLint v9 flat config + Prettier
- [x] Husky pre-commit → lint-staged (`cd frontend && npx lint-staged`)
- [x] `package.json` scripts: `lint`, `lint:fix`, `format`, `test`, `test:watch`, `prepare`
- [x] `.env.example`
- [x] `index.html` — `#root` + `/src/main.tsx`
- [x] Bersihkan boilerplate Vite (`style.css`, `counter.ts`, `main.ts`, `public/icons.svg`)

### Backend
- [x] Laravel 13 scaffold (`backend/`)
- [x] `SecurityHeaders.php` middleware — CSP, X-Frame-Options, HSTS production
- [x] `ForceJsonResponse.php` middleware
- [x] `Handler.php` — custom exception handler, no stack trace ke client (§10.11)
- [x] `bootstrap/app.php` — middleware pipeline, Sanctum statefulApi, exception handler
- [x] `routes/api.php` — semua route `/api/v1`, public + auth + dashboard
- [x] `.env.example` — `APP_DEBUG=true` local (comment wajib false di staging/prod)
- [x] Migrations: `projects`, `project_images`, `skills`, `experiences`, `messages`, `activity_logs`
  - UUID primary key (`HasUuids`) di: projects, skills, experiences, messages (§10.2)
  - auto-increment di: users, activity_logs, project_images
- [x] `.github/workflows/ci.yml` — dua job (frontend + backend), urutan `lint → security-scan → test → build` (§13)
- [x] `.gitignore` root monorepo

### Backend — BELUM SELESAI (pending PostgreSQL)
- [ ] Install PostgreSQL v17 (user perlu install manual dari postgresql.org)
- [ ] Copy `.env.example` → `.env`, isi DB credentials
- [ ] `php artisan key:generate`
- [ ] `php artisan migrate`
- [ ] `php artisan vendor:publish` (Spatie Permission)

---

## Phase 1 — Design Token & Config ✅ SELESAI

- [x] `src/Resources/Global.css`
  - Google Fonts: Fraunces, Hanken Grotesk, IBM Plex Mono
  - Dark mode tokens (`:root`) + light mode override (`[data-theme='light']`) — OKLCH §6.2
  - Type scale CSS vars (`--text-hero` s/d `--text-tag`) — §6.3
  - Z-index scale (`--z-dropdown` s/d `--z-tooltip`)
  - `appearance: none` semua form elements — §6.4
  - `:focus-visible` global (tidak pernah dihapus)
  - `@media (prefers-reduced-motion: reduce)` — §7.5
  - Skeleton shimmer keyframe + `.skeleton-shimmer` class — §7.4
  - Letter-spacing `-0.025em` untuk h1–h3
- [x] `src/Constants/theme.ts` — referensi TS ke CSS vars (FONTS, COLORS, Z, TRANSITION)
- [x] `src/Constants/routes.ts` — path konstan `ROUTES`
- [x] `src/Constants/apiEndpoints.ts` — endpoint konstan, dashboard pakai `(uuid: string)` fn
- [x] `src/Config/env.ts` — safe wrapper `import.meta.env`, throw jika `VITE_API_URL` missing
- [x] `src/Services/Common/axiosInstance.ts` — `withCredentials: true`, 419 CSRF retry (sekali, anti-loop)
- [x] `src/Redux/Store.ts` — `configureStore`, export `RootState` + `AppDispatch`
- [x] `src/Redux/Features/AuthSlice.ts` — user, isAuthenticated, isLoading
- [x] `src/Redux/Features/UiSlice.ts` — theme toggle + localStorage, sidebar, toast queue
- [x] `src/Redux/Features/ProjectSlice.ts` — list, detail, isLoading, error
- [x] `src/Context/ThemeContext.tsx` — sync `data-theme` ke `<html>` via `useEffect`
- [x] `src/Context/SidebarContext.tsx` — bridge Redux UiSlice ke Context API
- [x] `src/Animations/variants.ts` — fadeUp, fadeIn, scaleIn, slideInLeft, marginNoteIn, staggerContainer, fadeUpExit — semua punya `instant` key
- [x] `src/Animations/transitions.ts` — pageEnter, pageExit, pageTransition
- [x] `src/Animations/useScrollReveal.ts` — `useInView` + `useReducedMotion` wrapper
- [x] `src/Routes/Protected.tsx` — UX-only guard, cek `isAuthenticated` + `isLoading`
- [x] `src/Routes/PublicOnly.tsx` — redirect authenticated user dari `/login`
- [x] `src/Routes/Index.tsx` — route tree, `AnimatePresence mode="wait"`, semua page `React.lazy + Suspense`
- [x] `src/App.tsx` — Provider → ThemeProvider → SidebarProvider → BrowserRouter → AppRoutes
- [x] `src/main.tsx` — `createRoot` + `StrictMode`, import `Global.css`
- [x] Page stubs: Home, Projects, ProjectDetail, Contact, Login, Overview, Projects(dash), Skills, Experience, Inbox, Profile, NotFound

---

## Phase 2 — Elements & Animasi ✅ SELESAI (core atoms)

- [x] `src/Components/Elements/SkeletonBox.tsx` — atom dasar skeleton §7.4
- [x] `src/Components/Elements/Spinner.tsx` — busy state (bukan data fetch)
- [x] `src/Components/Elements/Badge.tsx` — mono tag, variant default/accent (mustard)
- [x] `src/Components/Elements/Button.tsx` — primary/secondary/ghost · sm/md/lg · loading state · forwardRef
- [x] `src/Components/Elements/Input.tsx` — label, error `role=alert` + `aria-describedby`, helper, required `*`
- [x] `src/Components/Elements/Textarea.tsx` — mirror Input states, resize vertical only
- [x] `src/Components/Elements/Checkbox.tsx` — native hidden (a11y), SVG pathLength 0→1, touch ≥44px
- [x] `src/Components/Elements/Switch.tsx` — `role=switch`, thumb spring slide
- [x] `src/Components/Elements/Select.tsx` — listbox penuh, keyboard ↑↓/Enter/Esc/Tab, aria-activedescendant, outside-click
- [x] `FileUpload.tsx` — drag-and-drop + preview + progress + pilih sampul + hapus _(SELESAI Phase 5, lihat di bawah)_
- [x] `RangeSlider.tsx` — native `input[type=range]` + track/thumb kustom (styling pseudo-element di Global.css, fill via `--range-fill`); dipakai slider proficiency di dashboard Keahlian

Semua atom: zero browser default, 5 state (default/hover/focus/disabled/error), light/dark via CSS var, reduced-motion honored.

---

## Phase 3 — Public Site (data dummy) ✅ SELESAI (kode) — verifikasi visual pending

> Catatan: desain awal "Catatan Kerja" (moss/mustard, Fraunces, anotasi margin) **dibongkar** → dark SaaS (lihat Phase 3.5). Item di bawah mencerminkan kondisi akhir.

- [x] `Constants/dummyData.ts` — profil, skills, experiences, projects (TEMP; prosa bilingual `LocalizedText`)
- [x] `Utils/validators.ts` — isRequired, isEmail, minLength, maxLength
- [x] Layout: `MainLayout.tsx` — Navbar + Footer persisten, page transition via `useOutlet`, validasi `:lang`
- [x] Fragments: `Navbar`, `Footer`, `ThemeToggle`, `Section`, `SkillGroup`, `ProjectCard` (+ `ProjectCardSkeleton`, `ProjectDetailSkeleton`), `ContactForm`
- [x] **`Home`** — Hero (teks + kartu Spotify) + Marquee + About (+NotesCard) + Skills + Experience + Projects preview + closing CTA
- [x] `Projects` — grid ProjectCard + simulasi loading → skeleton (TEMP Phase 3)
- [x] `ProjectDetail` — by slug, 404 fallback, cover gradient, stack, repo/demo
- [x] `Contact` — ContactForm + info langsung; `NotFound` — 404 bergaya di bawah MainLayout
- [x] Routing: public nested di MainLayout, AnimatePresence di layout
- [x] Build + lint hijau
- [ ] Verifikasi visual menyeluruh (light & dark, mobile & desktop)
- [ ] Lighthouse ≥ 90 Perf, ≥ 95 SEO; **a11y akan turun** (reduced-motion sengaja dimatikan — lihat Phase 3.5)

---

## Phase 3.5 — Redesign Dark SaaS + i18n ✅ SELESAI (kode)

**Redesign (keputusan user 2026-06-22): Catatan Kerja → dark SaaS.**
- [x] `Global.css` — token baru navy + cyan + violet (dark default + light), fonts Bricolage/Hanken/IBM Plex Mono, glow token
- [x] Fraunces, moss/mustard (`--color-accent-alt`), `MarginNote` **dibuang**
- [x] `AuroraBackground` — 2 blob blur cyan/violet drift (signature ambient)
- [x] `Marquee` — strip skill infinite scroll + fade tepi
- [x] `Preloader` — greeting multibahasa (Halo→Hello→Hola→Selamat datang) → brand → wipe; di `App.tsx`
- [x] `SpotifyCard` — now-playing mock (equalizer `scaleY`, online/offline) di hero; **API asli Phase 5**
- [x] `NotesCard` — kartu `catatan-kerja.md` (motif lama) dipindah ke section Tentang
- [x] Navbar transparan→blur saat scroll, eyebrow garis+mono (bukan pill berdot), role **Fullstack**
- [x] Kartu glow + hover lift; tombol primer cyan-fill + glow

**Animasi dipaksa jalan (keputusan user):**
- [x] `<MotionConfig reducedMotion="never">` di `App.tsx` + blok `@media (prefers-reduced-motion)` dihapus
- [x] **Konsekuensi:** Lighthouse a11y kemungkinan flag — diterima user (lihat memory `decision-force-animations`)

**Performa (web sempat berat):**
- [x] **Semua `backdrop-blur` dibuang** (jank di atas aurora beranimasi) → bg solid translucent
- [x] Aurora: 3→2 blob, blur 110–130px → 70–80px, `will-change: transform`
- [x] Equalizer/progress Spotify: `height`/`width` → `scaleY`/`scaleX` (GPU)

**i18n (custom, locale di URL) — §16 DESIGN.md:**
- [x] `Locales/{id,en}.ts` + `index.ts` (Lang, dictionaries, detectLang, tx)
- [x] `Context/LanguageContext.tsx` — `t()`, `tx()`, `switchLang()`, sinkron `<html lang>` + localStorage
- [x] Routing `/:lang` (`/id`, `/en`), root `/` → deteksi bahasa; `localePath()` helper
- [x] `LanguageSwitcher` (globe + dropdown ID/EN) di Navbar
- [x] Semua teks publik + konten dummy bilingual (id + en)
- [x] Build + lint hijau

---

## Phase 4 — Integrasi API 🟡 BACKEND PUBLIC SELESAI — FE wiring belum

**Database (PostgreSQL 18):**
- [x] `.env` → pgsql, DB `shaturne` dibuat, `php artisan migrate` (11 tabel) ✅
- [x] `php artisan db:seed` — role `admin` + user `admin@shaturne.dev` / `password`, 12 skill, 3 proyek, 3 pengalaman

**Backend public API (terverifikasi via curl):**
- [x] Models `Project`/`Skill`/`Experience`/`Message` (HasUuids) + `ProjectImage`; `User` + HasRoles/HasApiTokens
- [x] Resources `Project/Skill/Experience/Message` (`uuid`=id, kontrol field)
- [x] Controllers public `ProjectController` (index paginated + show 404), `SkillController`, `ExperienceController`, `MessageController` (honeypot)
- [x] `ContactService` + `StoreMessageRequest`; base `Controller` helper `ok()`/`fail()` (envelope §9)
- [x] `php artisan serve :8000` → `/projects`, `/skills`, `/experience`, `/projects/{slug}`, `/contact` semua OK

**FE wiring publik (SELESAI):**
- [x] CORS `config/cors.php` (origin `localhost:5174/5173` + credentials) — verified `Access-Control-Allow-Origin` + `Allow-Credentials`; `.env` FRONTEND_URL/SANCTUM/APP_URL
- [x] Services `Services/Public/*` (project/skill/experience/contact) — baca envelope `.data.data`
- [x] Hooks `Hooks/Public/*` (useProjects/useProject/useSkills/useExperience/useContact)
- [x] `Utils/formatters.ts` (projectAccent, periodLabel)
- [x] Home/Projects/ProjectDetail/Contact pakai API real (ganti dummyData) + skeleton saat fetch + error state
- [x] ContactForm POST real, map error 422 ke field; honeypot
- [x] build + lint hijau

**Belum (auth + dashboard):**
- [ ] Backend auth: `AuthController` (Sanctum login/me/logout) — wire mock `useAuth` ke API
- [ ] Backend dashboard: `DashboardProject/Skill/Experience/MessageController` + `ProjectService` (`DB::transaction()` projects+images §10.3) + Form Requests + Policies + `DashboardController` (overview/profile/media)
- [ ] FE dashboard wire ke API real (ganti mock)

---

## Phase 5 — Auth + Dashboard ✅ INTI SELESAI (auth real + dashboard CRUD end-to-end)

**Auth real (Sanctum SPA cookie) — terverifikasi curl:**
- [x] Backend: `AuthController` (login/me/logout, web guard session), `LoginRequest`, `UserResource` (role), login `throttle:5,1`
- [x] CORS + `.env` SANCTUM_STATEFUL_DOMAINS=localhost:5174 → csrf-cookie → login → me bekerja (session cookie)
- [x] FE: `Services/Auth/authService.ts` (csrf/login/logout/me), `AuthSlice` real (no localStorage, isLoading until /me), `useAuth` real, `useAuthCheck`+`AuthBootstrap` (hydrate /me on boot), `Login` page (password + error 422/429)
- [x] build + lint hijau

**Frontend shell (data dummy — dashboard CRUD belum diwire):**
- [x] `AuthSlice` — hydrate localStorage (`mockUser`), `isLoading=false` default
- [x] `Hooks/Auth/useAuth.ts` — `login()`/`logout()` mock (Phase 5-real: csrf → POST /login → /me)
- [x] `AuthLayout` (centered + aurora) + `Login` page (Input/Button, validasi, mock submit → redirect)
- [x] `DashboardLayout` — sidebar nav + ikon + logout, topbar, drawer mobile (off-canvas)
- [x] Dashboard pages shell: `Overview` (stat cards + aktivitas), `Projects` (tabel), `Skills`, `Experience`, `Inbox` (pesan mock), `Profile` (form)
- [x] Routing: Login di AuthLayout (PublicOnly), dashboard di DashboardLayout (Protected); build+lint hijau

**Backend & integrasi (BELUM):**
**Backend dashboard CRUD — terverifikasi curl (auth + role:admin):**
- [x] `role:admin` middleware di grup dashboard (no-auth → 401) — alias spatie di `bootstrap/app.php`
- [x] `DashboardProjectController` (+ `ProjectService` `DB::transaction()` projects+images §10.3, slug auto-unik), `DashboardSkillController`, `DashboardExperienceController`, `DashboardMessageController` (show → mark read)
- [x] `DashboardController` (overview counts, updateProfile); media stub (501)
- [x] Form Requests: Store/Update Project/Skill/Experience; binding `{uuid}` (§10.2)
- [x] Verified: overview, list, **create (201 + slug + transaksi), delete** — semua OK; 401 tanpa auth
- _Catatan: otorisasi via `role:admin` middleware (bukan Policy per-resource) — deviasi sadar, secure server-side_

**FE dashboard wiring (SELESAI):**
- [x] `Services/Dashboard/dashboardService.ts` (overview, projects/skills/experience CRUD, messages, profile)
- [x] `Hooks/Dashboard/useFetch.ts` (generic read+reload) + `Components/Elements/Modal.tsx` (custom dialog)
- [x] Overview (stat real), Projects (tabel + create/edit modal + delete), Skills (tabel + modal), Experience (list + modal + Select), Inbox (list + buka→mark read + delete + balas), Profile (update + applyUser)
- [x] Map error 422 ke field, confirm sebelum delete; build+lint hijau

**Upload gambar proyek (FileUpload) — terverifikasi curl end-to-end:**
- [x] Backend: `DashboardController@uploadMedia` (MIME whitelist jpg/jpeg/png/webp, max 4 MB, nama acak `Str::random(40)`, `storeAs('projects','public')`) + `deleteMedia` (`basename()` anti path-traversal, 404 jika hilang)
- [x] `php artisan storage:link` (symlink jalan di OneDrive/Windows — GET file 200), `ProjectResource.images` tambah `url`
- [x] FE: `FileUpload.tsx` Element (drag-drop, preview, progress %, set sampul, hapus; transport di-inject parent — patuh aturan Element no-Service), `dashboardService.uploadMedia/deleteMedia`, wire ke modal Projects (`images` ⇄ payload paths)
- [x] Cover image real di `ProjectCard` (hover zoom) + galeri di `ProjectDetail` (fallback inisial gradien jika kosong)
- [x] Verified: upload 201, GET 200, delete 200→404, reject non-image 422, traversal `..%2F.env` 404 (.env aman); build+lint+pint+tsc hijau

**Spotify now-playing asli — SELESAI (kode; isi kredensial nanti):**
- [x] Backend `SpotifyService` (refresh token → access token, cache ~50m; `currently-playing`; fail-soft offline saat config kosong/error) + `NowPlayingController` `GET /api/v1/now-playing` (publik, `throttle:60,1`) + `config/services.php` `spotify` + `.env.example` `SPOTIFY_*`
- [x] FE `nowPlayingService` + `useNowPlaying` (poll 30s, fail-soft) + `SpotifyCard` konsumsi data real (cover album, progress dari API, link track); test backend offline-path (200, `is_playing:false`)
- [ ] Isi `SPOTIFY_CLIENT_ID/SECRET/REFRESH_TOKEN` di `.env` (butuh OAuth Spotify user)

**Konten i18n backend — SELESAI (full-stack, terverifikasi curl + tes):**
- [x] `spatie/laravel-translatable`: kolom JSON `{id,en}` (projects.title/description, skills.category, experiences.title/description); slug/name/organization/type tetap tunggal
- [x] Models `HasTranslations` + `$translatable`; migrasi create → `json`; seeder bilingual
- [x] Middleware `SetLocale` (`?lang` → `Accept-Language` → default) di grup api; resource publik resolve string, resource `Dashboard\*` keluarkan peta `{id,en}`
- [x] Form Request validasi `field.id`+`field.en`; `SkillController` tak `orderBy('category')` (kolom json tak orderable di pgsql)
- [x] FE: axios interceptor `?lang` (via `Services/Common/locale.ts` + `LanguageContext`); form dashboard Proyek/Keahlian/Pengalaman punya input ID+EN
- [x] Verified live: dashboard create `{id,en}` → slug dari EN → public resolve EN/ID; phpunit test resolusi `Accept-Language`/`?lang`

---

## Phase 6 — Hardening & Go-live 🟡 BERJALAN (SEO, tes, gerbang keamanan beres)

- [ ] Checklist §10 lengkap (semua 10.1–10.11)
- [ ] `APP_DEBUG=false` di staging + production `.env`
- [x] Security gate CI/CD aktif §13.1 — `npm audit --audit-level=high` (0 vuln) + `composer audit` (0 vuln); keduanya hijau
- [x] **Test runner CI diperbaiki** — `vendor/bin/pest` → `vendor/bin/phpunit` (Pest tak terpasang; phpunit sudah dikonfigurasi, sqlite :memory:)
- [x] **Feature test backend (25 tes, 64 assertion, hijau):** `PublicApiTest` (proyek published-only/404, skills, experience, kontak sukses/422/honeypot), `AuthTest` (login sukses/salah/throttle 429/me), `DashboardProjectTest` (401/403, create+slug unik+transaksi, update, delete, 422), `MediaTest` (upload nama acak/Storage::fake, tolak non-image 422, hapus, traversal)
- [x] **PHPStan level 5 clean (0 error) + blocking di CI** — larastan v3 + `phpstan.neon`; fix tipe nyata: `@mixin` di semua Resource, `images(): HasMany<ProjectImage,$this>`, `start_date` non-null (kolom NOT NULL)
- [x] **Unit/komponen test FE (Vitest + RTL, 16 tes hijau):** `formatters`, `validators`, `Locales` (isLang/detectLang/tx), `RangeSlider` (render/onChange/aria); setup jsdom + `setupTests.ts` + `test` block di `vite.config.ts`
- [x] **E2E Playwright (5 spec chromium hijau):** redirect `/`→`/:lang`, hero EN/ID, heading proyek terlokalisasi, halaman 404; `playwright.config.ts` (webServer build+preview, frontend-only tanpa backend); job `e2e` di CI (install chromium)
- [ ] Lighthouse final audit semua halaman — jalankan manual sebelum deploy (fondasi: lazy `img`, code-split per route, animasi transform/opacity)
- [x] Meta tag dinamis + OG image per halaman — `Hooks/Common/useSeo.ts` (title/description/og/twitter/canonical, hreflang `id`/`en`/`x-default`, `noindex`); wired Home/Projects/ProjectDetail/Contact/NotFound/Login/DashboardLayout; OG image = cover proyek
- [x] Structured data JSON-LD — `Person` + `WebSite` (Home), `CreativeWork` (ProjectDetail)
- [x] `public/robots.txt` (allow publik, disallow `/dashboard` + `/login`)
- [ ] Sitemap dinamis (perlu SSR/endpoint backend — defer)
- [ ] Deploy ke staging → review → production
