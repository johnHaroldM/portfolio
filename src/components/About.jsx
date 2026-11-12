import { profile, capabilities, experience } from '../content.js'
import { Emphasis, Reveal, SectionHeading, container } from './ui.jsx'

const pad = (n) => String(n).padStart(2, '0')

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={`${container} scroll-mt-6 py-16 lg:py-28`}>
      <SectionHeading id="about-title" index="02" title="About" />

      <Reveal
        as="p"
        className="mt-10 max-w-[24ch] text-[clamp(1.75rem,4.6vw,3.6rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance lg:mt-16"
      >
        <Emphasis text={profile.statement} />
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal as="h3" className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
            What I do
          </Reveal>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            {capabilities.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 80} className="border-t border-line py-6 sm:py-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent-text">{pad(i + 1)}</span>
                  <h4 className="text-[1.35rem] leading-tight font-semibold tracking-[-0.02em]">{c.title}</h4>
                </div>
                <p className="mt-3 max-w-[40ch] leading-relaxed text-pretty text-muted">{c.text}</p>
                <p className="mt-4 font-mono text-[11px] tracking-[0.06em] text-muted">
                  {c.tools.join('  /  ')}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal as="h3" className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
            Experience
          </Reveal>
          <ol className="mt-6 border-b border-line">
            {experience.map((e, i) => (
              <Reveal
                as="li"
                key={e.period + e.company}
                delay={i * 60}
                className="grid grid-cols-[7.5rem_1fr] gap-4 border-t border-line py-5"
              >
                <span className="pt-0.5 font-mono text-[12px] text-muted">{e.period}</span>
                <span>
                  <span className="block font-semibold tracking-[-0.01em]">{e.role}</span>
                  <span className="block text-muted">{e.company}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
