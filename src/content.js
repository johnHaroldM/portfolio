/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the only place your details live.
 *  The 3D card, the "Save contact" file, the page title and the
 *  QR code are all generated from these values.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: 'John Harold',
  lastName: 'Mito',

  // Long version for the page, short version for the printed/3D card.
  role: 'Full-stack web developer & DevOps',
  shortRole: 'Full-stack Developer',
  company: 'Civil Aviation Authority of the Philippines',

  location: 'Philippines',
  // IANA time zone, used for the "local time" in the footer. Set to null to hide it.
  timeZone: 'Asia/Manila',

  email: 'mitoharold@gmail.com',
  // Optional. Leave empty ('') to hide every "Call" button and the number on the card.
  phone: '',
  // The public address of this site. Used for the QR codes.
  website: 'https://johnharoldm.github.io/portfolio/',

  availability: {
    open: true,
    short: 'Freelance',
    long: 'Open to freelance projects',
  },

  // One sentence under your name in the hero.
  intro:
    'I build and run internal systems for Philippine civil aviation, and take on freelance web projects on the side.',

  // The big "About" statement. Wrap words in *asterisks* to highlight them.
  statement:
    'I build *systems people rely on every day* — then run the *servers, pipelines and monitoring* that keep them up.',

  metaDescription:
    'Portfolio of John Harold Mito, full-stack web developer and DevOps in the Philippines. Laravel, React, CI/CD and server infrastructure.',

  // Shown in "Save contact" as a note.
  vcardNote: 'Portfolio: https://johnharoldm.github.io/portfolio/',

  socials: [
    { label: 'GitHub', handle: '@johnHaroldM', url: 'https://github.com/johnHaroldM' },
    // Add LinkedIn here once you want it on the page:
    // { label: 'LinkedIn', handle: '/in/your-handle', url: 'https://www.linkedin.com/in/your-handle' },
  ],
}

// Newest first — the "Selected work" header reads the year range from the first and last items.
//
// Screenshots: put the image files in public/screens/ and list them under `screens`.
// Each entry is a path, or { src, caption } to add a short caption:
//   screens: ['screens/asad-portal-1.webp', { src: 'screens/asad-portal-2.webp', caption: 'Report form' }]
// The 3D "Screens" section appears automatically once any project has one.
export const projects = [
  {
    title: 'Safety Reporting Portal',
    kind: 'Aviation safety · CAAP',
    year: '2026',
    summary:
      'New version of the ASAD safety reporting portal. Built in Laravel and shipped to two production servers through a one-click GitHub Actions deploy.',
    tags: ['Laravel', 'GitHub Actions', 'Nginx'],
    screens: [],
  },
  {
    title: 'Document Tracking System',
    kind: 'Government workflow · CAAP',
    year: '2026',
    summary:
      'Follows documents as they move between offices and people, all under one searchable reference ID from the office that started it.',
    tags: ['Laravel', 'Livewire'],
    screens: [],
  },
  {
    title: 'CAAP Internal Systems',
    kind: 'Agency apps · CAAP',
    year: '2026',
    summary:
      'Inspectors Management, Dangerous Goods bulk upload, ELP licensing appointments and the DG monthly report upload — built, deployed and maintained end to end.',
    tags: ['Laravel', 'CI/CD', 'Linux'],
    screens: [],
  },
  {
    title: 'SAST-AI-Detection',
    kind: 'Security tooling · Open source',
    year: '2026',
    summary:
      'Triage for static code-analysis findings. A Rubix ML model ranks each one, then two local LLMs — attacker and defender — weigh in. Human review stays the final word.',
    tags: ['Laravel', 'Rubix ML', 'Ollama'],
    screens: [],
    url: 'https://github.com/johnHaroldM/SAST-AI-Detection',
  },
  {
    title: 'Server Monitoring Stack',
    kind: 'Infrastructure',
    year: '2026',
    summary:
      'One place to watch every server: metrics, logs and traces in Grafana, Loki, Tempo and Mimir, fed by OpenTelemetry collectors. Built to catch things like failed SSH logins.',
    tags: ['Grafana', 'OpenTelemetry', 'Docker'],
    screens: [],
  },
  {
    title: 'CAAP Website',
    kind: 'Government website · WordPress',
    year: '2026',
    summary:
      'Production fixes and homepage work on caap.gov.ph, built on the Government Website Template — announcements, news, an area-centre map and services.',
    tags: ['WordPress', 'PHP', 'JavaScript'],
    screens: [],
    url: 'https://caap.gov.ph',
  },
  {
    title: 'Invoice Management System',
    kind: 'Freelance · FlightAxis',
    year: '2025',
    summary: 'A custom invoice management system built for an aviation-sector accounting firm.',
    tags: ['Freelance', 'Laravel', 'MySQL'],
    screens: [],
  },
]

export const capabilities = [
  {
    title: 'Full-stack web apps',
    text: 'Business systems from database to UI — forms, workflows, reports and bulk uploads that hold up in daily use.',
    tools: ['Laravel', 'React', 'MySQL', 'WordPress'],
  },
  {
    title: 'DevOps & CI/CD',
    text: 'Automated deploys with GitHub Actions and self-hosted runners, plus the Nginx, SSL and release scripts behind them.',
    tools: ['GitHub Actions', 'Nginx', 'Bash'],
  },
  {
    title: 'Servers & monitoring',
    text: 'Linux and Windows servers, on-prem and in the cloud, watched by a Grafana observability stack.',
    tools: ['Ubuntu Server', 'Docker', 'Grafana', 'OpenTelemetry'],
  },
  {
    title: 'Applied AI',
    text: 'Local LLMs and ML models wired into real apps — running on our own hardware, so the data stays in-house.',
    tools: ['Ollama', 'Rubix ML', 'Local LLMs'],
  },
]

export const experience = [
  { period: 'Apr 2026 — Now', role: 'Web Developer', company: 'Civil Aviation Authority of the Philippines' },
  { period: '2025 — Now', role: 'Freelance Web Developer', company: 'FlightAxis' },
]

export const education = [
  { period: 'In progress', role: 'Master in Information Technology', company: 'Graduate studies' },
  { period: 'Completed', role: 'BS Information Technology', company: 'Adamson University' },
]

// Derived helpers — no need to edit.
export const screens = projects.flatMap((p) =>
  (p.screens ?? []).map((entry) => {
    const { src, caption = '' } = typeof entry === 'string' ? { src: entry } : entry
    return { src, caption, title: p.title, kind: p.kind, alt: `${p.title} screenshot${caption ? `: ${caption}` : ''}` }
  }),
)
export const hasScreens = screens.length > 0
export const fullName = `${profile.firstName} ${profile.lastName}`.trim()
export const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
export const siteHost = profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
