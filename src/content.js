/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE — it is the only place your details live.
 *  Everything below is SAMPLE content. Replace it with your own.
 *  The 3D card, the "Save contact" file, the page title and the
 *  QR code are all generated from these values.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: 'Jordan',
  lastName: 'Reyes',

  // Long version for the page, short version for the printed/3D card.
  role: 'Product designer & front-end developer',
  shortRole: 'Designer & Developer',
  company: 'Independent',

  location: 'Lisbon, Portugal',
  // IANA time zone, used for the "local time" in the footer. Set to null to hide it.
  timeZone: 'Europe/Lisbon',

  email: 'hello@example.com',
  phone: '+1 555 0100',
  // The public address of this site once it is online. Used for the QR codes.
  // GitHub Pages: 'https://your-username.github.io/' (repo named your-username.github.io)
  //           or  'https://your-username.github.io/portfolio/' (repo named portfolio)
  website: 'https://johnharoldm.github.io/portfolio/',

  availability: {
    open: true,
    short: 'Available',
    long: 'Taking new projects from Jan 2027',
  },

  // One sentence under your name in the hero.
  intro:
    'I design and build calm, useful software for teams who care about the details. Working worldwide.',

  // The big "About" statement. Wrap words in *asterisks* to highlight them.
  statement:
    'I turn fuzzy ideas into *clear, considered products* — from the first sketch to the *shipped code*, with nothing lost in between.',

  metaDescription:
    'Portfolio of Jordan Reyes, product designer and front-end developer. Selected work, services and contact details.',

  // Shown in "Save contact" as a note.
  vcardNote: 'Met in person — portfolio: https://johnharoldm.github.io/portfolio/',

  socials: [
    { label: 'LinkedIn', handle: '/in/your-handle', url: 'https://www.linkedin.com/in/your-handle' },
    { label: 'GitHub', handle: '@your-handle', url: 'https://github.com/your-handle' },
    { label: 'Instagram', handle: '@your-handle', url: 'https://www.instagram.com/your-handle' },
    { label: 'Dribbble', handle: '@your-handle', url: 'https://dribbble.com/your-handle' },
  ],
}

export const projects = [
  {
    title: 'Tideline',
    kind: 'Mobile banking',
    year: '2026',
    summary:
      'Rebuilt onboarding for a regional bank. Fewer screens, plain language, and a sign-up flow people actually finish.',
    tags: ['Product design', 'iOS', 'Research'],
    url: 'https://example.com/tideline',
  },
  {
    title: 'Northwind Atlas',
    kind: 'Analytics platform',
    year: '2025',
    summary:
      'A dashboard for logistics teams that turns thousands of shipments into three decisions a day.',
    tags: ['Data viz', 'React', 'Design system'],
    url: 'https://example.com/atlas',
  },
  {
    title: 'Field Notes',
    kind: 'Brand & website',
    year: '2025',
    summary:
      'Identity, type system and a WebGL-driven site for an architecture studio that wanted to feel like their buildings.',
    tags: ['Branding', 'Three.js', 'Art direction'],
    url: 'https://example.com/field-notes',
  },
  {
    title: 'Kiln',
    kind: 'Design system',
    year: '2024',
    summary:
      'Tokens, components and documentation shared by four product teams — one source of truth from Figma to code.',
    tags: ['Systems', 'TypeScript', 'Docs'],
    url: 'https://example.com/kiln',
  },
  {
    title: 'Open Pantry',
    kind: 'Non-profit app',
    year: '2023',
    summary:
      'Volunteer scheduling for a food bank network, designed for shared phones and patchy signal.',
    tags: ['Pro bono', 'PWA', 'Accessibility'],
    url: 'https://example.com/open-pantry',
  },
]

export const capabilities = [
  {
    title: 'Product design',
    text: 'Research, flows, interface and prototypes that hold up when real people use them.',
    tools: ['Figma', 'Prototyping', 'User testing'],
  },
  {
    title: 'Front-end engineering',
    text: 'Fast, accessible interfaces in React and TypeScript, built to be maintained.',
    tools: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Brand & identity',
    text: 'Logos, type and colour systems that work as well in print as they do on screen.',
    tools: ['Identity', 'Typography', 'Print'],
  },
  {
    title: 'Creative development',
    text: '3D, motion and interactive moments that make a product memorable, without slowing it down.',
    tools: ['Three.js', 'WebGL', 'Motion'],
  },
]

export const experience = [
  { period: '2024 — Now', role: 'Designer & Developer', company: 'Independent' },
  { period: '2021 — 2024', role: 'Senior Product Designer', company: 'Northwind' },
  { period: '2018 — 2021', role: 'Front-end Developer', company: 'Studio Parallel' },
  { period: '2016 — 2018', role: 'Junior Designer', company: 'Paper Plane Agency' },
]

// Derived helpers — no need to edit.
export const fullName = `${profile.firstName} ${profile.lastName}`.trim()
export const initials = `${profile.firstName[0] ?? ''}${profile.lastName[0] ?? ''}`.toUpperCase()
export const siteHost = profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')
