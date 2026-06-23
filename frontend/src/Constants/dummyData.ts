import type { LocalizedText } from '@/Locales'

// TEMP — data dummy Phase 3 (§15). Diganti API call di Phase 4.
// Prose fields are bilingual (LocalizedText); resolve with tx(field, lang).

export interface DummyProject {
  slug: string
  title: string
  summary: LocalizedText
  description: LocalizedText
  stack: string[]
  year: string
  role: LocalizedText
  repoUrl: string | null
  demoUrl: string | null
  status: 'rilis' | 'dikerjakan'
  accent: 'moss' | 'mustard' // hint warna cover: moss→cyan, mustard→violet
}

export interface DummySkillGroup {
  category: LocalizedText
  items: string[]
}

export interface DummyExperience {
  title: LocalizedText
  organization: LocalizedText
  period: LocalizedText
  description: LocalizedText
  type: 'kerja' | 'organisasi' | 'pendidikan'
}

// ── Profil ────────────────────────────────────────────────────────────
export const PROFILE = {
  name: 'Naufa Ramadhana', // ganti dengan nama asli
  role: 'Fullstack Developer',
  location: 'Indonesia',
  framing: {
    id: 'Fullstack developer dengan kebiasaan mencatat tiap keputusan teknis — dari laporan pentest, GDD, sampai dokumentasi praktikum IoT.',
    en: 'A fullstack developer with a habit of documenting every technical decision — from pentest reports and GDDs to IoT lab write-ups.',
  } satisfies LocalizedText,
  email: 'halo@shaturne.dev', // ganti
  github: 'https://github.com/', // ganti
}

// ── Skills ────────────────────────────────────────────────────────────
export const SKILLS: DummySkillGroup[] = [
  {
    category: { id: 'Frontend', en: 'Frontend' },
    items: ['React', 'TypeScript', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    category: { id: 'Backend', en: 'Backend' },
    items: ['Laravel', 'PHP', 'REST API', 'PostgreSQL', 'MySQL'],
  },
  {
    category: { id: 'Keamanan & Lainnya', en: 'Security & More' },
    items: ['Web Pentesting', 'Git', 'Figma', 'Dokumentasi Teknis'],
  },
]

// ── Experience ────────────────────────────────────────────────────────
export const EXPERIENCES: DummyExperience[] = [
  {
    title: { id: 'Frontend Developer', en: 'Frontend Developer' },
    organization: { id: 'Proyek Lepas', en: 'Freelance' },
    period: { id: '2024 — Sekarang', en: '2024 — Present' },
    description: {
      id: 'Membangun antarmuka SPA dengan React + TypeScript, fokus pada aksesibilitas, animasi yang terukur, dan dokumentasi komponen yang rapi.',
      en: 'Building SPA interfaces with React + TypeScript, focused on accessibility, measured animation, and tidy component documentation.',
    },
    type: 'kerja',
  },
  {
    title: { id: 'Anggota Divisi Keamanan', en: 'Security Division Member' },
    organization: { id: 'Komunitas Keamanan Siber', en: 'Cybersecurity Community' },
    period: { id: '2023 — 2024', en: '2023 — 2024' },
    description: {
      id: 'Melakukan pengujian penetrasi web dan menyusun laporan temuan lengkap dengan risk heatmap serta rekomendasi mitigasi.',
      en: 'Performing web penetration testing and writing complete findings reports with risk heatmaps and mitigation recommendations.',
    },
    type: 'organisasi',
  },
  {
    title: { id: 'Mahasiswa Teknik Informatika', en: 'Computer Science Student' },
    organization: { id: 'Universitas', en: 'University' },
    period: { id: '2022 — Sekarang', en: '2022 — Present' },
    description: {
      id: 'Mendalami rekayasa perangkat lunak, sistem tertanam (IoT), dan pengembangan game — semuanya didokumentasikan secara konsisten.',
      en: 'Studying software engineering, embedded systems (IoT), and game development — all documented consistently.',
    },
    type: 'pendidikan',
  },
]

// ── Projects ──────────────────────────────────────────────────────────
export const PROJECTS: DummyProject[] = [
  {
    slug: 'shaturne-portfolio',
    title: 'Shaturne Portfolio',
    summary: {
      id: 'Situs portfolio decoupled — React SPA + Laravel REST API.',
      en: 'A decoupled portfolio site — React SPA + Laravel REST API.',
    },
    description: {
      id: 'Portfolio personal dengan arsitektur terpisah penuh. Frontend React (Vite) di-deploy ke static hosting, backend Laravel sebagai data & auth provider via Sanctum cookie. Light/dark mode first-class, animasi terukur, dan dashboard CRUD ber-UUID.',
      en: 'A personal portfolio with a fully decoupled architecture. The React (Vite) frontend deploys to static hosting; the Laravel backend acts as a data & auth provider via Sanctum cookies. First-class light/dark mode, measured animation, and a UUID-based CRUD dashboard.',
    },
    stack: ['React', 'TypeScript', 'Laravel', 'PostgreSQL'],
    year: '2026',
    role: { id: 'Solo — desain & engineering', en: 'Solo — design & engineering' },
    repoUrl: 'https://github.com/',
    demoUrl: null,
    status: 'dikerjakan',
    accent: 'moss',
  },
  {
    slug: 'risk-heatmap-reporter',
    title: 'Risk Heatmap Reporter',
    summary: {
      id: 'Alat bantu menyusun laporan pentest dengan visual risk matrix.',
      en: 'A tool for writing pentest reports with a visual risk matrix.',
    },
    description: {
      id: 'Aplikasi web untuk merapikan temuan pengujian penetrasi menjadi laporan terstruktur. Menghasilkan risk heatmap interaktif (likelihood × impact) dan ekspor PDF yang konsisten.',
      en: 'A web app that turns penetration-testing findings into structured reports. It produces an interactive risk heatmap (likelihood × impact) and consistent PDF exports.',
    },
    stack: ['React', 'TypeScript', 'Node.js'],
    year: '2024',
    role: { id: 'Solo', en: 'Solo' },
    repoUrl: 'https://github.com/',
    demoUrl: null,
    status: 'rilis',
    accent: 'mustard',
  },
  {
    slug: 'iot-praktikum-dashboard',
    title: 'IoT Praktikum Dashboard',
    summary: {
      id: 'Dashboard realtime untuk sensor praktikum mikrokontroler.',
      en: 'A realtime dashboard for microcontroller lab sensors.',
    },
    description: {
      id: 'Dashboard monitoring data sensor (suhu, kelembapan, gerak) dari perangkat ESP32 via MQTT. Menampilkan grafik realtime dan riwayat, lengkap dengan modul dokumentasi tiap percobaan.',
      en: 'A monitoring dashboard for sensor data (temperature, humidity, motion) from ESP32 devices over MQTT. Shows realtime and historical charts, with a documentation module for each experiment.',
    },
    stack: ['React', 'MQTT', 'Chart.js'],
    year: '2023',
    role: { id: 'Tim — frontend & dokumentasi', en: 'Team — frontend & documentation' },
    repoUrl: 'https://github.com/',
    demoUrl: null,
    status: 'rilis',
    accent: 'moss',
  },
]

// Helper ringan untuk halaman detail (Phase 4 diganti fetch by slug)
export function findProjectBySlug(slug: string): DummyProject | undefined {
  return PROJECTS.find(p => p.slug === slug)
}
