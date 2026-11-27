interface SkillLogoProps {
  name: string
  className?: string
}

const ACCENT_MAP: Record<string, string> = {
  react: '#61DAFB',
  typescript: '#3178C6',
  javascript: '#F7DF1E',
  'redux toolkit': '#764ABC',
  redux: '#764ABC',
  'tailwind css': '#38BDF8',
  tailwindcss: '#38BDF8',
  'framer motion': '#BB4B96',
  vite: '#646CFF',
  'next.js': '#E2E8F0',
  vue: '#42B883',
  html: '#E34F26',
  css: '#1572B6',
  laravel: '#FF2D20',
  php: '#777BB4',
  'rest api': '#22D3EE',
  postgresql: '#4169E1',
  mysql: '#4479A1',
  'node.js': '#5FA04E',
  python: '#3776AB',
  redis: '#DC382D',
  'web pentesting': '#F43F5E',
  'web app security': '#10B981',
  security: '#10B981',
  git: '#F05032',
  github: '#E2E8F0',
  linux: '#FCC624',
  figma: '#A259FF',
  docker: '#2496ED',
}

export function getSkillAccent(name: string): string {
  return ACCENT_MAP[name.trim().toLowerCase()] ?? 'var(--color-accent)'
}

export default function SkillLogo({ name, className = 'h-9 w-9' }: SkillLogoProps) {
  const key = name.trim().toLowerCase()

  switch (key) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1.25">
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </g>
        </svg>
      )
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="3.5" fill="#3178C6" />
          <path
            d="M13.5 11.4H10v1.4h1.15v5.7h1.65v-5.7H14v-1.4h-.5Zm4.65 1.18c-.48-.28-1.08-.42-1.76-.42-1.45 0-2.42.75-2.42 1.92 0 1.07.72 1.56 1.88 1.98l.42.16c.58.22.84.42.84.8 0 .44-.4.72-1.06.72-.68 0-1.3-.24-1.85-.66l-.65 1.24c.62.45 1.48.72 2.46.72 1.68 0 2.72-.78 2.72-2.06 0-1.06-.62-1.6-1.92-2.06l-.42-.15c-.55-.2-.8-.38-.8-.72 0-.37.34-.63.9-.63.5 0 .96.15 1.38.44l.38-1.28Z"
            fill="#FFFFFF"
          />
        </svg>
      )
    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="3.5" fill="#F7DF1E" />
          <path
            d="M12.7 16.95c0 1.32-.77 1.92-1.9 1.92-.82 0-1.43-.42-1.82-1.06l1.33-.8c.26.44.5.64.93.64.45 0 .74-.18.74-.88V11.5h1.72v5.45Zm5.95.03c0 1.18-.94 1.9-2.42 1.9-1.15 0-2.02-.48-2.55-1.25l1.3-.78c.35.48.78.73 1.3.73.54 0 .88-.22.88-.6 0-.42-.33-.58-1.02-.88l-.38-.17c-1.1-.47-1.83-1.06-1.83-2.3 0-1.14.87-2.01 2.23-2.01.97 0 1.67.34 2.17 1.22l-1.2.77c-.27-.47-.56-.66-.97-.66-.44 0-.72.28-.72.64 0 .45.28.63.93.91l.38.17c1.3.56 1.9 1.12 1.9 2.31Z"
            fill="#111827"
          />
        </svg>
      )
    case 'redux toolkit':
    case 'redux':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M16.2 15.6c2.6-.3 4.3-2 4.3-4.2 0-2.1-1.6-3.7-3.8-3.8-.7-2.7-3-4.6-5.9-4.6-3 0-5.4 2.1-6 5-2 .6-3.3 2.4-3.3 4.6 0 2.7 2.2 4.9 5 4.9h1.2"
            stroke="#764ABC"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="9.2" cy="14.5" r="1.4" fill="#A78BFA" />
          <circle cx="15.1" cy="12.1" r="1.4" fill="#A78BFA" />
          <circle cx="11.4" cy="8.4" r="1.4" fill="#A78BFA" />
          <path
            d="M9.2 14.5c2.2.7 4.4-.2 5.9-2.4M15.1 12.1c-.4-2.1-1.8-3.3-3.7-3.7M11.4 8.4c-1.8 1.5-2.6 3.7-2.2 6.1"
            stroke="#A78BFA"
            strokeWidth="1.2"
          />
        </svg>
      )
    case 'tailwind css':
    case 'tailwindcss':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.48 6 12 6Zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.15 9.48 12 7 12Z"
            fill="#38BDF8"
          />
        </svg>
      )
    case 'framer motion':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 3h14v6.5h-7L5 3Z" fill="#0055FF" />
          <path d="M5 9.5h7l7 6.5H5V9.5Z" fill="#8855FF" />
          <path d="M5 16h7v5.5L5 16Z" fill="#FF0088" />
        </svg>
      )
    case 'vite':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M21 4.5 12.4 20.4a.5.5 0 0 1-.88 0L3 4.5a.5.5 0 0 1 .53-.73l8.47 1.5 8.47-1.5A.5.5 0 0 1 21 4.5Z"
            fill="#646CFF"
          />
          <path
            d="M15.8 3.2 10.6 4.2a.3.3 0 0 0-.24.28l-.32 5.45a.3.3 0 0 0 .36.31l1.45-.33a.3.3 0 0 1 .36.35l-.43 2.1a.3.3 0 0 0 .38.35l.9-.27a.3.3 0 0 1 .38.34l-.68 3.3a.2.2 0 0 0 .37.14l4.82-9.62a.3.3 0 0 0-.33-.43l-1.5.29a.3.3 0 0 1-.34-.38l.97-3.36a.3.3 0 0 0-.35-.38Z"
            fill="#FFCE2E"
          />
        </svg>
      )
    case 'laravel':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF2D20"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M3.5 6.5 7.5 4.2l4 2.3v8.2l5-2.8V7.4l3.8-2.2 2.2 1.3v6.8l-7 4-4-2.3-4 2.3-4-2.3V6.5Z" />
          <path d="M7.5 4.2v8.2l4-2.3M11.5 14.7l4 2.3v-4.5M16.5 7.4l3.8 2.2M3.5 6.5l4 2.3 4-2.3" />
        </svg>
      )
    case 'php':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="6.2" fill="#777BB4" />
          <path
            d="M6.2 14.6 7.3 9.4h2.1c1 0 1.55.55 1.36 1.5-.2 1.04-.97 1.62-2.06 1.62H7.6l-.42 2.08H6.2Zm1.62-2.95h.72c.62 0 1.02-.28 1.13-.82.1-.47-.14-.72-.68-.72h-.82l-.35 1.54Zm3.08 2.95 1.48-6.9h1.02l-.42 1.95h1.02c.98 0 1.45.48 1.24 1.46l-.74 3.49h-1.04l.69-3.27c.11-.52-.07-.75-.58-.75h-.8l-.85 4.02H10.9Zm4.55 0 1.1-5.2h2.1c1 0 1.55.55 1.36 1.5-.2 1.04-.97 1.62-2.06 1.62h-1.1l-.42 2.08h-.98Zm1.62-2.95h.72c.62 0 1.02-.28 1.13-.82.1-.47-.14-.72-.68-.72h-.82l-.35 1.54Z"
            fill="#FFFFFF"
          />
        </svg>
      )
    case 'rest api':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 7 4 12l4 5M16 7l4 5-4 5" />
          <path d="m13.5 5-3 14" />
        </svg>
      )
    case 'postgresql':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 4.5c3.5 0 6.8 2 7 6.2.15 3.1-1.3 5.3-2.6 6-.7.38-1.4.2-1.7-.3-.45-.75-.2-2-.2-2.9 0-1.2-.8-2-2.5-2s-2.5.8-2.5 2c0 .9.25 2.15-.2 2.9-.3.5-1 .68-1.7.3C6.3 16 4.85 13.8 5 10.7 5.2 6.5 8.5 4.5 12 4.5Z" />
          <path d="M9.5 9.2h.01M14.5 9.2h.01" strokeWidth="2.2" />
          <path d="M11.6 13.5v4.3c0 1.3.7 2.2 1.8 2.2.85 0 1.4-.5 1.5-1.2" />
        </svg>
      )
    case 'mysql':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <ellipse cx="12" cy="6.5" rx="7.5" ry="2.8" />
          <path d="M4.5 6.5v5.5c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8V6.5" />
          <path d="M4.5 12v5.5c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8V12" />
        </svg>
      )
    case 'web pentesting':
    case 'web app security':
    case 'security':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#34D399"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M12 3 4.5 6.2v5.3c0 4.6 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5.2 7.5-9.8V6.2L12 3Z" />
          <path d="m9.2 12.2 2 2 3.8-4.2" />
        </svg>
      )
    case 'git':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M21.4 10.9 13.1 2.6a1.6 1.6 0 0 0-2.2 0L9.1 4.4l2.2 2.2a1.9 1.9 0 0 1 2.4 2.4l2.1 2.1a1.9 1.9 0 1 1-1.1 1.1l-2-2v5.2a1.9 1.9 0 1 1-1.5 0V9.9a1.9 1.9 0 0 1-1-2.5L8 5.2 2.6 10.6a1.6 1.6 0 0 0 0 2.2l8.3 8.3a1.6 1.6 0 0 0 2.2 0l8.3-8.3a1.6 1.6 0 0 0 0-1.9Z"
            fill="#F05032"
          />
        </svg>
      )
    case 'linux':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FBBF24"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M8.5 9.5C8.5 6.2 10 4 12 4s3.5 2.2 3.5 5.5c0 2.3 1.8 4.2 1.8 6.8 0 1.9-1.2 3.2-2.8 3.2H9.5c-1.6 0-2.8-1.3-2.8-3.2 0-2.6 1.8-4.5 1.8-6.8Z" />
          <path d="M10.5 8.5h.01M13.5 8.5h.01" strokeWidth="2.1" />
          <path d="M10.5 11.2 12 12.4l1.5-1.2" />
          <path d="M7.8 19.5h2.4M13.8 19.5h2.4" />
        </svg>
      )
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M8.5 3h3.5v6H8.5a3 3 0 0 1 0-6Z" fill="#F24E1E" />
          <path d="M12 3h3.5a3 3 0 0 1 0 6H12V3Z" fill="#FF7262" />
          <path d="M8.5 9H12v6H8.5a3 3 0 0 1 0-6Z" fill="#A259FF" />
          <path d="M12 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" fill="#1ABCFE" />
          <path d="M8.5 15H12v3a3 3 0 0 1-3.5 0Z" fill="#0ACF83" />
        </svg>
      )
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="6.2" y="7" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="9.4" y="7" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="12.6" y="7" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="9.4" y="4" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="3" y="10" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="6.2" y="10" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="9.4" y="10" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <rect x="12.6" y="10" width="2.6" height="2.4" rx="0.4" fill="#2496ED" />
          <path
            d="M2.2 13.8h15.2c1.2 0 2.3-.5 3.1-1.3.7.7.9 1.8.4 2.8-1 2.2-3.5 4.2-8.4 4.2-5.6 0-9.7-2.2-10.3-5.7Z"
            fill="#2496ED"
          />
        </svg>
      )
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <path d="m8 10 2.5 2L8 14M13 14h3" />
        </svg>
      )
  }
}
