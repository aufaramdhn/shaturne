# BACKEND.md
## Standar Pengembangan Backend — Production-Grade 2026

Dokumen ini adalah **company-level standard** yang reusable lintas project. Section bertanda `[PROJECT-SPECIFIC]` perlu disesuaikan per project.

---

## 1. Stack & Tooling

| Layer | Tool | Versi Minimum |
|---|---|---|
| Language | PHP | 8.3+ |
| Framework | Laravel | 11.x / 13.x |
| Auth | Laravel Sanctum (SPA cookie mode) | — |
| Authorization | spatie/laravel-permission | — |
| Database | PostgreSQL (primary) / MySQL | — |
| ORM | Eloquent | — |
| Testing | Pest | 3.x |
| Code style | Laravel Pint (PSR-12) | — |
| Audit | `composer audit` | — |

> **[PROJECT-SPECIFIC]** Ganti tool di atas sesuai stack project baru.

---

## 2. Arsitektur — Thin Controller

### 2.1 Alur Request
```
Request → FormRequest (validasi) → Controller → Service → Model/Eloquent → Response (Resource)
```

### 2.2 Controller
- Controller **hanya** boleh: menerima request, memanggil service, return resource
- **Tidak ada** business logic, query Eloquent, atau kondisional kompleks di controller
- Semua write operation gunakan `DB::transaction()` jika menyentuh lebih dari satu tabel

```php
// ✅ Benar — thin controller
class ProjectController extends Controller
{
    public function store(StoreProjectRequest $request, ProjectService $service): JsonResponse
    {
        return $this->created($service->create($request->validated()));
    }
}

// ❌ Salah — logic di controller
class ProjectController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->all(); // ❌ tidak validasi
        $project = Project::create($data); // ❌ logic di controller
        return response()->json($project); // ❌ raw model
    }
}
```

### 2.3 Service Layer
```php
// app/Services/ProjectService.php
class ProjectService
{
    public function create(array $validated): Project
    {
        return DB::transaction(function () use ($validated) {
            $project = Project::create($validated);
            // ... operasi lain
            return $project;
        });
    }
}
```

### 2.4 Base Controller Helper
```php
// Gunakan helper method yang konsisten
return $this->ok($data);           // 200 + envelope
return $this->created($data);      // 201 + envelope
return $this->noContent();         // 204
```

---

## 3. Validasi — Form Request Wajib

### 3.1 Aturan
- **Setiap** write endpoint punya dedicated `FormRequest` — tidak ada `$request->validate()` inline
- **Tidak pernah** `$request->all()` langsung ke Model
- Pesan error dalam Bahasa Indonesia (atau bahasa target user)

```php
// app/Http/Requests/StoreProjectRequest.php
class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Project::class);
    }

    public function rules(): array
    {
        return [
            'title.id'       => ['required', 'string', 'max:200'],
            'title.en'       => ['required', 'string', 'max:200'],
            'slug'           => ['required', 'string', 'unique:projects,slug'],
            'is_published'   => ['boolean'],
        ];
    }
}
```

### 3.2 Envelope Response Standar
```json
// Success
{ "success": true, "data": {}, "message": "OK" }

// Error validasi (422)
{ "success": false, "message": "Validasi gagal.", "errors": { "field": ["..."] } }

// Error server (500)
{ "success": false, "message": "Terjadi kesalahan internal." }
// — tidak pernah expose stack trace ke client
```

---

## 4. Model

### 4.1 Aturan Wajib
```php
class Project extends Model
{
    use HasUuids;  // [PROJECT-SPECIFIC] jika menggunakan UUID

    // ✅ Explicit fillable — wajib
    protected $fillable = [
        'title', 'slug', 'description', 'is_published',
    ];

    // ❌ Dilarang keras
    // protected $guarded = [];
}
```

### 4.2 UUID Primary Key
Semua model domain utama gunakan UUID, bukan auto-increment integer:
- UUID tidak bisa dienumerate (keamanan)
- Aman untuk distributed system

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasUuids;
    // UUID otomatis di-set via 'creating' event — jangan mute model events
}
```

### 4.3 Casting
```php
protected $casts = [
    'is_published' => 'boolean',
    'stack'        => 'array',
    'published_at' => 'datetime',
];
```

---

## 5. API Resource — Wajib

### 5.1 Aturan
- **Tidak pernah** return raw Model atau `->toJson()`
- Setiap model punya `Resource` yang mengontrol field yang diexpose
- Dashboard (authenticated) resource berbeda dari Public resource

```php
// app/Http/Resources/ProjectResource.php — public
class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid'        => $this->uuid,
            'title'       => $this->title,    // resolved locale
            'slug'        => $this->slug,
            'is_published' => $this->is_published,
        ];
        // — tidak expose: created_at, updated_at, internal fields
    }
}
```

---

## 6. Routing

### 6.1 Konvensi
```php
// Prefix: /api/v1/ — versioning wajib
// Public endpoints: slug-based
GET  /api/v1/projects
GET  /api/v1/projects/{slug}

// Authenticated/Dashboard: UUID-based
GET    /api/v1/dashboard/projects/{uuid}
POST   /api/v1/dashboard/projects
PUT    /api/v1/dashboard/projects/{uuid}
DELETE /api/v1/dashboard/projects/{uuid}
```

### 6.2 Rate Limiting

Semua route punya throttle — tidak ada endpoint tanpa limit:

```php
// Public GET (projects, skills, experience) — 120 req/min per IP
Route::middleware('throttle:120,1')->group(function () {
    Route::get('projects', ...);
    Route::get('projects/{slug}', ...);
    Route::get('skills', ...);
    Route::get('experience', ...);
});

// Contact form — ketat: 3 req/10 menit + honeypot
Route::post('contact', ...)->middleware('throttle:3,10');

// Endpoint yang sering dipoll frontend
Route::get('now-playing', ...)->middleware('throttle:60,1');
Route::get('github/contributions', ...)->middleware('throttle:30,1');

// Login — brute force guard: 5 percobaan/menit
Route::post('auth/login', ...)->middleware('throttle:5,1');
```

**Kenapa Referer/User-Agent check tidak dipakai:** header ini trivially spoofable (`curl -H "Referer: ..."`) dan dapat menyebabkan false negative di browser dengan privacy settings ketat yang strip Referer. Throttle berbasis IP adalah satu-satunya rate control yang tidak bisa di-bypass tanpa cost nyata (butuh IP baru setiap N request).

### 6.3 Middleware Stack per Group
```php
// Public — minimal middleware
Route::prefix('api/v1')->group(function () { ... });

// Dashboard — auth + role
Route::prefix('api/v1/dashboard')
    ->middleware(['auth:sanctum', 'role:admin'])
    ->group(function () { ... });
```

---

## 7. Authentication & Authorization

### 7.1 Sanctum SPA Cookie Mode
- **Tidak pernah** token di JSON response untuk SPA — gunakan `httpOnly` cookie
- CSRF protection via Sanctum: frontend harus hit `/sanctum/csrf-cookie` dulu
- Domain config di `sanctum.stateful_domains` wajib benar di production

### 7.2 Authorization — Policy Wajib
```php
// Setiap sensitive action gunakan Policy — tidak ada manual role check di controller
class ProjectPolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Project $project): bool
    {
        return $user->hasRole('admin');
    }
}

// Di Controller
$this->authorize('update', $project); // lempar 403 jika tidak authorized
```

### 7.3 Login Brute Force Protection
```php
Route::post('auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // max 5 attempts per menit
```

---

## 8. Database & Migrations

### 8.1 Aturan Migration
- Migration adalah **source of truth** untuk schema — tidak pernah edit DB langsung
- Setiap migration: satu perubahan logis (tidak bundle terlalu banyak)
- Selalu tulis `down()` method yang benar
- Index wajib untuk: foreign keys, kolom yang sering di-query, kolom `slug`

```php
Schema::create('projects', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('slug')->unique();
    $table->boolean('is_published')->default(false);
    $table->integer('sort_order')->default(0)->index();
    $table->timestamps();
});
```

### 8.2 Query Rules
- **Tidak pernah** N+1 query — gunakan `with()` untuk eager loading
- **Tidak pernah** `orderBy()` pada kolom JSON/translatable (PostgreSQL tidak support)
- Gunakan `chunkById()` untuk batch processing data besar

```php
// ✅ Benar — eager load
Project::with('images')->where('is_published', true)->get();

// ❌ Salah — N+1
$projects = Project::all();
foreach ($projects as $p) {
    $p->images; // query per-project
}
```

### 8.3 Transactions — Fail Closed
```php
// Semua operasi multi-tabel wajib dalam transaction
DB::transaction(function () use ($data) {
    $project = Project::create($data['project']);
    $project->images()->createMany($data['images']);
    // Jika salah satu gagal, semua di-rollback
});
```

---

## 9. Security

### 9.1 Non-Negotiables
- `APP_DEBUG=false` di staging dan production — **tidak pernah** exception di-expose ke client
- Custom exception handler: return generic JSON, detail hanya ke Laravel log
- `.env` tidak pernah di-commit
- `composer audit` wajib sebelum deploy

### 9.2 File Upload
```php
// Validasi MIME whitelist — tidak trust file extension saja
'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

// Randomize filename — jangan gunakan nama asli dari user
$filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

// Simpan di storage/app/public — tidak pernah di public/uploads
$path = $file->storeAs('images', $filename, 'public');
```

### 9.3 SQL Injection Prevention
- Selalu gunakan Eloquent atau Query Builder dengan parameter binding
- **Tidak pernah** string interpolasi di raw query

```php
// ✅ Benar
DB::select('SELECT * FROM projects WHERE slug = ?', [$slug]);

// ❌ Salah
DB::select("SELECT * FROM projects WHERE slug = '$slug'");
```

### 9.4 Security Headers
Tambah middleware `SecurityHeaders` yang set minimal:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: (per project)
Referrer-Policy: strict-origin-when-cross-origin
```

### 9.5 Mass Assignment
```php
// ✅ Explicit fillable
protected $fillable = ['title', 'slug'];

// ❌ Dilarang keras
protected $guarded = [];
```

---

## 10. Error Handling

### 10.1 Custom Exception Handler
```php
// app/Exceptions/Handler.php
public function render($request, Throwable $e): Response
{
    if ($request->expectsJson()) {
        // Log detail lengkap
        Log::error($e->getMessage(), ['exception' => $e]);

        // Return generic ke client — tidak pernah stack trace
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan internal.',
        ], 500);
    }

    return parent::render($request, $e);
}
```

### 10.2 HTTP Status Codes
| Situasi | Status |
|---|---|
| Success dengan data | 200 |
| Created | 201 |
| No content (delete) | 204 |
| Validation error | 422 |
| Unauthorized | 401 |
| Forbidden (policy) | 403 |
| Not found | 404 |
| Rate limited | 429 |
| Server error | 500 |

---

## 11. Testing

### 11.1 Cakupan Minimum
| Jenis | Target |
|---|---|
| Feature test (endpoint) | Setiap endpoint punya minimal 1 happy path + 1 error case |
| Unit test (service) | Logic kompleks di Service layer |
| Policy test | Setiap Policy method |

### 11.2 Pest Template
```php
// tests/Feature/Api/ProjectTest.php
it('returns published projects', function () {
    Project::factory()->count(3)->create(['is_published' => true]);

    $response = $this->getJson('/api/v1/projects');

    $response->assertOk()
             ->assertJsonCount(3, 'data')
             ->assertJsonStructure(['success', 'data' => [['uuid', 'title', 'slug']]]);
});

it('requires authentication for dashboard endpoints', function () {
    $this->postJson('/api/v1/dashboard/projects', [])
         ->assertUnauthorized();
});
```

### 11.3 Database Testing
```php
// Gunakan RefreshDatabase trait
uses(RefreshDatabase::class);

// Gunakan factory untuk data — tidak pernah hardcode data di test
$project = Project::factory()->published()->create();
```

---

## 12. Caching

### 12.1 Strategi
```php
// Cache data yang jarang berubah dan mahal dikomputasi
Cache::remember('github_contributions_2026', 21600, fn() => $this->fetch());
//                                            ^ 6 jam TTL

// Invalidate cache setelah write
Cache::forget('github_contributions_2026');
```

### 12.2 Cache Driver
- Development: `array` (in-memory)
- Production: Redis (direkomendasikan) atau database

---

## 13. Logging

### 13.1 Apa yang Di-log
```php
Log::info('User logged in', ['user_id' => $user->id]);
Log::warning('Rate limit hit', ['ip' => $request->ip(), 'endpoint' => $request->path()]);
Log::error('Payment failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
```

### 13.2 Apa yang TIDAK Di-log
- Password, token, atau credential apapun
- Data sensitif user (kartu kredit, KTP, dll)
- Full request body secara default (selective logging)

### 13.3 Log Channel per Environment
```php
// .env
LOG_CHANNEL=stack       // development: multiple channels
LOG_CHANNEL=single      // production: single file / external service
```

---

## 14. i18n Backend `[PROJECT-SPECIFIC]`

Jika konten DB perlu multilingual:

```php
// Gunakan spatie/laravel-translatable
// Kolom JSON: {"id": "...", "en": "..."}
// Model:
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations;
    public $translatable = ['title', 'description'];
}

// Middleware SetLocale: resolve dari ?lang= → Accept-Language → default
// Public Resource: return resolved string
// Dashboard Resource: return full {id, en} map untuk editing
```

---

## 15. Naming Conventions

| Item | Konvensi | Contoh |
|---|---|---|
| Controller | PascalCase + `Controller` | `ProjectController` |
| Model | PascalCase singular | `Project` |
| Migration | snake_case deskriptif | `create_projects_table` |
| Service | PascalCase + `Service` | `ProjectService` |
| Form Request | `Store/Update` + Model + `Request` | `StoreProjectRequest` |
| Resource | Model + `Resource` | `ProjectResource` |
| Policy | Model + `Policy` | `ProjectPolicy` |
| Route name | dot.notation | `projects.show` |
| Variable/function | camelCase | `$projectData`, `getPublished()` |
| Config key | snake_case | `services.github.token` |

---

## 16. Git & Deployment

### 16.1 Commit Convention
Sama dengan FRONTEND.md — Conventional Commits.

### 16.2 Pre-deploy Checklist
```
□ composer audit — tidak ada high/critical vulnerability
□ php artisan test — semua test pass
□ ./vendor/bin/pint --test — code style OK
□ APP_DEBUG=false di .env production
□ APP_KEY di-set
□ Semua migration sudah dijalankan
□ Storage symlink: php artisan storage:link
□ Cache config: php artisan config:cache
□ Cache routes: php artisan route:cache
□ Queue worker running (jika ada jobs)
```

### 16.3 Environment Separation
```
APP_ENV=local       → APP_DEBUG=true, LOG_LEVEL=debug
APP_ENV=staging     → APP_DEBUG=false, LOG_LEVEL=info
APP_ENV=production  → APP_DEBUG=false, LOG_LEVEL=warning
```
