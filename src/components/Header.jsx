import { profile, fullName, initials, hasScreens } from '../content.js'
import { container } from './ui.jsx'

export function Availability({ className = '' }) {
  const { availability } = profile
  if (!availability?.open) return null
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border border-line px-3 py-1.5 font-mono text-[12px] text-ink ${className}`}
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-accent" />
      </span>
      <span className="sm:hidden">{availability.short}</span>
      <span className="hidden sm:inline">{availability.long}</span>
    </span>
  )
}

const links = [
  { href: '#work', label: 'Work' },
  ...(hasScreens ? [{ href: '#screens', label: 'Screens' }] : []),
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className={`${container} fade-in flex items-center justify-between gap-4 py-5 lg:py-7`}>
      <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label={`${fullName} — back to top`}>
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-mono text-[12px] font-medium text-on-accent transition-transform duration-500 ease-out-expo group-hover:rotate-[-12deg]"
        >
          {initials}
        </span>
        <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">{fullName}</span>
      </a>

      <nav aria-label="Sections" className="hidden items-center gap-9 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <Availability />
    </header>
  )
}
