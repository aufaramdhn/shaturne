<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

// NOTE: do NOT use WithoutModelEvents — HasUuids sets the UUID on the
// "creating" model event, which that trait would mute.
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Role + admin user ────────────────────────────────────────────
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $admin = User::firstOrCreate(
            ['email' => 'rathermyself08@gmail.com'],
            ['name' => 'Aufa Ramadhan', 'password' => Hash::make('password')],
        );
        $admin->assignRole($adminRole);

        // ── Skills ───────────────────────────────────────────────────────
        $cat = [
            'Frontend' => ['id' => 'Frontend', 'en' => 'Frontend'],
            'Backend' => ['id' => 'Backend', 'en' => 'Backend'],
            'Tools' => ['id' => 'Tools & Keamanan Web', 'en' => 'Tools & Web Security'],
        ];
        $skills = [
            ['React', 'Frontend', 92], ['TypeScript', 'Frontend', 88],
            ['Redux Toolkit', 'Frontend', 80], ['Tailwind CSS', 'Frontend', 85],
            ['Framer Motion', 'Frontend', 78], ['Vite', 'Frontend', 80],
            ['Laravel', 'Backend', 85], ['PHP', 'Backend', 82],
            ['REST API', 'Backend', 84], ['PostgreSQL', 'Backend', 75],
            ['Web App Security', 'Tools', 70], ['Git', 'Tools', 88],
            ['Linux', 'Tools', 75], ['Figma', 'Tools', 72], ['Docker', 'Tools', 65],
        ];
        foreach ($skills as $i => [$name, $category, $prof]) {
            Skill::updateOrCreate(
                ['name' => $name],
                ['category' => $cat[$category], 'proficiency' => $prof, 'sort_order' => $i],
            );
        }

        // ── Projects ─────────────────────────────────────────────────────
        $projects = [
            [
                'title' => ['id' => 'Shaturne Portfolio', 'en' => 'Shaturne Portfolio'],
                'slug' => 'shaturne-portfolio',
                'description' => [
                    'id' => 'Portfolio personal dengan arsitektur terpisah penuh. Frontend React (Vite) di-deploy ke static hosting, backend Laravel sebagai data & auth provider via Sanctum cookie. Light/dark mode, animasi terukur, dan dashboard CRUD ber-UUID.',
                    'en' => 'A personal portfolio with a fully decoupled architecture. React (Vite) frontend on static hosting, Laravel as the data & auth provider over Sanctum cookies. Light/dark mode, measured animation, and a UUID-based CRUD dashboard.',
                ],
                'stack' => ['React', 'TypeScript', 'Laravel', 'PostgreSQL'],
                'is_published' => true,
                'sort_order' => 1,
            ],
            [
                'title' => ['id' => 'Risk Heatmap Reporter', 'en' => 'Risk Heatmap Reporter'],
                'slug' => 'risk-heatmap-reporter',
                'description' => [
                    'id' => 'Aplikasi web untuk mengubah temuan pengujian penetrasi menjadi laporan terstruktur. Menghasilkan risk heatmap interaktif (likelihood × impact) dan ekspor PDF yang konsisten.',
                    'en' => 'A web app that turns penetration-test findings into structured reports. Generates an interactive risk heatmap (likelihood × impact) and consistent PDF exports.',
                ],
                'stack' => ['React', 'TypeScript', 'Node.js'],
                'is_published' => true,
                'sort_order' => 2,
            ],
            [
                'title' => ['id' => 'Dashboard Praktikum IoT', 'en' => 'IoT Lab Dashboard'],
                'slug' => 'iot-praktikum-dashboard',
                'description' => [
                    'id' => 'Dashboard monitoring data sensor (suhu, kelembapan, gerak) dari perangkat ESP32 via MQTT. Menampilkan grafik realtime dan riwayat, lengkap dengan modul dokumentasi tiap percobaan.',
                    'en' => 'A monitoring dashboard for sensor data (temperature, humidity, motion) from ESP32 devices over MQTT. Shows realtime charts and history, with a documentation module per experiment.',
                ],
                'stack' => ['React', 'MQTT', 'Chart.js'],
                'is_published' => true,
                'sort_order' => 3,
            ],
        ];
        foreach ($projects as $p) {
            Project::updateOrCreate(['slug' => $p['slug']], $p);
        }

        // ── Experiences ──────────────────────────────────────────────────
        $experiences = [
            [
                'title' => ['id' => 'Fullstack Developer', 'en' => 'Fullstack Developer'],
                'organization' => 'Proyek Lepas',
                'start_date' => '2024-01-01',
                'end_date' => null,
                'description' => [
                    'id' => 'Membangun aplikasi web end-to-end dengan React, TypeScript, dan Laravel — dari desain antarmuka hingga REST API, autentikasi, dan konfigurasi deployment.',
                    'en' => 'Building end-to-end web applications with React, TypeScript, and Laravel — from interface design to REST APIs, authentication, and deployment setup.',
                ],
                'type' => 'work',
                'sort_order' => 1,
            ],
            [
                'title' => ['id' => 'Mahasiswa Teknik Informatika', 'en' => 'Computer Science Student'],
                'organization' => 'Universitas Pasundan',
                'start_date' => '2022-09-01',
                'end_date' => null,
                'description' => [
                    'id' => 'Mendalami rekayasa perangkat lunak dan pengembangan web, dengan fondasi kuat di algoritma, arsitektur sistem, dan praktik pengembangan modern.',
                    'en' => 'Studying software engineering and web development, building a strong foundation in algorithms, system architecture, and modern development practices.',
                ],
                'type' => 'education',
                'sort_order' => 2,
            ],
        ];
        foreach ($experiences as $e) {
            Experience::updateOrCreate(['organization' => $e['organization']], $e);
        }
    }
}
