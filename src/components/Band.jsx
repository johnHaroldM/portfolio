import { capabilities } from '../content.js'

const words = capabilities.map((c) => c.title)

function Row({ reverse, offset = 0 }) {
  const list = [...words.slice(offset), ...words.slice(0, offset)]
  const half = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {list.map((w, i) => (
        <li key={w} className="flex items-center whitespace-nowrap">
          <span className={`px-[0.35em] ${(i + offset) % 2 ? 'text-outline' : ''}`}>{w}</span>
          <span aria-hidden className="text-[0.45em] text-accent">
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`marquee marquee-plain ${reverse ? 'marquee-reverse' : ''}`}>
      <div className="marquee-track" style={{ '--marquee-duration': reverse ? '58s' : '46s' }}>
        {half(false)}
        {half(true)}
      </div>
    </div>
  )
}

/** Full-width ink band of oversized, half-outlined words: a loud break between hero and work. */
export function Band() {
  return (
    <div className="overflow-x-clip py-4 sm:py-8">
    <section
      aria-label="What I do"
      className="-rotate-[1.2deg] scale-x-[1.04] overflow-hidden bg-ink py-5 text-[clamp(2.6rem,8.5vw,7rem)] leading-[1.05] font-bold tracking-[-0.045em] text-bg [--stroke:var(--bg)] sm:py-7"
    >
      <Row />
      <div aria-hidden>
        <Row reverse offset={2} />
      </div>
    </section>
    </div>
  )
}
