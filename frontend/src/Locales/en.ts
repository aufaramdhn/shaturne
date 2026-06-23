import type { id } from './id'

// English UI dictionary. Shape mirrors id.ts (enforced by the type below).

export const en: typeof id = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    headlineA: 'Interfaces that are clean,',
    headlineHi: 'well-documented',
    headlineB: 'and a joy to use.',
    ctaProjects: 'View Projects',
    ctaContact: 'Get in Touch',
    statYears: 'Years',
    statProjects: 'Projects',
    statDisciplines: 'Disciplines',
  },
  about: {
    eyebrow: 'About',
    title: 'Across disciplines, one habit: documenting.',
    p1: 'I build web interfaces with React and TypeScript, and treat documentation as part of the product — not an afterthought.',
    p2: 'The habit carries over from cross-field work: penetration test reports with risk heatmaps, game design documents, even IoT lab write-ups. The subject changes, but the method stays the same — written down neatly so others can rely on it.',
  },
  skills: {
    eyebrow: 'Skills',
    title: 'The tools I reach for every day.',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Two years across organizations.',
    present: 'Present',
  },
  projectsPreview: {
    eyebrow: 'Projects',
    title: 'The latest.',
    subtitle: 'A few recent works.',
    seeAll: 'See all projects',
  },
  closing: {
    title: 'Have a project or a question?',
    subtitle: 'I am open to collaboration and technical discussion.',
    cta: 'Get in Touch',
  },
  projectsPage: {
    entries: '{count} entries',
    title: 'Projects',
    intro: 'A collection of cross-disciplinary work — each with its own notes.',
  },
  projectDetail: {
    back: 'Projects',
    stack: 'Stack',
    repo: 'View Repo',
    demo: 'Open Demo',
    notFoundTitle: 'Project not found',
    backList: 'Back to project list',
  },
  status: {
    rilis: 'released',
    dikerjakan: 'in progress',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's talk.",
    intro: 'Have a project, a question, or just want to say hi? Send a message through this form.',
    direct: 'Direct',
    reply: 'Usually replies within 1–2 days.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'name@email.com',
    messagePlaceholder: 'Write your message…',
    send: 'Send Message',
    sending: 'Sending…',
    successTitle: 'Message sent.',
    successBody: 'Thanks for reaching out. A reply will be sent to your email.',
    sendAnother: 'Send another message',
    errNameReq: 'Name is required.',
    errEmailReq: 'Email is required.',
    errEmailInvalid: 'Invalid email format.',
    errMsgReq: 'Message is required.',
    errMsgMin: 'Message must be at least 10 characters.',
    errSend: 'Failed to send. Please try again.',
  },
  notFound: {
    title: 'Page not found.',
    body: 'The link may be wrong or the page has moved. This note is not in the archive.',
    home: 'Back to Home',
  },
  spotify: {
    playing: 'Now playing',
    idle: 'Spotify',
    online: 'online',
    offline: 'offline',
    offlineTitle: 'Currently offline',
    offlineBody: 'Not listening to anything right now — check back later.',
  },
  footer: {
    tagline: 'Tidy working notes — built with React & Laravel.',
  },
  seo: {
    homeTitle: 'Shaturne — Naufa Ramadhana, Fullstack Developer',
    homeDesc:
      'Portfolio of Naufa Ramadhana — a fullstack developer building clean, well-documented interfaces with React, TypeScript, and Laravel.',
    projectsTitle: 'Projects — Shaturne',
    projectsDesc:
      'A collection of cross-disciplinary work by Naufa Ramadhana — each with its own notes.',
    contactTitle: 'Contact — Shaturne',
    contactDesc:
      'Get in touch with Naufa Ramadhana for collaboration, questions, or technical discussion on web development.',
    notFoundTitle: '404 — Page not found — Shaturne',
    projectTitleTpl: '{title} — Projects — Shaturne',
    jobTitle: 'Fullstack Developer',
  },
}
