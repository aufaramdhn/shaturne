# FRONTEND.md
## Standar Pengembangan Frontend — Production-Grade 2026

Dokumen ini adalah **company-level standard** yang reusable lintas project. Section bertanda `[PROJECT-SPECIFIC]` perlu disesuaikan per project. Semua prinsip berlaku universal.

---

## 1. Stack & Tooling

| Layer | Tool | Versi Minimum |
|---|---|---|
| Language | TypeScript (strict mode) | 5.x |
| Framework | React | 19.x |
| Build | Vite | 6.x |
| Styling | Tailwind CSS | 4.x |
| State (global) | Redux Toolkit | 2.x |
| State (local UI) | React Context API | — |
| Animation | Framer Motion | 11.x |
| HTTP | Axios | 1.x |
| Routing | React Router | 7.x |
| Testing (unit) | Vitest + React Testing Library | — |
| Testing (E2E) | Playwright | — |
| Linting | ESLint + Prettier | — |
| Git hooks | Husky + lint-staged | — |

> **[PROJECT-SPECIFIC]** Ganti tool di atas sesuai stack project baru. Prinsip di bawah tetap berlaku.

---

## 2. TypeScript — Wajib, Strict

### 2.1 Konfigurasi `tsconfig.json`
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2.2 Aturan Tipe
- **Dilarang `any`** — gunakan `unknown` lalu narrow, atau type yang tepat
- **Dilarang type assertion `as X`** kecuali ada komentar alasan yang jelas
- Interface untuk object shapes, Type alias untuk union/primitif/utility
- Semua props component harus bertipe eksplisit — tidak ada inferred props
- API response harus punya interface di `Services/` atau `Types/`

```typescript
// ✅ Benar
interface UserProfile {
  id: string
  name: string
  email: string
}

// ❌ Salah
const user: any = await fetchUser()
```

### 2.3 Penamaan Tipe
| Jenis | Konvensi | Contoh |
|---|---|---|
| Interface | PascalCase | `UserProfile`, `ApiResponse<T>` |
| Type alias | PascalCase | `Theme`, `Lang` |
| Enum | PascalCase | `UserRole` |
| Generic | Huruf kapital singkat | `T`, `TData`, `TError` |

---

## 3. Struktur Folder

```
src/
├── Animations/         # Framer Motion variants & transitions terpusat
│   ├── variants.ts     # fadeUp, staggerContainer, scaleIn, dll
│   ├── transitions.ts  # pageTransition presets
│   └── useScrollReveal.ts
│
├── Assets/             # Gambar, font, icon statis
│
├── Components/         # UI — Atomic Design (lihat §4)
│   ├── Elements/       # Atoms: stateless, props only
│   ├── Fragments/      # Molecules/organisms: domain-grouped
│   │   ├── Cards/
│   │   ├── Forms/
│   │   ├── Navigation/
│   │   └── Sections/   # Page-level sections (HeroSection, dll)
│   └── Layouts/        # Templates: MainLayout, DashboardLayout
│
├── Constants/          # Data statis & config token
│   ├── apiEndpoints.ts
│   ├── routes.ts
│   └── theme.ts        # CSS variable names only (bukan nilai)
│
├── Context/            # React Context untuk UI state lokal
│
├── Hooks/              # Custom hooks — logika bisnis
│   ├── Auth/
│   ├── Common/
│   └── Public/         # [PROJECT-SPECIFIC] nama domain
│
├── Locales/            # [PROJECT-SPECIFIC] jika ada i18n
│   ├── id.ts
│   ├── en.ts
│   └── index.ts
│
├── Pages/              # Route components — orkestrasi saja
│   ├── Auth/
│   ├── Dashboard/
│   └── Public/
│
├── Redux/              # State global
│   ├── Store.ts
│   └── Features/
│       └── [Domain]/
│           ├── [Domain]Slice.ts
│           └── [Domain]Selector.ts
│
├── Resources/          # Global CSS, font imports
│   └── Global.css
│
├── Routes/             # Konfigurasi routing
│   ├── index.tsx
│   └── ProtectedRoute.tsx
│
├── Services/           # API layer — satu-satunya yang boleh pakai axios
│   ├── Common/
│   │   ├── axiosInstance.ts
│   │   └── locale.ts
│   └── [Domain]/
│       └── [domain]Service.ts
│
├── Types/              # Shared TypeScript interfaces
│   ├── api.ts          # ApiResponse<T>, PaginatedResponse<T>
│   └── [domain].ts
│
└── Utils/              # Pure functions, zero side effects
    ├── formatters.ts
    ├── dateHelper.ts
    └── validators.ts
```

---

## 4. Component Rules (Atomic Design)

### 4.1 Hierarki & Dependency

```
Elements (Atoms)
  → tidak boleh import: Hooks, Services, Redux, Fragments
  → hanya: React, CSS, tipe lokal

Fragments (Molecules/Organisms)
  → boleh import: Elements, Hooks, Animations
  → tidak boleh: import langsung dari Services atau dispatch Redux

Sections (Page-level Fragments)
  → boleh import: Fragments, Elements, Hooks
  → satu Section = satu bagian halaman (Hero, About, dll)

Layouts (Templates)
  → boleh import: Fragments, Navigation components

Pages
  → boleh import: semua di atas
  → harus: sesedikit mungkin markup — mostly assembly dari Sections
```

### 4.2 Single Responsibility
- Satu file = satu component = satu tanggung jawab
- Jika component lebih dari ~150 baris, pecah
- Tidak ada business logic di dalam template markup — ekstrak ke hook

### 4.3 Props
```tsx
// ✅ Typed, explicit default via destructuring
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) { ... }
```

### 4.4 Skeleton Wajib
Setiap component yang fetch API **wajib** punya skeleton counterpart:
| Component | Skeleton |
|---|---|
| `ProjectCard` | `ProjectCardSkeleton` |
| `UserTable` | `TableRowSkeleton` |

Gunakan atom `SkeletonBox` dengan CSS shimmer — **tidak boleh** pakai generic spinner untuk konten.

### 4.5 Error Boundary
Setiap route/section level wajib dibungkus `ErrorBoundary` untuk isolasi crash:
```tsx
<ErrorBoundary fallback={<SectionError />}>
  <ProjectsSection />
</ErrorBoundary>
```

---

## 5. Custom Hooks

### 5.1 Prinsip
- Hook = jembatan antara UI dan data (Redux/API)
- Tidak ada fetch langsung di component — selalu lewat hook
- Hook tidak boleh return markup (TSX)
- Satu hook yang cohesive lebih baik dari 4 hook granular (useCreate/useEdit/useDelete)

### 5.2 Naming
```
use[Domain].ts          — fetch, state, filter, pagination
use[Domain]Mutation.ts  — jika write operations terlalu besar untuk digabung
use[Feature].ts         — untuk feature-specific logic (useLyrics, useScrollReveal)
```

### 5.3 Template
```typescript
export function useProjects() {
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectProjects)
  const isLoading = useAppSelector(selectProjectsLoading)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  return { projects, isLoading }
}
```

### 5.4 Cleanup
Selalu return cleanup di `useEffect` jika ada async atau subscription:
```typescript
useEffect(() => {
  let cancelled = false
  fetchData().then(d => { if (!cancelled) setData(d) })
  return () => { cancelled = true }
}, [])
```

---

## 6. State Management

### 6.1 Kapan Pakai Apa

| State | Tool | Contoh |
|---|---|---|
| Cross-page domain data | Redux Toolkit | auth user, projects list |
| UI state lokal per tree | React Context | sidebar open/close, theme |
| Form state | `useState` lokal | input values |
| Server cache | Custom hook + Redux | jika belum pakai RTK Query |

### 6.2 Redux Slice Pattern
```typescript
// Features/Project/ProjectSlice.ts
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: { /* sync reducers */ },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.isLoading = true })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchProjects.rejected, (state) => { state.isLoading = false })
  }
})
```

### 6.3 Selector — Wajib Memoized
```typescript
// Features/Project/ProjectSelector.ts
import { createSelector } from '@reduxjs/toolkit'

export const selectProjects = (state: RootState) => state.project.data
export const selectPublishedProjects = createSelector(
  selectProjects,
  (projects) => projects.filter(p => p.is_published)
)
```

---

## 7. Service Layer

### 7.1 Aturan
- **Hanya** `Services/` yang boleh import dan pakai Axios
- Component dan Hook **tidak pernah** import axios secara langsung
- Setiap service function return typed Promise

### 7.2 Axios Instance
```typescript
// Services/Common/axiosInstance.ts
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // wajib untuk cookie auth
})

// Interceptor 401 → logout + redirect
// Interceptor 419 → refresh CSRF + retry sekali
// Interceptor 422 → surface validation errors
```

### 7.3 Service Template
```typescript
// Services/Public/projectService.ts
export async function getProjects(): Promise<Project[]> {
  const res = await axiosInstance.get(API.PROJECTS)
  return res.data.data as Project[]
}
```

---

## 8. Routing

### 8.1 Struktur
```typescript
// Route path: kebab-case
/projects
/project-detail/:slug
/dashboard/projects

// Semua path disimpan di Constants/routes.ts — tidak ada magic string
export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  DASHBOARD: '/dashboard',
} as const
```

### 8.2 Protected Route
```tsx
// ProtectedRoute: cek auth di client-side (UX only)
// Server-side authorization tetap wajib via Policy/middleware
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <PageSkeleton />
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return children
}
```

### 8.3 Code Splitting Wajib
```typescript
// Semua Page di-lazy load — tidak ada page yang diimport langsung
const ProjectsPage = lazy(() => import('@/Pages/Public/Projects'))
const DashboardPage = lazy(() => import('@/Pages/Dashboard'))
```

---

## 9. Testing

### 9.1 Cakupan Minimum
| Jenis | Target | Tool |
|---|---|---|
| Unit (hooks, utils) | 80% | Vitest |
| Component | Happy path + error state | React Testing Library |
| E2E (critical flows) | Login, form submit, navigation | Playwright |

### 9.2 Aturan Testing
- Test file co-located: `Component.test.tsx` di samping `Component.tsx`
- Tidak ada `getByTestId` — gunakan accessible queries (`getByRole`, `getByLabelText`)
- Mock hanya di boundary sistem (API calls) — jangan mock internal logic
- Satu `describe` per file, satu `it` per behaviour

### 9.3 Template Test
```tsx
describe('ContactForm', () => {
  it('shows validation error when email is empty', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: /kirim/i }))
    expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument()
  })
})
```

---

## 10. Performance

### 10.1 Code Splitting
- Semua route: `React.lazy` + `Suspense`
- Heavy components (editor, chart): lazy import on demand

### 10.2 Render Optimization
```tsx
// Gunakan hanya ketika ada bukti masalah performa (profiling dulu)
const ExpensiveList = memo(({ items }: Props) => { ... })
const handleClick = useCallback(() => { ... }, [dep])
const computed = useMemo(() => heavyCalc(data), [data])
```

### 10.3 Image
- Format: WebP/AVIF selalu
- Selalu set `width` + `height` untuk mencegah CLS
- `loading="lazy"` untuk semua gambar below-the-fold

### 10.4 Bundle
- Analisis dengan `vite-bundle-visualizer` sebelum deploy
- Target: initial JS bundle < 200KB gzipped
- Vendor chunk terpisah dari app code

---

## 11. Accessibility (a11y)

### 11.1 Wajib
- Kontras teks minimum **4.5:1** (body) dan **3:1** (heading besar)
- **Tidak pernah** menghapus focus ring — custom styling OK, hapus tidak OK
- Semua interactive element punya label: `aria-label` untuk icon-only button
- Heading hierarchy: `h1` → `h2` → `h3`, tidak boleh loncat level
- Form: setiap input punya `<label>` yang terhubung via `for`/`htmlFor`

### 11.2 Testing a11y
```tsx
import { axe } from 'jest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(<ContactForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## 12. Animation

### 12.1 Aturan GPU
- **Hanya** animasi `transform` dan `opacity` — tidak pernah `width`, `height`, `top`, `left`
- Gunakan `scaleX`/`scaleY`, bukan `width`/`height`

### 12.2 Framer Motion Conventions
```tsx
// Semua variant di Animations/variants.ts — tidak inline di component
// variants.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

// Di component .tsx — import variant, pakai di motion element
<motion.div variants={fadeUp} initial="hidden" animate="visible" />
```

### 12.3 `AnimatePresence`
Wajib dipakai untuk unmount animation (modal close, route transition).

---

## 13. Security

### 13.1 XSS
- **Dilarang** `dangerouslySetInnerHTML` tanpa `DOMPurify.sanitize()` terlebih dahulu
- Tidak pernah interpolasi user input langsung ke DOM

### 13.2 Auth
- Token autentikasi: **httpOnly cookie** — tidak pernah `localStorage`
- `localStorage` hanya untuk UI preferences (theme, lang) — tidak pernah sensitive data
- Protected route di frontend adalah UX-only — server wajib authorize setiap request

### 13.3 Dependency
```bash
# Wajib dijalankan sebelum setiap deploy
npm audit
npm outdated
```

### 13.4 Environment Variables
- Semua config sensitif: `.env` — tidak pernah hardcode
- Prefix `VITE_` hanya untuk yang benar-benar perlu di browser
- `.env` tidak pernah di-commit — selalu di `.gitignore`

---

## 14. Import Order

Urutan import yang enforced oleh ESLint (import/order):

```typescript
// 1. React & library eksternal
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// 2. Internal config & constants
import { ROUTES } from '@/Constants/routes'
import { API } from '@/Constants/apiEndpoints'

// 3. Types
import type { Project } from '@/Types/project'

// 4. Services & Hooks
import { useProjects } from '@/Hooks/Public/useProjects'

// 5. Components
import ProjectCard from '@/Components/Fragments/Cards/ProjectCard'

// 6. Styles & Assets
import '@/Resources/Global.css'
```

---

## 15. Naming Conventions

| Item | Konvensi | Contoh |
|---|---|---|
| Component file | PascalCase | `ProjectCard.tsx` |
| Hook file | camelCase + `use` | `useProjects.ts` |
| Service file | camelCase + `Service` | `projectService.ts` |
| Redux slice | PascalCase + `Slice` | `ProjectSlice.ts` |
| Redux selector | PascalCase + `Selector` | `ProjectSelector.ts` |
| Util file | camelCase | `formatters.ts` |
| CSS class | kebab-case | `card-container` |
| Route path | kebab-case | `/project-detail/:slug` |
| Env variable | SCREAMING_SNAKE | `VITE_API_URL` |
| Constant | SCREAMING_SNAKE | `MAX_UPLOAD_SIZE` |
| Boolean state/prop | `is`/`has`/`can` prefix | `isLoading`, `hasError` |

---

## 16. Code Quality

### 16.1 ESLint Rules Wajib
```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "import/order": "error",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### 16.2 Pre-commit (Husky)
```bash
# .husky/pre-commit
npx lint-staged
```
```json
// lint-staged config
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md}": ["prettier --write"]
}
```

### 16.3 Larangan
- `console.log` di production code — gunakan logging service atau hapus
- Commented-out code di-commit — hapus atau jadikan TODO dengan tiket
- Magic number/string — ekstrak ke Constants
- Nesting lebih dari 3 level — refactor ke early return

---

## 17. Git & Collaboration

### 17.1 Branch Naming
```
feat/[ticket]-short-description
fix/[ticket]-short-description
chore/[ticket]-short-description
docs/update-readme
```

### 17.2 Commit Convention (Conventional Commits)
```
feat: tambah contribution heatmap di halaman about
fix: perbaiki tooltip z-index pada heatmap
chore: update dependencies
docs: tambah standar testing ke FRONTEND.md
refactor: pecah Home page menjadi section components
test: tambah unit test untuk useGithubContributions
```

### 17.3 PR Checklist
Sebelum merge:
- [ ] Semua ESLint error resolved
- [ ] Test tidak ada yang gagal (`npm test`)
- [ ] Tidak ada `console.log` tersisa
- [ ] TypeScript tidak ada error (`tsc --noEmit`)
- [ ] UI dicek di mobile (375px) dan desktop (1280px)
- [ ] Tidak ada hardcoded string yang harusnya ada di Constants/Locales

---

## 18. i18n `[PROJECT-SPECIFIC]`

Jika project bilingual/multilingual:

```
Locales/
├── id.ts       # Kamus Bahasa Indonesia
├── en.ts       # Kamus Bahasa Inggris
└── index.ts    # detectLang(), tx(), Lang type

// Aturan:
// - Locale di URL: /:lang/route
// - Gunakan t('key') untuk UI strings
// - Gunakan tx(field, lang) untuk DB content yang dilocalize
// - Jangan hardcode teks UI di template markup — selalu lewat t()
// - id.ts TIDAK menggunakan `as const` (merusak compatibility dengan en.ts)
```

---

## 19. Checklist Sebelum Deploy

```
□ npm audit — tidak ada high/critical vulnerability
□ npm run build — tidak ada error
□ tsc --noEmit — tidak ada TypeScript error
□ npm test — semua test pass
□ Lighthouse score: Performance ≥ 90, Accessibility ≥ 90
□ .env production sudah di-set di hosting
□ APP_DEBUG / VITE_DEV_MODE = false
□ Bundle size dicek — tidak ada regression signifikan
□ UI di-test di Chrome, Firefox, Safari (minimal)
□ Mobile layout dicek (375px, 768px)
```
