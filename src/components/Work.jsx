import { projects } from '../content.js'
import { ArrowRight } from './Icons.jsx'
import { Reveal, SectionHeading, container } from './ui.jsx'

const pad = (n) => String(n).padStart(2, '0')

function ProjectRow({ project, index }) {
  const Wrapper = project.url ? 'a' : 'div'
  const linkProps = project.url ? { href: project.url, target: '_blank', rel: 'noreferrer' } : {}

  return (
    <Reveal as="li" delay={Math.min(index, 4) * 60} className="border-t border-line">
      <Wrapper
        {...linkProps}
        className="group grid grid-cols-[2rem_1fr_auto] items-start gap-x-3 py-7 sm:grid-cols-[3.5rem_1fr_auto] sm:py-9 lg:grid-cols-[4.5rem_minmax(0,1.15fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-x-8 lg:py-10"
      >
        <span className="col-start-1 row-start-1 pt-[0.55em] font-mono text-[12px] text-muted lg:pt-0">
          {pad(index + 1)}
        </span>

        <div className="col-start-2 row-start-1 min-w-0">
          <h3 className="text-[clamp(1.9rem,5.6vw,3.5rem)] leading-[0.95] font-semibold tracking-[-0.035em] transition-[color,translate] duration-500 ease-out-expo group-hover:translate-x-1.5 group-hover:text-accent-text">
            {project.title}
          </h3>
          <p className="mt-2.5 font-mono text-[11px] tracking-[0.12em] text-muted uppercase sm:text-[12px]">
            {project.kind} <span aria-hidden>·</span> {project.year}
          </p>
        </div>

        <div className="col-span-2 col-start-2 row-start-2 mt-4 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:mt-0">
          <p className="max-w-[46ch] text-[16px] leading-relaxed text-pretty text-muted lg:text-[17px]">
            {project.summary}
          </p>
          {project.tags?.length > 0 && (
            <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Tags">
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {project.url && (
          <span
            aria-hidden
            className="col-start-3 row-start-1 mt-1 grid size-11 place-items-center rounded-full border border-line transition-[background-color,border-color,color] duration-500 ease-out-expo group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent lg:col-start-4 lg:mt-0 lg:size-14"
          >
            <ArrowRight className="-rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" />
          </span>
        )}
      </Wrapper>
    </Reveal>
  )
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className={`${container} scroll-mt-6 py-16 lg:py-28`}>
      <SectionHeading
        id="work-title"
        index="01"
        title="Selected work"
        meta={`${projects.length} projects · ${projects.at(-1)?.year}–${projects[0]?.year}`}
      />
      <ol className="mt-10 border-b border-line lg:mt-16">
        {projects.map((p, i) => (
          <ProjectRow key={p.title} project={p} index={i} />
        ))}
      </ol>
    </section>
  )
}
