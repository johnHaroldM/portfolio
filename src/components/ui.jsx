import { useEffect, useRef, useState } from 'react'

/** Fades content up the first time it scrolls into view. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-shown={shown}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function SectionHeading({ index, title, meta, id }) {
  return (
    <Reveal>
      <div className="flex items-end justify-between gap-6">
      <h2
        id={id}
        className="flex items-baseline gap-3 text-[clamp(2.4rem,7vw,5rem)] leading-[0.95] font-semibold tracking-[-0.04em] sm:gap-5"
      >
        <span className="font-mono text-[12px] font-normal tracking-normal text-muted sm:text-[13px]">
          ({index})
        </span>
        {title}
      </h2>
      {meta && (
        <span className="hidden pb-2 font-mono text-[12px] uppercase tracking-[0.12em] text-muted sm:block">
          {meta}
        </span>
      )}
      </div>
      <span aria-hidden className="draw mt-6 block h-px bg-ink/70 lg:mt-8" />
    </Reveal>
  )
}

/**
 * Animates text in one letter at a time. Words stay whole so lines still
 * break between them; screen readers get the plain string.
 */
export function SplitText({ text, delay = 0, step = 32 }) {
  let n = 0
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(' ').map((word, w, words) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch, i) => (
                <span key={i} className="char" style={{ animationDelay: `${delay + n++ * step}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
            {w < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </>
  )
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, duration = 1400, pad = 2 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduced || !('IntersectionObserver' in window)) return
    setShown(0)
    let frame
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        setShown(Math.round(value * (1 - Math.pow(1 - t, 4))))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{value}</span>
      <span aria-hidden>{String(shown).padStart(pad, '0')}</span>
    </span>
  )
}

/** Endless horizontal ticker. Pauses on hover; becomes a plain list with reduced motion. */
export function Marquee({ items, separator = '/', duration = 40, className = '' }) {
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap">
          <span className="px-5">{item}</span>
          <span aria-hidden className="opacity-50">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" style={{ '--marquee-duration': `${duration}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/** Thin accent bar across the top that fills as the page scrolls. */
export function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return <div ref={ref} aria-hidden className="scroll-progress" />
}

/** Renders *asterisk* words as highlighted. */
export function Emphasis({ text, className = 'not-italic text-accent-text' }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className={className}>
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  )
}

export const container = 'mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12'
