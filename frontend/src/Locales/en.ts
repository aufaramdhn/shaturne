import type { id } from './id'

// English UI dictionary. Shape mirrors id.ts (enforced by the type below).

export const en: typeof id = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    headlineA: "I'm",
    headlineHi: 'Aufa Ramadhan',
    headlineB: ', fullstack web developer.',
    ctaProjects: 'View Projects',
    ctaContact: 'Get in Touch',
    statYears: 'Years',
    statProjects: 'Projects',
    statDisciplines: 'Disciplines',
  },
  about: {
    eyebrow: 'About',
    title: 'Clean frontend, solid backend.',
    p1: 'I build end-to-end web applications with React, TypeScript, and Laravel: from responsive interfaces to well-documented REST APIs.',
    p2: "I'm also familiar with web application security: OWASP Top 10 penetration testing, authentication management, and secure development practices on both backend and frontend.",
  },
  skills: {
    eyebrow: 'Skills',
    title: 'The tools I reach for every day.',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Two years building on the web.',
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
    entries: '{count} projects',
    title: 'Projects',
    intro: 'Web applications and tools I have worked on.',
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
    reply: 'Usually replies within 1 to 2 days.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'name@email.com',
    messagePlaceholder: 'Write your message…',
    send: 'Send Message',
    sending: 'Sending…',
    cooldownBtn: 'Wait {time}',
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
    body: 'The link may be wrong or the page has moved.',
    home: 'Back to Home',
  },
  spotify: {
    playing: 'Now playing',
    idle: 'Spotify',
    online: 'online',
    offline: 'offline',
    offlineTitle: 'Currently offline',
    offlineBody: 'Not listening to anything right now, check back later.',
  },
  footer: {
    tagline: 'Built with React and Laravel.',
  },
  preloader: {
    tagline: 'work portfolio',
  },
  seo: {
    homeTitle: 'Shaturne | Aufa Ramadhan, Fullstack Developer',
    homeDesc:
      'Portfolio of Aufa Ramadhan, a fullstack web developer building end-to-end web applications with React, TypeScript, and Laravel.',
    projectsTitle: 'Projects | Shaturne',
    projectsDesc: 'Web applications and tools built by Aufa Ramadhan.',
    contactTitle: 'Contact | Shaturne',
    contactDesc:
      'Get in touch with Aufa Ramadhan for collaboration, questions, or technical discussion on web development.',
    notFoundTitle: '404 | Page not found | Shaturne',
    projectTitleTpl: '{title} | Projects | Shaturne',
    jobTitle: 'Fullstack Developer',
  },
}
