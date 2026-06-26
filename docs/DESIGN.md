# DESIGN.md
## Arsitektur Teknis, Struktur Folder, Design System & Security

Dokumen pendamping `PRD.md`. Fokus di sini: bagaimana sistem dibangun, bukan apa yang dibangun.

---

## 1. Architecture Overview

Arsitektur **decoupled** — React (SPA) dan Laravel (REST API) benar-benar terpisah, berkomunikasi lewat HTTP/JSON. Ini bukan Inertia.js (server-driven), tapi API-driven penuh, supaya:

- Frontend bisa di-deploy ke static hosting (Vercel/Netlify) → cepat, murah, CDN-friendly.
- Backend murni jadi *data & auth provider*, gampang dipakai ulang kalau nanti ada mobile app (Flutter) yang konsumsi API yang sama.

```
┌─────────────────────┐        HTTPS / JSON         ┌──────────────────────┐
│   React SPA (Vite)   │ ───────────────────────────▶│  Laravel REST API    │
│   - Public Site      │                              │  - Sanctum Auth      │
│   - Admin Dashboard  │ ◀─────────────────────────── │  - Eloquent + MySQL  │
└─────────────────────┘     Cookie session (Sanctum)  └──────────────────────┘
        │                                                       │
        ▼                                                       ▼
   Vercel / Netlify                                     VPS / Railway / Forge
   (Static hosting)                                      (App + DB server)
```

**Kenapa Sanctum cookie-based, bukan JWT di localStorage?** JWT yang disimpan di `localStorage` rawan dicuri lewat XSS (skrip jahat tinggal `localStorage.getItem`). Cookie `httpOnly` + Sanctum tidak bisa dibaca JavaScript sama sekali, jadi permukaan serangan XSS-to-account-takeover jauh lebih kecil. Ini krusial karena kamu akan punya dashboard dengan akses penuh ke konten.

---

## 2. Tech Stack & Alasan

| Layer | Tools | Alasan |
|---|---|---|
| Bahasa FE | TypeScript | Type safety, autocompletion, refactoring lebih aman |
| Build tool FE | Vite | Dev server cepat, HMR instan, build optimal untuk SPA |
| State global | Redux Toolkit | Konsisten dengan struktur `Redux/Features` yang sudah kamu rencanakan; cocok untuk state lintas-halaman (auth, profile) |
| Animasi | Framer Motion | API deklaratif, dukungan `useScroll`/`useInView` native untuk scroll-animation tanpa library tambahan |
| Styling | Tailwind CSS | Utility-first, gampang konsisten dengan design token, build kecil |
| HTTP client | Axios | Interceptor mudah untuk auth & error handling terpusat |
| Backend framework | Laravel 13 | Familiar dari proyek GunaJaya, ekosistem auth (Sanctum) & validasi matang |
| Auth | Laravel Sanctum (SPA mode) | Cookie-based, CSRF-protected, dibuat khusus untuk kasus SPA + API satu ekosistem domain |
| ORM/DB | Eloquent + MySQL/PostgreSQL | Standard Laravel, migrations sebagai source of truth schema |
| Authorization | spatie/laravel-permission | RBAC siap pakai, gampang nambah role di Fase 3 |

---

## 3. Struktur Folder Frontend (React) — Versi Dikembangkan

Struktur dasar kamu (Atomic Design) sudah solid. Aku tambahkan beberapa folder yang akan sangat kamu perlukan begitu animasi dan auth makin kompleks: `Animations/`, `Config/`, `Redux/Middleware/`, route guard tambahan, dan pemisahan `Common` hooks.

```
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── Assets/
│   │   ├── Images/
│   │   ├── Icons/
│   │   └── Fonts/
│   │
│   ├── Components/                 # Atomic Design
│   │   ├── Elements/                # Atoms: Button, Input, Textarea, Select, Checkbox, Switch, Badge, Spinner, SkeletonBox
│   │   ├── Fragments/               # Molecules/organisms — dibagi per domain:
│   │   │   ├── Cards/               #   ProjectCard, ProjectCardSkeleton, ProjectDetailSkeleton,
│   │   │   │                        #   NotesCard, SpotifyCard
│   │   │   ├── Forms/               #   ContactForm (+ ContactForm.test.tsx)
│   │   │   ├── Navigation/          #   Navbar, Footer, ThemeToggle, LanguageSwitcher
│   │   │   ├── AuroraBackground.tsx
│   │   │   ├── AuthBootstrap.tsx
│   │   │   ├── Marquee.tsx
│   │   │   ├── Preloader.tsx
│   │   │   ├── ScrollProgressBar.tsx
│   │   │   ├── Section.tsx
│   │   │   └── SkillGroup.tsx
│   │   └── Layouts/                 # Templates: MainLayout, DashboardLayout, AuthLayout
│   │
│   ├── Animations/                  # (baru) — pusat semua logika Framer Motion
│   │   ├── variants.ts              # fadeUp, staggerContainer, scaleIn, marginNoteIn, dst.
│   │   ├── transitions.ts           # page-transition presets (AnimatePresence)
│   │   └── useScrollReveal.ts       # custom hook wrapper di atas useInView
│   │
│   ├── Hooks/
│   │   ├── Auth/                    # useLogin, useLogout, useAuthGuard
│   │   ├── Project/                 # useProjects, useProjectDetail
│   │   ├── Dashboard/               # useCrudProject, useInboxMessages
│   │   └── Common/                  # (baru) — useDebounce, useMediaQuery, useLockBodyScroll
│   │
│   ├── Services/                    # Layer komunikasi API (Axios)
│   │   ├── Auth/                    # login, logout, csrf, me
│   │   ├── Common/                  # axiosInstance.ts, interceptors.ts
│   │   ├── Project/                 # CRUD project API calls
│   │   └── Dashboard/                # message, profile, media API calls
│   │
│   ├── Redux/
│   │   ├── Store.ts
│   │   ├── Features/
│   │   │   ├── AuthSlice.ts
│   │   │   ├── UiSlice.ts           # theme, sidebar, toast/notif global
│   │   │   └── ProjectSlice.ts
│   │   └── Middleware/              # (baru) — error-logger middleware, dsb.
│   │
│   ├── Pages/
│   │   ├── Public/                  # Home, About, Projects, ProjectDetail, Contact
│   │   ├── Auth/                    # Login
│   │   ├── Dashboard/                # Overview, Projects, Skills, Inbox, Settings
│   │   └── Common/                   # NotFound, ServerError
│   │
│   ├── Routes/
│   │   ├── Index.tsx                 # Router; public diprefix /:lang (lihat §16), dashboard non-prefix
│   │   ├── Protected.tsx             # Wajib login (dashboard)
│   │   └── PublicOnly.tsx           # (baru) — redirect user yg sudah login dari /login
│   │
│   ├── Context/
│   │   ├── SidebarContext.tsx
│   │   ├── ThemeContext.tsx          # dark/light mode (data-theme + localStorage)
│   │   └── LanguageContext.tsx       # (baru) — i18n: lang, t(), switchLang() — lihat §16
│   │
│   ├── Locales/                      # (baru) — i18n custom (tanpa library)
│   │   ├── id.ts                     # kamus Bahasa Indonesia
│   │   ├── en.ts                     # kamus English (mirror shape id.ts)
│   │   └── index.ts                  # Lang, dictionaries, detectLang, tx() helper
│   │
│   ├── Utils/
│   │   ├── dateHelper.ts
│   │   ├── formatters.ts
│   │   ├── errorHandler.ts           # mapping HTTP status → pesan UI
│   │   └── validators.ts             # (baru) — validasi client-side (defense in depth)
│   │
│   ├── Constants/
│   │   ├── theme.ts                  # design token (warna, spacing, font) — lihat §6
│   │   ├── routes.ts                 # (baru) — path konstan, hindari hardcode string
│   │   └── apiEndpoints.ts           # (baru) — endpoint konstan
│   │
│   ├── Config/                       # (baru)
│   │   └── env.ts                    # wrapper aman di atas import.meta.env
│   │
│   ├── Resources/
│   │   └── Global.css                  # @import "tailwindcss" (v4 CSS-first) + token OKLCH + base reset
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── vite.config.ts
└── package.json
```

### Aturan dependensi antar folder (penting untuk maintainability)

| Folder | Boleh import dari | Tidak boleh import dari |
|---|---|---|
| `Components/Elements` | Constants, Utils | Hooks, Services, Redux |
| `Components/Fragments` | Elements, Hooks, Animations | Pages |
| `Pages` | Fragments, Layouts, Hooks, Routes | — (top level, boleh apa saja di bawahnya) |
| `Services` | Config, Constants | Hooks, Components, Redux |
| `Hooks` | Services, Redux | Components (hooks tidak boleh tahu UI) |

Aturan ini mencegah *circular dependency* dan menjaga Atomic Design-nya tetap murni: atom tidak pernah tahu soal logic bisnis.

---

## 4. Struktur Folder Backend (Laravel REST API)

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/              # Versioning sejak awal
│   │   │           ├── AuthController.php
│   │   │           ├── ProjectController.php
│   │   │           ├── SkillController.php
│   │   │           ├── MessageController.php
│   │   │           └── DashboardController.php
│   │   ├── Requests/                 # Form Request — validasi terpusat per endpoint
│   │   │   ├── StoreProjectRequest.php
│   │   │   └── UpdateProjectRequest.php
│   │   ├── Resources/                # API Resource — kontrol ketat data yang diekspos
│   │   │   ├── ProjectResource.php
│   │   │   └── UserResource.php
│   │   └── Middleware/
│   │       ├── SecurityHeaders.php   # CSP, X-Frame-Options, dst.
│   │       └── ForceJsonResponse.php
│   ├── Models/
│   ├── Policies/                     # Authorization rules (siapa boleh apa)
│   ├── Services/                     # Business logic, dipanggil dari Controller
│   └── Observers/                    # Audit log otomatis (created/updated/deleted)
│
├── routes/
│   └── api.php                       # Semua route diawali /api/v1
│
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
│
├── config/
│   ├── cors.php                      # Allowed origin ketat
│   └── sanctum.php                   # Stateful domains
│
└── tests/
    ├── Feature/                      # Test per endpoint (happy + unhappy path)
    └── Unit/                         # Test Service/Policy
```

**Pola wajib:** Controller tetap *tipis* — hanya menerima request, panggil Service, kembalikan Resource. Validasi selalu lewat Form Request (tidak pernah `$request->all()` mentah-mentah ke Model).

---

## 5. Konvensi Penamaan & Coding Standard

| Item | Konvensi |
|---|---|
| Komponen React | PascalCase — `ProjectCard.tsx` |
| Custom hooks | camelCase, prefix `use` — `useProjects.ts` |
| Redux slice | PascalCase + suffix `Slice` — `AuthSlice.ts` |
| File service | camelCase — `projectService.ts` |
| Route path | kebab-case — `/project-detail/:slug` |
| Linting FE | ESLint + Prettier, wajib lolos sebelum commit (husky pre-commit) |
| Linting BE | Laravel Pint (PSR-12) |
| Commit message | Conventional Commits (`feat:`, `fix:`, `chore:`) — memudahkan changelog otomatis |

---

## 6. Design System — Arah Visual

> **Revisi besar (2026-06-22).** Konsep awal "Catatan Kerja" (editorial — moss/mustard, Fraunces serif, anotasi margin) ditinggalkan atas keputusan user. Arah baru: **dark modern SaaS** (referensi: bugster.dev, kloudmate) — background navy gelap, aksen cyan menyala + violet untuk gradient/glow, animasi yang banyak dan terasa hidup. Arsitektur (Atomic Design, routing, Redux) tidak berubah; yang berganti hanya **skin + motion**.

### Konsep: Dark SaaS (navy + cyan glow)

Kesan: produk developer-tool yang sleek, gelap, dan penuh gerak — bukan portfolio editorial. Motif "catatan kerja" tetap hidup sebagai elemen konkret (kartu `catatan-kerja.md` di section Tentang, kartu Spotify "now playing" di hero), bukan sebagai tema visual menyeluruh. Identitas dibawa oleh: aurora glow ambient, kartu mengambang ber-glow, dan tipografi grotesque berkarakter.

---

### 6.1 Mode & Tema

Light dan dark mode keduanya first-class citizens. Theme dikontrol via atribut `data-theme="dark"|"light"` di elemen `<html>`. Semua nilai warna adalah CSS custom properties dalam format OKLCH supaya interpolasi dan audit kontras akurat.

**Default mode:** dark. Kunjungan pertama membaca `prefers-color-scheme`; pilihan user disimpan ke `localStorage`. Toggle dikontrol via `UiSlice` Redux dan `ThemeContext`.

---

### 6.2 Color Tokens

Identitas: navy gelap + **cyan** (aksen utama: interaktif, link, focus, glow) + **violet** (`--color-accent-2`, pasangan gradient/glow & badge sekunder). Semua token OKLCH, didefinisikan langsung di `Resources/Global.css` (`:root` dark default + override `[data-theme='light']`); `Constants/theme.ts` hanya merujuk nama variabelnya. OKLCH = source of truth (hex hanya aproksimasi, sengaja diabaikan).

**Dark mode (default):**

| Token | OKLCH | Peran |
|---|---|---|
| `--color-bg` | `oklch(15% 0.024 265)` | Background utama — navy gelap |
| `--color-surface` | `oklch(19% 0.028 265)` | Card / section background |
| `--color-surface-raised` | `oklch(24% 0.032 265)` | Elevated — dropdown, modal, tooltip |
| `--color-text` | `oklch(97% 0.005 250)` | Teks utama — near-white sejuk |
| `--color-text-muted` | `oklch(71% 0.022 258)` | Caption, meta, placeholder |
| `--color-border` | `oklch(30% 0.028 265)` | Border default |
| `--color-accent` | `oklch(82% 0.135 195)` | **Cyan** — aksen utama, link, focus ring, glow |
| `--color-accent-strong` | `oklch(74% 0.15 198)` | Cyan lebih pekat (aurora, hover) |
| `--color-accent-2` | `oklch(62% 0.19 285)` | **Violet** — gradient pair, badge sekunder |
| `--color-error` | `oklch(68% 0.19 25)` | Error state |

**Light mode:**

| Token | OKLCH | Peran |
|---|---|---|
| `--color-bg` | `oklch(98% 0.005 255)` | Background utama — near-white sejuk |
| `--color-surface` | `oklch(96% 0.007 255)` | Card / section background |
| `--color-surface-raised` | `oklch(100% 0 0)` | Elevated — putih murni |
| `--color-text` | `oklch(22% 0.03 265)` | Teks utama — near-black navy |
| `--color-text-muted` | `oklch(48% 0.03 260)` | Caption, meta, placeholder |
| `--color-border` | `oklch(89% 0.012 260)` | Border default |
| `--color-accent` | `oklch(55% 0.13 205)` | Cyan digelapkan untuk kontras di light bg |
| `--color-accent-strong` | `oklch(50% 0.14 208)` | Cyan pekat versi light |
| `--color-accent-2` | `oklch(52% 0.19 285)` | Violet versi light |
| `--color-error` | `oklch(52% 0.2 25)` | Error state |

Token glow: `--glow-accent` = box-shadow cyan lembut (`color-mix`), dipakai di hover kartu, tombol primer, dan kartu mengambang.

> **Catatan kontras:** aksen cyan terang (L~82%) → teks gelap (`--color-bg`) di atasnya lolos AA dengan mudah. Tombol primer = fill cyan + teks bg gelap (beda dari versi moss lama yang sempat di bawah AA).

---

### 6.3 Tipografi

Semua font via Google Fonts, fallback eksplisit: `'Bricolage Grotesque', system-ui, sans-serif` / `'Hanken Grotesk', system-ui, sans-serif` / `'IBM Plex Mono', 'Courier New', monospace`. **Fraunces (serif) dibuang** — tidak cocok untuk arah SaaS.

| Role | Font | Digunakan untuk |
|---|---|---|
| **Display** | Bricolage Grotesque (variable, `opsz` 12–96) | H1–H4, hero, wordmark, judul section |
| **Body** | Hanken Grotesk (variable, `wght` 300–800) | Body text, paragraf, label, semua UI text |
| **Mono** | IBM Plex Mono (`wght` 400–600) | Stack tag, tanggal, eyebrow, kode, label status |

**Bricolage Grotesque** — grotesque variable berkarakter (sedikit kondensasi, terminal khas) yang membaca jelas sebagai "display" di samping Hanken yang netral. Techy tapi tidak di daftar font over-exposed AI (Inter/Geist/Space Grotesk dihindari). Pasangan display+body via kontras proporsi/personality, bukan dua grotesk identik.

**Hanken Grotesk** — body grotesque bersih, range 300–800 cukup untuk semua peran UI.

**IBM Plex Mono** — konten teknis & eyebrow (cyan, uppercase, tracking lebar).

**Type scale (di `Global.css`):**

| Token | Size | Digunakan untuk |
|---|---|---|
| `--text-hero` | `clamp(2.75rem, 6.5vw, 5.75rem)` | Hero headline |
| `--text-h1` | `clamp(2rem, 4vw, 3.5rem)` | Page heading |
| `--text-h2` | `clamp(1.6rem, 2.8vw, 2.5rem)` | Section heading |
| `--text-h3` | `1.25rem` | Card title |
| `--text-body` | `1rem` | Body copy |
| `--text-small` | `0.875rem` | Caption, meta |
| `--text-tag` | `0.75rem` | Badge, mono eyebrow |

Display weight 700. Letter-spacing: `−0.03em` hero, `−0.02em` h1–h4, `0.04em` tag mono, `0.12–0.14em` eyebrow mono. `text-wrap: balance` pada heading. `h1–h4` pakai `--font-display`; `h5/h6/p/label/form` pakai `--font-body` (di `@layer base`).

---

### 6.4 Komponen Form Kustom (Zero Browser Default)

Semua elemen form dan kontrol interaktif dibangun dari scratch — `appearance: none` di semua elemen, tidak ada style default browser. Setiap komponen punya varian dark dan light mode via CSS custom properties, state hover/focus/disabled/error yang eksplisit, dan keyboard accessibility penuh.

**Komponen yang wajib dibangun kustom (bukan native):**

| Komponen | Catatan Implementasi |
|---|---|
| `Input` / `Textarea` | Background `--color-surface`, border `--color-border`, focus ring `2px solid var(--color-accent)` dengan `outline-offset: 3px`, bukan `outline` native |
| `Select` | Native `<select>` disembunyikan, diganti custom trigger + dropdown `motion.div`. Keyboard: up/down navigasi opsi, Enter pilih, Escape tutup, Tab pindah fokus |
| `Checkbox` | Custom SVG checkmark, animasi check/uncheck via Framer Motion `pathLength` 0→1. Ukuran touch target minimal 44×44px via padding transparan |
| `RadioGroup` | Custom dot fill via Framer Motion `scale` 0→1. Selalu dalam group, navigasi arrow key antar opsi |
| `Switch` / Toggle | Thumb slide via Framer Motion `layout` animation pada `x` axis |
| `FileUpload` | Drag-and-drop zone kustom + click to browse, preview thumbnail untuk gambar, progress upload |
| `RangeSlider` | Custom track + thumb SVG, tooltip nilai saat drag, `aria-valuemin/max/now` |

**Aturan state yang wajib ada di semua komponen:**

| State | Visual |
|---|---|
| Default | Border `--color-border`, background `--color-surface` |
| Hover | Border `--color-accent` opacity 60%, background sedikit lebih terang |
| Focus | Border `--color-accent`, focus ring 2px offset — **jangan dihapus** |
| Disabled | Opacity 0.4, `cursor: not-allowed`, attribute `disabled` tetap ada (jangan hanya visual) |
| Error | Border `--color-error`, pesan error di bawah field via `aria-describedby` |
| Loading | Skeleton shimmer (bukan spinner) untuk komponen yang fetch async |

---

### 6.5 Layout Concept (Hero Sketch)

```
┌────────────────────────────────────────────────────────┐
│  Shaturne          Beranda Proyek Kontak  🌐ID  ☾       │  navbar (transparan→blur saat scroll)
│                                                         │
│  ── FULLSTACK DEVELOPER · INDONESIA                     │  eyebrow (garis + mono)
│                                       ┌───────────────┐ │
│  Antarmuka yang rapi,                 │ ● ● ●  spotify│ │  kartu mengambang glow
│  terdokumentasi dengan baik.          │ ▮▮▮ now playing│ │  (Spotify now-playing, mock)
│  (Bricolage, "terdokumentasi" cyan)   │ Weightless ... │ │
│  Kalimat framing (muted)              └───────────────┘ │
│  [ Lihat Proyek → ]  [ Hubungi Saya ]                   │
│  2+ Tahun   3 Proyek   3 Disiplin                       │
└────────────────────────────────────────────────────────┘
   ▒ aurora cyan/violet drift di belakang seluruh halaman
```

Hero dua kolom: teks (eyebrow garis+mono → headline → framing → CTA → stat row) + kartu mengambang ber-glow. Tidak ada badge "● available" berkedip (pola AI). Eyebrow = garis pendek + label mono, bukan pill berdot.

---

### 6.6 Signature Element: Aurora Glow + Kartu Mengambang

Pengganti "anotasi margin" lama. Dua hal yang bikin halaman ini diingat:

1. **Aurora ambient** (`AuroraBackground`) — 2 blob besar cyan + violet yang blur dan drift pelan di belakang seluruh konten (`position: fixed`, `z-aurora`). Memberi rasa "hidup" tanpa elemen di depan. Blur ditahan ~70–80px + `will-change: transform` demi performa.
2. **Kartu mengambang ber-glow** — kartu (proyek, Spotify, catatan) pakai `--glow-accent` + float halus (`y` loop) dan **ngangkat + glow border saat hover**.

Elemen gerak pendukung: **marquee** skill jalan (infinite scroll, fade tepi), **preloader** (greeting multibahasa → brand → wipe), dan scroll-reveal per section. Motif "catatan kerja" bertahan sebagai kartu `catatan-kerja.md` (section Tentang) + kartu Spotify (hero).

> **Penting (performa):** `backdrop-blur` **tidak** dipakai di atas aurora yang beranimasi (tiap frame harus re-sample area blur → jank). Permukaan pakai bg solid translucent (`/80`–`/95`), bukan backdrop-filter.

---

## 7. Sistem Animasi (Framer Motion) — Detail Implementasi

### 7.1 Struktur

- `Animations/variants.ts` — variant reusable: `fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `staggerContainer`. (`marginNoteIn` lama tidak dipakai lagi.)
- `Animations/transitions.ts` — preset transisi halaman.
- `Animations/useScrollReveal.ts` — wrapper di atas `useInView`.

**Komponen gerak ambient/khas (Fragments):**

| Komponen | Gerak |
|---|---|
| `AuroraBackground` | 2 blob blur cyan/violet drift (CSS `aurora-drift`) |
| `Marquee` | strip skill infinite scroll (`x: 0 → -50%`, item digandakan) + fade tepi |
| `Preloader` | greeting multibahasa (blur+slide) → brand → wipe ke atas; tampil sekali per load |
| `NotesCard` / `SpotifyCard` | float `y` loop + glow; equalizer Spotify pakai `scaleY` (GPU) |
| Kartu (ProjectCard, SkillGroup) | hover: `translateY` + glow border |

### 7.2 Pola scroll-reveal per section

```tsx
<motion.section
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  <motion.h2 variants={fadeUp} />
  <motion.div variants={fadeUp} /> {/* delay otomatis dari stagger parent */}
</motion.section>
```

### 7.3 Page transition

`Components/Layouts/MainLayout.tsx` membungkus konten page dengan `<AnimatePresence mode="wait">`. Memakai `useOutlet()` (bukan `<Outlet/>` langsung) supaya copy yang sedang exit tetap menampilkan konten lamanya selama transisi — Navbar + Footer persisten, hanya page yang fade+slide. (Sebelumnya AnimatePresence di `Routes/Index.tsx`; dipindah ke layout.)

### 7.4 Skeleton Loading — Wajib, Bukan Spinner

Setiap komponen yang fetch data API punya pasangan skeleton-nya:

| Komponen | Skeleton |
|---|---|
| `ProjectCard` | `ProjectCardSkeleton` — bentuk & ukuran identik, shimmer animasi |
| `ProjectDetail` | `ProjectDetailSkeleton` |
| Dashboard table | `TableRowSkeleton` (jumlah baris = `limit` pagination) |

Atom dasar: `Components/Elements/SkeletonBox.jsx` — `<div>` dengan gradient shimmer (`background-position` animasi via CSS atau `motion.div` dengan `animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}` loop infinite). Semua skeleton di atas tinggal compose dari `SkeletonBox` dengan ukuran berbeda.

### 7.5 Reduced Motion — DINONAKTIFKAN (keputusan user)

> **Override sengaja (2026-06-22).** Semua animasi **dipaksa jalan**, `prefers-reduced-motion` **diabaikan**. Implementasi: `<MotionConfig reducedMotion="never">` di `App.tsx` (membuat semua `useReducedMotion()` return `false`) + blok `@media (prefers-reduced-motion: reduce)` dihapus dari `Global.css`.

Ini menyimpang dari best-practice a11y, tapi keputusan eksplisit user untuk portfolio ini (visitor sebelumnya merasa "tidak ada animasi" karena OS-nya reduced-motion ON). **Jangan dikembalikan** tanpa menanyakan user. Panggilan `useReducedMotion()` per-komponen boleh tetap ada (harmless, selalu `false`).

### 7.6 Performance Guard

- Hanya animasikan `transform` & `opacity` (GPU-accelerated), hindari animasikan `width`/`height`/`top`.
- `will-change: transform` pada elemen yang sering animasi.
- Section berat (misal grid proyek dengan banyak gambar) dibungkus `React.lazy` + `Suspense`, fallback = skeleton-nya sendiri.
- Test di Chrome DevTools throttled CPU 4x sebelum dianggap "selesai".

---

## 8. State Management

| Slice | Isi | Kapan dipakai |
|---|---|---|
| `AuthSlice` | user, isAuthenticated, role | Lintas halaman, dipakai `Protected.jsx` |
| `UiSlice` | theme, sidebarOpen, toast queue | UI global non-domain |
| `ProjectSlice` | list proyek, status fetch (cache ringan) | Public + Dashboard |

**Pola arus data:** `Component` → panggil `Hooks/xxx` → hook dispatch `thunk` yang panggil `Services/xxx` (Axios) → hasil disimpan ke Redux slice → komponen baca via `useSelector` (lewat hook yang sama, bukan langsung).

**Context API vs Redux:** Context untuk state UI lokal yang tidak butuh dipersist lintas-refresh berat (sidebar terbuka/tertutup, theme). Redux untuk state domain yang dipakai banyak komponen tak berelasi langsung (auth, data proyek).

---

## 9. API Layer & Konvensi

**Axios instance** (`Services/Common/axiosInstance.ts`):
- `baseURL` dari `Config/env.ts`
- `withCredentials: true` (wajib untuk Sanctum cookie auth)
- Interceptor request: tidak perlu attach token manual (cookie otomatis terkirim)
- Interceptor response: `401` → dispatch logout + redirect login; `419` (CSRF mismatch) → refresh CSRF cookie lalu retry sekali; `422` → lempar error validasi ke caller untuk ditampilkan di form

**Endpoint convention (contoh resource Project):**

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/projects` | List publik (paginated) |
| GET | `/api/v1/projects/{slug}` | Detail publik |
| POST | `/api/v1/dashboard/projects` | Create (auth) |
| PUT | `/api/v1/dashboard/projects/{uuid}` | Update (auth) — `{uuid}` bukan integer |
| DELETE | `/api/v1/dashboard/projects/{uuid}` | Delete (auth) — `{uuid}` bukan integer |

**Response envelope standar:**
```json
{
  "success": true,
  "data": { },
  "message": "OK"
}
```
Error:
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": { "title": ["Judul wajib diisi"] }
}
```

---

## 10. Keamanan (Security Architecture)

Karena dashboard akan menyimpan akses penuh ke konten, keamanan didesain *defense-in-depth* — berlapis, bukan satu titik kontrol saja.

### 10.1 Autentikasi & Sesi
- Laravel Sanctum **SPA mode**: login via `/login` → set cookie `httpOnly` + `secure` + `SameSite=Lax/Strict`.
- CSRF token diambil dari `/sanctum/csrf-cookie` sebelum login (standard flow Sanctum).
- Session timeout otomatis untuk idle (`config/session.php`), dipaksa re-login.
- Rate limiting di endpoint login (`throttle:5,1` — 5 percobaan/menit) untuk cegah brute force.

### 10.2 Otorisasi & IDOR Prevention
- `spatie/laravel-permission` — role `admin` di Fase 1–2.
- Setiap aksi sensitif dibungkus `Policy` class (`ProjectPolicy::update`, dst.), dicek di Controller via `$this->authorize()`.
- Frontend: `Routes/Protected.tsx` cek `isAuthenticated` dari `AuthSlice` sebelum render dashboard — **tapi ini hanya UX, bukan security boundary**; validasi sebenarnya selalu di backend.
- **UUID sebagai primary key (IDOR Prevention)**: Semua Model yang diakses via endpoint dashboard (`Project`, `Skill`, `Experience`, `Message`) wajib menggunakan trait `HasUuids` Laravel — bukan auto-increment integer. Auto-increment mudah dienumerasi (attacker coba ID 1, 2, 3...); UUID v4 tidak prediktabel. Endpoint dashboard pakai `{uuid}` sebagai parameter route. Endpoint publik tetap pakai `{slug}` — tidak berubah.

### 10.3 Validasi Input & Integritas Data
- Setiap endpoint write punya **Form Request** khusus (`StoreProjectRequest`, dll) — tidak ada `$request->all()` langsung ke Model.
- Mass assignment protection: setiap Model wajib deklarasi `$fillable` eksplisit (bukan `$guarded = []`).
- Client-side validation (`Utils/validators.ts`) sebagai *layer pertama* untuk UX, **bukan pengganti** validasi server.
- **Fail-Closed Pattern**: Setiap operasi Service yang menulis ke lebih dari satu tabel wajib dibungkus `DB::transaction()`. Jika exception terjadi di tengah proses, rollback otomatis memastikan tidak ada data parsial yang tersimpan — all-or-nothing, tidak pernah "setengah jadi". Contoh wajib: `ProjectService::create()` yang menyimpan `projects` + `project_images` sekaligus.

### 10.4 Output & XSS
- Tidak ada `dangerouslySetInnerHTML` tanpa sanitasi. Jika ada rich text (misal deskripsi proyek dengan format), wajib lewat `DOMPurify` sebelum render.
- API Resource (`ProjectResource`) membatasi field yang diekspos — model tidak pernah `toJson()` mentah.

### 10.5 Rate Limiting & Anti-abuse

Semua route punya throttle — tidak ada endpoint tanpa limit:

| Endpoint | Limit | Alasan |
|---|---|---|
| `GET /projects`, `/skills`, `/experience` | `120/min` | Public read, bisa dikonsumsi widget/feed |
| `POST /contact` | `3/10min` | Anti-spam ketat + honeypot |
| `GET /now-playing` | `60/min` | Dipoll tiap ~30s frontend |
| `GET /github/contributions` | `30/min` | Cached 6h, ringan |
| `POST /auth/login` | `5/min` | Brute force guard |

**Kenapa Referer/User-Agent check tidak dipakai:** trivially spoofable, menyebabkan false negative di browser dengan privacy settings (Referer di-strip), dan tidak melindungi dari spam jika header ditambahkan manual. Throttle IP adalah satu-satunya control yang tidak bisa di-bypass tanpa cost nyata.

### 10.6 Header & Transport Security
- Middleware `SecurityHeaders`: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- HTTPS dipaksa di semua environment (HSTS header di production).
- CORS (`config/cors.php`) hanya mengizinkan origin frontend resmi — tidak `*`.

### 10.7 Upload File (Media Manager)
- Validasi MIME whitelist (`jpg,png,webp`) + ukuran maksimum.
- Nama file di-randomize saat disimpan (cegah path traversal & overwrite).
- Disimpan di storage non-executable (`storage/app/public`, bukan `public/uploads` langsung dieksekusi PHP).

### 10.8 Audit & Monitoring
- `Observer` di Model penting (Project, Skill) → catat ke `activity_logs` (siapa, aksi apa, kapan).
- Laravel Telescope **hanya di environment local/staging**, dimatikan total di production.

### 10.9 Secrets & Dependency Hygiene
- `.env` tidak pernah commit (`.gitignore` wajib dicek).
- `composer audit` & `npm audit` dijalankan di CI sebelum deploy (lihat §13 untuk urutan pipeline).

### 10.11 Custom Exception Handler
- `APP_DEBUG=false` wajib di environment `staging` dan `production`. `.env.example` harus mencerminkan ini secara eksplisit (`APP_DEBUG=false`).
- Handler kustom (`app/Exceptions/Handler.php` atau via `bootstrap/app.php` tergantung versi Laravel) wajib memastikan dua hal:
  - **Client** hanya menerima response JSON generik sesuai envelope §9: `{"success": false, "message": "Terjadi kesalahan, silakan coba lagi"}` — tidak pernah stack trace mentah, nama file, atau pesan exception internal.
  - **Log** menyimpan detail teknis lengkap (exception class, message, file, line) ke channel Laravel — tanpa data sensitif (password dan token tidak pernah masuk log).
- Berlaku untuk semua exception yang tidak di-handle secara spesifik di controller/service. HTTP exception (404, 405) tetap dikembalikan dengan kode status yang tepat, hanya pesan internalnya yang disembunyikan.

### 10.10 Checklist OWASP Top 10 (2021) — Mapping

| Risiko OWASP | Mitigasi di proyek ini |
|---|---|
| A01 Broken Access Control | Policy class per resource + Protected route (FE hanya UX layer) + UUID primary key (IDOR prevention) |
| A02 Cryptographic Failures | HTTPS wajib, cookie `secure`+`httpOnly`, password hash bcrypt (default Laravel) |
| A03 Injection | Eloquent ORM (parameterized query), Form Request validation |
| A04 Insecure Design | Threat modeling ringan di awal (siapa attacker, apa yang dilindungi) |
| A05 Security Misconfiguration | `SecurityHeaders` middleware, `.env` terpisah per environment, `APP_DEBUG=false` di staging/production, custom exception handler (§10.11) |
| A06 Vulnerable Components | `composer audit`/`npm audit` rutin di CI |
| A07 Auth Failures | Sanctum + rate limiting login + session timeout |
| A08 Software/Data Integrity | CI pipeline terverifikasi sebelum deploy, dependency lock file di-commit |
| A09 Logging Failures | Activity log via Observer, Laravel log channel terkonfigurasi |
| A10 SSRF | Tidak ada fetch URL dari input user tanpa whitelist (relevan jika nanti ada fitur import link) |

---

## 11. Skema Database (Ringkas)

| Tabel | Field kunci | Primary Key |
|---|---|---|
| `users` | name, email, password, role | auto-increment `id` |
| `projects` | **uuid**, title, slug, description, stack(json), repo_url, demo_url, is_published | UUID (`HasUuids`) |
| `project_images` | project_id(uuid), path, order | auto-increment `id` |
| `skills` | **uuid**, name, category, proficiency, icon | UUID (`HasUuids`) |
| `experiences` | **uuid**, title, organization, start_date, end_date, description | UUID (`HasUuids`) |
| `messages` | **uuid**, name, email, message, is_read | UUID (`HasUuids`) |
| `activity_logs` | user_id, action, subject_type, subject_id, created_at | auto-increment `id` |

Relasi utama: `projects` 1—N `project_images`; `users` 1—N `activity_logs`.

> `users` tetap pakai auto-increment karena tidak pernah diekspos via endpoint publik maupun dashboard resource (hanya satu admin). Model yang diakses via endpoint dashboard wajib `HasUuids` — lihat §10.2.

---

## 12. Testing Strategy

| Layer | Tool | Fokus |
|---|---|---|
| Backend Feature | Pest/PHPUnit | Tiap endpoint — happy path + unauthorized + validation error |
| Backend Unit | Pest/PHPUnit | Service & Policy class |
| Frontend Component | Vitest + React Testing Library | Form validation, auth guard, skeleton render state |
| E2E | Playwright | Login flow, kirim pesan kontak, navigasi utama |

---

## 13. CI/CD & Deployment

- **Struktur repo**: monorepo (`frontend/` + `backend/`) — gampang versioning bareng, tetap bisa deploy terpisah.
- **Pipeline (GitHub Actions)**: urutan wajib `lint → security-scan → test → build`, jalan di setiap push/PR. Deploy otomatis ke staging saat merge ke `develop`, manual approve untuk production.
- **Environment**: `local`, `staging`, `production` — env var terpisah total, tidak ada credential staging yang sama dengan production.

### 13.1 Security Gate (wajib sebelum step build)

Step `security-scan` dijalankan **setelah lint, sebelum test dan build**. Pipeline **wajib gagal** (break the build) jika ditemukan kerentanan severity HIGH atau CRITICAL:

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - name: PHP dependency audit
      run: composer audit
      # Gagal jika ada CVE HIGH/CRITICAL di dependency PHP

    - name: JS dependency audit
      run: npm audit --audit-level=high
      # Gagal jika ada CVE HIGH/CRITICAL di dependency JS

    - name: Static analysis (opsional)
      run: vendor/bin/phpstan analyse --level=5
      # Larastan/PHPStan level menengah — tambahkan jika pipeline time memungkinkan
```

Tujuan: dependency vulnerability tidak pernah lolos ke production diam-diam. Warning yang tidak di-enforce sama saja dengan tidak ada.
- **Domain contoh**: `namamu.dev` (frontend) + `api.namamu.dev` (backend) — keduanya didaftarkan sebagai *stateful domain* di `config/sanctum.php` agar cookie cross-subdomain bekerja.

---

## 14. Performance & SEO

- Code-splitting per route (`React.lazy` + `Suspense`) — terutama Dashboard tidak perlu ikut bundle awal Public Site.
- Gambar: format WebP, `loading="lazy"`, ukuran responsif.
- Cache header untuk endpoint publik read-only (`Cache-Control` di response Laravel).
- Meta tag dinamis per halaman (title, description, OG image) — pertimbangkan prerender untuk halaman publik utama agar tetap SEO-friendly walau SPA.
- Structured data `Person` schema (JSON-LD) di halaman utama.

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |

---

## 15. Urutan Eksekusi

| Fase | Isi | Ref |
|---|---|---|
| **0 — Scaffold** | Init `frontend/` (Vite + React + TS) dan `backend/` (Laravel 13 + Sanctum + spatie/permission). Setup folder structure §3 & §4. Konfigurasi ESLint + Prettier + Husky. Setup GitHub Actions pipeline §13. | §3 §4 §13 |
| **1 — Design Token & Config** | `Constants/theme.ts` (CSS custom properties OKLCH), Tailwind config, `ThemeContext.tsx` (toggle light/dark + localStorage), `axiosInstance.ts` (interceptors), Redux Store + 3 slice dasar. **Wajib selesai sebelum nulis komponen apapun.** | §6 §8 §9 |
| **2 — Elements & Animasi** | `Components/Elements`: Button, Input, Select, Checkbox, Switch, Badge, SkeletonBox (semua custom, zero browser default §6.4). `Animations/variants.ts`, `transitions.ts`, `useScrollReveal.ts`. | §6.4 §7 |
| **3 — Public Site (data dummy)** | Hero, About, Skills, Projects grid, Project detail, Contact form. Data hardcoded dulu — jangan sambungkan API. Semua animasi sudah aktif. Lighthouse pass ≥90. | §7 §14 |
| **4 — Integrasi API** | Sambungkan FE ke Laravel API. Skeleton loading aktif di semua komponen fetch. Error handling via interceptor. | §9 §7.4 |
| **5 — Auth + Dashboard** | Login, Protected route, CRUD Projects/Skills/Experience, Inbox. UUID di semua endpoint dashboard. `DB::transaction()` di semua multi-table write. | §10.2 §10.3 |
| **6 — Hardening & Go-live** | Jalankan checklist §10 lengkap. Security gate CI/CD §13.1. Lighthouse final audit. Deploy staging → production. | §10 §13 |

---

## 16. Internationalization (i18n)

Situs publik multibahasa (sekarang **ID + EN**, siap nambah). Implementasi **custom** (tanpa library) atas keputusan user — cukup untuk skala 2–beberapa bahasa.

**Strategi URL: locale di path.** Semua route publik diprefix `/:lang` (mis. `/id/projects`, `/en/contact`) → SEO & share link spesifik bahasa. Route `/` me-redirect ke bahasa terdeteksi. Dashboard/login **tidak** diprefix (admin, satu bahasa).

**Komponen:**
- `Locales/id.ts`, `Locales/en.ts` — kamus nested. `en` diketik `typeof id` (shape wajib sama). **Jangan `as const`** di `id.ts` (bikin tipe literal → `en` gagal compile).
- `Locales/index.ts` — `Lang`, `LANGS`, `DEFAULT_LANG`, `dictionaries`, `isLang()`, `detectLang()` (localStorage → `navigator.language` → fallback `id`), tipe `LocalizedText` + `tx()`.
- `Context/LanguageContext.tsx` — `LanguageProvider({ lang })` menyediakan `{ lang, t, switchLang }`. `t('a.b.c', { var })` resolve dot-path + interpolasi `{var}`, fallback ke `id` lalu ke key. `switchLang()` menukar segmen `:lang` di URL. Sinkron `<html lang>` + simpan ke localStorage.
- `Constants/routes.ts` → helper `localePath(lang, route)` untuk semua `Link`/`NavLink` internal.
- `Components/Fragments/Navigation/LanguageSwitcher.tsx` — dropdown custom (globe + ID/EN) di Navbar.

**Alur:** `Routes/Index.tsx` → `/:lang` membungkus `MainLayout`. `MainLayout` baca `:lang` via `useParams`, validasi `isLang` (kalau invalid → `Navigate` ke default), lalu bungkus `LanguageProvider`. Semua page/Fragment pakai `useLanguage()`.

**Konten:** field prosa data dummy (`PROFILE.framing`, summary/description/role proyek, prosa experience, kategori skill) bertipe `LocalizedText = { id; en }`, di-resolve `tx(field, lang)`. Teks UI lewat `t()`.

**Backend (SELESAI):** konten DB dilokalisasi dengan `spatie/laravel-translatable` — kolom JSON `{id, en}` untuk field prosa (`projects.title/description`, `skills.category`, `experiences.title/description`); `slug`/`name`/`organization`/`type` tetap tunggal (language-neutral). Middleware `SetLocale` resolve locale: `?lang=` → `Accept-Language` → default. Resource publik (`App\Http\Resources\*`) keluarkan string ter-resolve per-locale; resource dashboard (`App\Http\Resources\Dashboard\*`) keluarkan peta `{id, en}` penuh untuk diedit admin. Form Request validasi `field.id` + `field.en`. Frontend: axios interceptor menambahkan `?lang=<UI lang>` (Accept-Language tak bisa di-override di browser) via `Services/Common/locale.ts` yang disetel `LanguageContext`; form dashboard punya input ID + EN per field translatable. Catatan: kolom JSON tidak bisa di-`orderBy` di Postgres — skill diurut `sort_order`, dikelompokkan per kategori di klien.

**SEO (Phase 6):** tambah `hreflang` alternate per bahasa + `<html lang>` (sudah sinkron) saat go-live.

---

## 17. Z-Index Scale

Skala z-index terdefinisi — tidak pernah nilai arbitrary seperti `999` atau `9999`:

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--z-base` | 0 | Konten default |
| `--z-dropdown` | 10 | Dropdown, popover, combobox |
| `--z-sticky` | 20 | Sticky header, sticky sidebar |
| `--z-overlay` | 40 | Modal backdrop, drawer overlay |
| `--z-modal` | 50 | Dialog, modal |
| `--z-toast` | 80 | Toast / snackbar notification |
| `--z-tooltip` | 90 | Tooltip (portalled ke body) |

Tooltip dan dropdown yang ada di dalam container dengan `transform` atau `overflow: hidden` **wajib** dirender lewat `createPortal(... , document.body)` — ini menghindari bug stacking context di mana `position: fixed` terperangkap di dalam transform parent.

```css
/* Resources/Global.css */
:root {
  --z-dropdown: 10;
  --z-sticky:   20;
  --z-overlay:  40;
  --z-modal:    50;
  --z-toast:    80;
  --z-tooltip:  90;
}
```

---

## 18. Responsive Breakpoints

Mengikuti Tailwind v4 defaults — mobile-first:

| Breakpoint | px | Nama Tailwind | Dipakai untuk |
|---|---|---|---|
| Default | < 640px | (none) | Mobile portrait |
| `sm` | ≥ 640px | `sm:` | Mobile landscape, kecil |
| `md` | ≥ 768px | `md:` | Tablet portrait |
| `lg` | ≥ 1024px | `lg:` | Tablet landscape, laptop |
| `xl` | ≥ 1280px | `xl:` | Desktop |
| `2xl` | ≥ 1536px | `2xl:` | Wide desktop |

### Aturan Breakpoint

- **Desain mobile-first**: style default = mobile; scaling ke atas via `sm:`/`md:`/`lg:`
- Grid layout: default `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`
- Heatmap contribution: `overflow-x-auto` + `width: fit-content` untuk bisa di-scroll di mobile
- Typography clamp: `clamp(2rem, 5vw, 4rem)` — tidak pernah >6rem di hero
- Container max-width: `max-w-7xl` (1280px) untuk konten utama, `max-w-3xl` untuk body text

---

## 19. Error Boundary

Setiap section/route wajib dibungkus Error Boundary untuk isolasi crash — satu section error tidak crash seluruh halaman:

```tsx
// Components/Elements/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <SectionErrorFallback />
    }
    return this.props.children
  }
}
```

Gunakan di Pages untuk membungkus setiap section yang fetch data:

```tsx
// Pages/Public/Home/index.tsx
<ErrorBoundary fallback={<ProjectsSectionError />}>
  <ProjectsSection />
</ErrorBoundary>
```

Fallback harus: (1) tidak crash sendiri, (2) tidak melakukan fetch, (3) menampilkan UI yang masuk akal — bukan blank white.

---

## 20. Referensi Dokumen

| Dokumen | Isi |
|---|---|
| `docs/PRD.md` | Feature requirements, personas, success metrics |
| `docs/DESIGN.md` | Arsitektur teknis, design system, security checklist, DB schema (dokumen ini) |
| `docs/FRONTEND.md` | Standar pengembangan frontend — TypeScript, testing, naming, tooling |
| `docs/BACKEND.md` | Standar pengembangan backend — Controller/Service/Resource, testing, security |
