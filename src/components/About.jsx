import { profile, capabilities, experience, education, hasScreens, projects } from '../content.js'
import { Reveal, ScrollWords, SectionHeading, container } from './ui.jsx'

const pad = (n) => String(n).padStart(2, '0')

const glyphs = [
  <path key="a" d="m8 8-4 4 4 4m8-8 4 4-4 4M13.5 5l-3 14" />,
  <path key="b" d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5" />,
  <path key="c" d="M4 5h16v6H4zM4 13h16v6H4zM7.5 8h.01M7.5 16h.01M12 8h5M12 16h5" />,
  <path key="d" d="M12 3v4m0 10v4M3 12h4m10 0h4M6.3 6.3l2.5 2.5m6.4 6.4 2.5 2.5m0-11.4-2.5 2.5m-6.4 6.4-2.5 2.5" />,
]

const stages = [
  ['Commit', 'Push to main'],
  ['Build', 'GitHub Actions'],
  ['Test', 'Lint and test suite'],
  ['Deploy', 'Self-hosted runner, Nginx'],
  ['Monitor', 'Grafana and alerts'],
]

const toolbox = capabilities.map((c) => ({ group: c.title, tools: c.tools }))
const extras = [...new Set(projects.flatMap((p) => p.tags ?? []))].filter(
  (t) => t !== 'Freelance' && !capabilities.some((c) => c.tools.includes(t)),
)
if (extras.length) toolbox.push({ group: 'Also in the mix', tools: extras })

/** Every tool named on the page, as a grid of tiles grouped by area. */
function Toolbox() {
  let n = 0
  return (
    <div className="mt-20 lg:mt-28">
      <Reveal className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">Toolbox</h3>
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
          {toolbox.reduce((sum, g) => sum + g.tools.length, 0)} tools
        </span>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-9 border-t border-line pt-8 lg:grid-cols-2">
        {toolbox.map((g) => (
          <div key={g.group}>
            <Reveal as="p" className="mb-3 text-[15px] font-semibold tracking-[-0.01em]">
              {g.group}
            </Reveal>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {g.tools.map((tool, i) => (
                <Reveal as="li" key={tool} delay={i * 60}>
                  <div className="group flex h-[5.25rem] flex-col justify-between rounded-xl border border-line p-3 transition-[background-color,border-color,color,translate] duration-300 ease-out-expo hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-bg">
                    <span className="font-mono text-[10.5px] text-accent-text transition-colors group-hover:text-accent">
                      {pad(++n)}
                    </span>
                    <span className="text-[14px] leading-tight font-semibold tracking-[-0.01em]">{tool}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/** The path a change takes to production, with a dot running the line. */
function Pipeline() {
  return (
    <Reveal className="mt-16 rounded-2xl border border-line bg-surface/60 px-5 py-7 sm:px-8 sm:py-9 lg:mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">How a change ships</h3>
        <span className="hidden font-mono text-[11px] tracking-[0.1em] text-accent-text uppercase sm:block">One click, start to finish</span>
      </div>
      <ol className="relative mt-9 grid grid-cols-5">
        <span aria-hidden className="absolute top-[7px] right-[10%] left-[10%] h-px bg-ink/30">
          <span className="pipe-dot absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_22%,transparent)]" />
        </span>
        {stages.map(([name, note], i) => (
          <li key={name} className="relative flex flex-col items-center text-center">
            <span
              aria-hidden
              className="pipe-node size-[15px] rounded-full border-[1.5px] border-ink bg-bg"
              style={{ animationDelay: `${(i * 7) / 4}s` }}
            />
            <span className="mt-4 text-[clamp(0.8rem,2.4vw,1.25rem)] leading-tight font-semibold tracking-[-0.02em]">{name}</span>
            <span className="mt-1.5 hidden max-w-[16ch] font-mono text-[10.5px] leading-snug tracking-[0.04em] text-muted sm:block">
              {note}
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

function Timeline({ title, items, className = '' }) {
  return (
    <div className={className}>
      <Reveal as="h3" className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
        {title}
      </Reveal>
      <ol className="mt-6 border-b border-line">
        {items.map((e, i) => (
          <Reveal
            as="li"
            key={e.period + e.role}
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
  )
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={`${container} scroll-mt-24 py-16 lg:py-28`}>
      <SectionHeading id="about-title" index={hasScreens ? '03' : '02'} title="About" />

      <ScrollWords
        text={profile.statement}
        className="mt-10 max-w-[24ch] text-[clamp(1.75rem,4.6vw,3.6rem)] leading-[1.06] font-medium tracking-[-0.03em] text-balance lg:mt-16"
      />

      <Pipeline />

      <div className="mt-16 grid grid-cols-1 gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal as="h3" className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">
            What I do
          </Reveal>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
            {capabilities.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 2) * 80} className="group border-t border-line py-6 sm:py-7">
                <span
                  aria-hidden
                  className="mb-5 grid size-12 place-items-center rounded-full border border-line transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo group-hover:-rotate-12 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {glyphs[i % glyphs.length]}
                  </svg>
                </span>
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
          <Timeline title="Experience" items={experience} />
          {education?.length > 0 && <Timeline title="Education" items={education} className="mt-14" />}
        </div>
      </div>

      <Toolbox />
    </section>
  )
}
