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
  name: 'Aufa Ramadhan',
  role: 'Fullstack Developer',
  location: 'Indonesia',
  framing: {
    id: 'Saya membangun aplikasi web end-to-end: dari antarmuka React yang responsif hingga REST API Laravel yang terdokumentasi dan aman.',
    en: 'I build end-to-end web applications: from responsive React interfaces to well-documented, secure Laravel REST APIs.',
  } satisfies LocalizedText,
  email: 'rathermyself08@gmail.com',
  github: 'https://github.com/aufaramdhn',
  instagram: 'https://www.instagram.com/aufaramdhn',
  tiktok: 'https://www.tiktok.com/@shaturne',
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
    category: { id: 'Tools & Keamanan Web', en: 'Tools & Web Security' },
    items: ['Web App Security', 'Git', 'Linux', 'Figma', 'Docker'],
  },
]

// ── Experience ────────────────────────────────────────────────────────
export const EXPERIENCES: DummyExperience[] = [
  {
    title: {
      id: 'Frontend Developer Intern (Project Toko Gunajaya)',
      en: 'Frontend Developer Intern (Toko Gunajaya Project)',
    },
    organization: { id: 'Kodingin.id', en: 'Kodingin.id' },
    period: { id: 'Mar - Jul 2026', en: 'Mar - Jul 2026' },
    description: {
      id: 'Merancang dan membangun antarmuka web Sistem Manajemen Operasional dan Point of Sale (POS) untuk Toko Bangunan Gunajaya (berbasis proyek dari Kodingin.id) menggunakan React, Inertia.js, Tailwind CSS, dan Recharts. Mencakup arsitektur Atomic Design, kasir POS real-time (checkout tunai/transfer/kasbon dan cetak struk thermal 58mm/80mm), manajemen produk, piutang/cicilan, pintasan pencarian Ctrl+K, serta pengujian Black-Box.',
      en: 'Designed and built the web frontend for the Operational Management and Point of Sale (POS) System for Toko Bangunan Gunajaya (project-based internship at Kodingin.id) using React, Inertia.js, Tailwind CSS, and Recharts. Included Atomic Design architecture, real-time POS cashier (cash/transfer/credit checkout and 58mm/80mm thermal receipt printing), product and receivables management, Ctrl+K search, and Black-Box testing.',
    },
    type: 'kerja',
  },
  {
    title: {
      id: 'Frontend & Mobile Developer Intern',
      en: 'Frontend & Mobile Developer Intern',
    },
    organization: { id: 'Dewarangga', en: 'Dewarangga' },
    period: { id: 'Jan - Apr 2022', en: 'Jan - Apr 2022' },
    description: {
      id: 'Menjalani program magang selama 3 bulan (Januari sampai April 2022) untuk membangun aplikasi mobile menggunakan React Native, aplikasi web dengan React.js, serta pengembangan situs berbasis WordPress.',
      en: 'Completed a 3-month internship (January to April 2022) building mobile applications with React Native, web applications with React.js, and websites powered by WordPress.',
    },
    type: 'kerja',
  },
  {
    title: { id: 'Mahasiswa Teknik Informatika', en: 'Computer Science Student' },
    organization: { id: 'Universitas Pasundan', en: 'Universitas Pasundan' },
    period: { id: '2023 / Sekarang', en: '2023 / Present' },
    description: {
      id: 'Mendalami rekayasa perangkat lunak dan pengembangan web, dengan fondasi kuat di algoritma, arsitektur sistem, dan praktik pengembangan modern.',
      en: 'Studying software engineering and web development, building a strong foundation in algorithms, system architecture, and modern development practices.',
    },
    type: 'pendidikan',
  },
  {
    title: { id: 'Frontend Developer', en: 'Frontend Developer' },
    organization: {
      id: 'SMK Bina Mandiri Multi Media (RPL)',
      en: 'SMK Bina Mandiri Multi Media (RPL)',
    },
    period: { id: '2020 / 2023', en: '2020 / 2023' },
    description: {
      id: 'Mempelajari dasar rekayasa perangkat lunak serta membangun antarmuka web modern sebagai frontend developer.',
      en: 'Learned software engineering fundamentals and built modern web interfaces as a frontend developer.',
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
      id: 'Situs portfolio decoupled: React SPA + Laravel REST API.',
      en: 'A decoupled portfolio site: React SPA + Laravel REST API.',
    },
    description: {
      id: 'Portfolio personal dengan arsitektur terpisah penuh. Frontend React (Vite) di-deploy ke static hosting, backend Laravel sebagai data & auth provider via Sanctum cookie. Light/dark mode first-class, animasi terukur, dan dashboard CRUD ber-UUID.',
      en: 'A personal portfolio with a fully decoupled architecture. The React (Vite) frontend deploys to static hosting; the Laravel backend acts as a data & auth provider via Sanctum cookies. First-class light/dark mode, measured animation, and a UUID-based CRUD dashboard.',
    },
    stack: ['React', 'TypeScript', 'Laravel', 'PostgreSQL'],
    year: '2026',
    role: { id: 'Solo, desain & engineering', en: 'Solo, design & engineering' },
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
    role: { id: 'Tim, frontend & dokumentasi', en: 'Team, frontend & documentation' },
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
