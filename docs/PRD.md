# Product Requirement Document (PRD)
## Personal Portfolio & Admin Dashboard Platform

| Field | Detail |
|---|---|
| Project Name | Personal Portfolio Platform (Public Site + Admin Dashboard) |
| Author | Shaturne |
| Versi Dokumen | 1.0 |
| Status | Draft awal — siap direvisi |
| Stack Utama | React.js (Vite) + Laravel (REST API) |

---

## 1. Latar Belakang

Sebagai mahasiswa Teknik Informatika tingkat akhir dengan pengalaman frontend (React + Laravel/Inertia), Flutter, game dev, IoT, dan pentest, kamu butuh satu tempat terpusat yang merepresentasikan kemampuan itu secara profesional — bukan sekadar landing page statis, tapi **platform yang bisa berkembang**: hari ini portfolio, ke depan jadi CMS pribadi yang bisa kamu update tanpa harus redeploy kode setiap kali ada proyek baru.

Karena akan dipakai untuk job hunting, freelance, dan presentasi akademik/portofolio sidang, kesan pertama (visual + performa + kelancaran interaksi) jadi prioritas tinggi — tapi karena nantinya ada dashboard admin (data pribadi, auth, kontrol konten), **keamanan bukan opsional, melainkan requirement inti dari hari pertama.**

---

## 2. Tujuan Produk

1. Menyajikan profil, skill, dan proyek secara modern, interaktif, dan mudah dipahami dalam < 10 detik pertama (hero yang kuat).
2. Memisahkan presentasi (frontend React) dari data (Laravel REST API) agar konten bisa diubah tanpa sentuh kode FE.
3. Memberikan kontrol penuh ke pemilik (kamu) lewat dashboard admin yang aman untuk mengelola proyek, skill, pengalaman, dan pesan masuk.
4. Menunjukkan *engineering maturity* — bukan cuma "bisa bikin UI", tapi paham arsitektur, state management, dan keamanan aplikasi nyata.
5. Animasi yang **kaya tapi terarah** — setiap scroll terasa hidup, namun tetap menyampaikan informasi, bukan sekadar pamer efek.

---

## 3. Target Pengguna

| Persona | Tujuan akses | Kebutuhan utama |
|---|---|---|
| Recruiter / HR Tech | Screening cepat kandidat | Ringkas, jelas, ada CV/resume, kontak mudah |
| Hiring Manager / Tech Lead | Menilai kedalaman teknis | Detail studi kasus proyek, stack, peran, hasil |
| Klien freelance | Menilai kualitas & kepercayaan | Portfolio visual, testimoni (opsional), CTA kontak |
| Dosen / penguji akademik | Verifikasi kompetensi | Proyek kuliah, skripsi, sertifikat |
| Sesama developer / komunitas | Eksplorasi & insight teknis | Tulisan/blog teknis, link repo |
| Shaturne (Admin) | Mengelola seluruh konten | Dashboard cepat, aman, low-friction |

---

## 4. Lingkup Produk (Scope)

### 4.1 Fase 1 — Public Portfolio (MVP)
Website publik, *read-only* dari sisi pengunjung, konten diambil dari REST API.

### 4.2 Fase 2 — Admin Dashboard (CMS Pribadi)
Area privat dengan autentikasi, untuk CRUD seluruh konten yang tampil di Fase 1, plus inbox pesan kontak.

### 4.3 Fase 3 — Opsional (masa depan)
Blog teknis, analytics pengunjung, multi-bahasa (ID/EN), dark/light theme toggle, role tambahan (mis. editor).

> Dokumen ini fokus ke Fase 1 & 2 sebagai target rilis utama. Fase 3 dicatat sebagai arah pengembangan, bukan komitmen rilis.

---

## 5. Functional Requirements

### 5.1 Public Site

| ID | Requirement | Prioritas |
|---|---|---|
| F-01 | Hero section dengan identitas, role, CTA (lihat proyek / hubungi) | Must |
| F-02 | Section About — narasi singkat, foto/ilustrasi, value proposition | Must |
| F-03 | Section Skills — dikelompokkan per kategori (FE, BE, Mobile, Game, IoT, Security) | Must |
| F-04 | Section Experience — timeline kronologis (organisasi, internship) | Must |
| F-05 | Section Projects — grid/list proyek, ambil data dari API, filter per kategori | Must |
| F-06 | Halaman Detail Proyek — studi kasus: problem, peran, stack, hasil, link demo/repo | Must |
| F-07 | Section Education & Sertifikat | Should |
| F-08 | Form Kontak — kirim pesan ke backend, validasi & anti-spam | Must |
| F-09 | Download CV/Resume (PDF) | Should |
| F-10 | SEO meta dinamis per halaman (title, description, OG image) | Should |
| F-11 | Halaman 404 / Error custom yang tetap on-brand | Should |

### 5.2 Admin Dashboard

| ID | Requirement | Prioritas |
|---|---|---|
| F-20 | Login admin (session-based, aman) | Must |
| F-21 | CRUD Projects (judul, deskripsi, stack, gambar/media, status publish) | Must |
| F-22 | CRUD Skills (nama, kategori, level/proficiency, icon) | Must |
| F-23 | CRUD Experience/Timeline | Must |
| F-24 | Inbox pesan dari Form Kontak (lihat, tandai dibaca, hapus) | Must |
| F-25 | Manajemen profil (bio, foto, link sosial, file CV) | Should |
| F-26 | Media manager sederhana (upload, hapus gambar) | Should |
| F-27 | Activity log aksi admin (audit trail dasar) | Should |
| F-28 | Dashboard overview (ringkasan jumlah proyek, pesan baru, dll) | Could |

---

## 6. Non-Functional Requirements

| Aspek | Target |
|---|---|
| **Performance** | Lighthouse Performance ≥ 90 (mobile), FCP < 1.5s, LCP < 2.5s |
| **Security** | Lihat checklist OWASP di DESIGN.md §10 — wajib lolos sebelum go-live |
| **Accessibility** | Kontras WCAG AA, navigasi keyboard penuh, `prefers-reduced-motion` dihormati |
| **SEO** | Lighthouse SEO ≥ 95, structured data Person schema |
| **Responsiveness** | Mobile-first, breakpoint mulus 360px–1920px |
| **Maintainability** | Struktur folder konsisten (lihat DESIGN.md), linting wajib lolos sebelum commit |
| **Compatibility** | 2 versi terakhir Chrome, Firefox, Safari, Edge |
| **Scalability** | Backend siap nambah modul baru (blog, multi-role) tanpa refactor besar |

---

## 7. UX & Animasi/Interaksi — Requirement Khusus

Karena requirement eksplisit "jangan minim animasi", ini bukan nice-to-have tapi bagian dari spesifikasi:

| ID | Requirement |
|---|---|
| A-01 | **Page-load sequence**: hero punya entrance animation terkoreografi (bukan semua elemen muncul bersamaan) |
| A-02 | **Scroll-triggered reveal** di setiap section (fade + translate, staggered per child element) |
| A-03 | **Signature motion element**: ada satu elemen visual yang "menghubungkan" perjalanan scroll dari atas ke bawah (detail konsep di DESIGN.md §6) |
| A-04 | **Page transition** antar route (exit/enter animation, tidak hard-cut) |
| A-05 | **Skeleton loading** di semua komponen yang fetch data dari API (Projects grid, Project detail, Dashboard tables) — wajib, bukan spinner generik |
| A-06 | **Micro-interaction** pada hover/focus tombol, card, link (scale/transform halus) |
| A-07 | **Reduced motion fallback**: semua animasi punya versi "instant" untuk pengguna dengan `prefers-reduced-motion` |
| A-08 | Animasi tidak boleh mengorbankan performa — semua transform/opacity-based, dites di throttled CPU 4x |

---

## 8. User Stories (terpilih)

- Sebagai **recruiter**, saya ingin melihat proyek paling relevan dalam 5 detik pertama, agar saya cepat menilai kecocokan kandidat.
- Sebagai **pengunjung**, saya ingin melihat skeleton loading saat data proyek dimuat, agar saya tahu konten sedang dimuat bukan website rusak.
- Sebagai **pengunjung**, saya ingin mengirim pesan lewat form kontak dan mendapat konfirmasi jelas, agar saya yakin pesan terkirim.
- Sebagai **admin**, saya ingin login dengan aman dan sesi otomatis berakhir setelah idle, agar data tidak disalahgunakan jika lupa logout.
- Sebagai **admin**, saya ingin menambah proyek baru lengkap dengan gambar tanpa sentuh kode, agar portfolio selalu up to date.
- Sebagai **admin**, saya ingin melihat log siapa mengubah apa, agar saya bisa audit jika ada perubahan tak terduga.

---

## 9. Tech Stack Ringkas

| Layer | Tools |
|---|---|
| Frontend | React.js (Vite), Redux Toolkit, Framer Motion, Axios, React Router |
| Styling | Tailwind CSS (direkomendasikan, lihat DESIGN.md §6) |
| Backend | Laravel 11+, Sanctum (auth SPA), Eloquent ORM |
| Database | MySQL / PostgreSQL |
| Auth | Laravel Sanctum (cookie-based SPA auth) |
| Deployment | Frontend: Vercel/Netlify · Backend: VPS/Railway/Forge |

> Detail lengkap arsitektur, alasan pemilihan tool, dan struktur folder ada di `DESIGN.md`.

---

## 10. Roadmap / Fasa Pengerjaan

| Fase | Fokus | Estimasi |
|---|---|---|
| 0 — Setup | Scaffold FE+BE, struktur folder, design token, CI dasar | 3–5 hari |
| 1 — Public MVP | Hero, About, Skills, Projects (statis dulu boleh), Contact | 2–3 minggu |
| 1.5 — Integrasi API | Sambungkan FE ke Laravel API, skeleton loading, error handling | 1 minggu |
| 2 — Dashboard | Auth, CRUD Projects/Skills/Experience, Inbox | 2–3 minggu |
| 3 — Hardening | Security checklist, audit, testing, performance tuning | 1 minggu |
| 4 — Launch & Iterasi | Deploy, SEO, monitoring, feedback loop | Berkelanjutan |

---

## 11. Success Metrics

- Lighthouse Performance/SEO/Accessibility ≥ 90 di semua kategori.
- Waktu admin menambah 1 proyek baru < 2 menit (lewat dashboard, tanpa bantuan teknis).
- Zero critical/high finding pada self-audit security checklist (DESIGN.md §10) sebelum go-live.
- Jumlah pesan masuk via form kontak terlacak sebagai indikator engagement.

---

## 12. Asumsi & Batasan

- Single admin (kamu) di Fase 1–2; role tambahan (editor, dsb.) masuk Fase 3 jika dibutuhkan.
- Tidak ada pembayaran/transaksi finansial di scope ini, sehingga tidak butuh PCI-DSS, tapi tetap wajib HTTPS & proteksi data pribadi.
- Konten awal (copywriting, foto, deskripsi proyek) disiapkan terpisah dari proses development.

---

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Animasi berlebihan bikin lag di device low-end | Test di throttled CPU, gunakan `transform`/`opacity` saja, lazy-load section berat |
| Scope dashboard membesar tanpa kontrol | Kunci scope Fase 2 ke F-20–F-27, sisanya masuk backlog |
| Kebocoran data lewat dashboard yang kurang diuji | Checklist OWASP wajib sebelum go-live (DESIGN.md §10) |
| SEO lemah karena SPA (client-side render) | Pertimbangkan prerendering/SSR ringan untuk halaman publik utama, atau minimal SSG untuk meta tag kritikal |

---

## 14. Out of Scope (versi sekarang)

- Multi-bahasa
- Sistem komentar blog
- Pembayaran/donasi
- Multi-admin/role kompleks

---

## 15. Lampiran

Struktur folder lengkap, sistem desain visual, sistem animasi teknis, arsitektur API, dan security checklist → lihat **`DESIGN.md`**.
