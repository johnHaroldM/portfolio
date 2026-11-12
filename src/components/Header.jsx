import { useEffect, useState } from 'react'
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

/** The nav link whose section currently crosses the middle of the screen. */
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return active
}

export function Header() {
  const active = useActiveSection()
  return (
    <header className="fade-in sticky top-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className={`${container} flex items-center justify-between gap-4 py-3.5 lg:py-4`}>
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
            data-active={active === l.href || undefined}
            className="relative py-1 font-mono data-[active]:text-ink data-[active]:after:scale-x-100 text-[12px] uppercase tracking-[0.14em] text-muted transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-500 after:ease-out-expo after:content-[''] hover:text-ink hover:after:scale-x-100"
          >
            {l.label}
          </a>
        ))}
      </nav>

      <Availability />
      </div>
    </header>
  )
}
