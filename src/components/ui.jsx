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
    <Reveal className="flex items-end justify-between gap-6">
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
    </Reveal>
  )
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
