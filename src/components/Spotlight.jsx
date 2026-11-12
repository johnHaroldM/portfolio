import { projects } from '../content.js'
import { ArrowRight } from './Icons.jsx'
import { Reveal } from './ui.jsx'

/** Featured project: an ink card with its screenshots fanned out, tilting toward the pointer. */
export function Spotlight() {
  const project = projects.find((p) => (p.screens?.length ?? 0) >= 2)
  if (!project) return null
  const shots = project.screens.slice(0, 3).map((e) => (typeof e === 'string' ? e : e.src))

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -9}deg`)
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`)
  }
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
  }

  const frame = 'absolute overflow-hidden rounded-[10px] bg-bg shadow-[0_30px_60px_-28px_rgba(0,0,0,0.75)] ring-1 ring-black/10'

  return (
    <Reveal className="mt-10 lg:mt-16">
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative grid overflow-hidden rounded-[28px] bg-ink text-bg lg:grid-cols-12"
      >
        <span
          aria-hidden
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--bg)_1px,transparent_1px),linear-gradient(90deg,var(--bg)_1px,transparent_1px)] [background-size:44px_44px]"
        />
        <div className="relative flex flex-col justify-between gap-10 p-7 sm:p-10 lg:col-span-5 lg:p-12">
          <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] uppercase opacity-70">
            <span className="size-2 rounded-full bg-accent" />
            Latest build · {project.year}
          </p>
          <div>
            <h3 className="text-[clamp(2.2rem,5.4vw,4rem)] leading-[0.93] font-bold tracking-[-0.04em]">{project.title}</h3>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-pretty opacity-70">{project.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tags">
              {project.tags?.map((t) => (
                <li key={t} className="rounded-full border border-bg/25 px-2.5 py-1 font-mono text-[11px]">
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#screens"
              className="group/cta mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-accent pr-2 pl-5 text-[15px] font-semibold text-on-accent transition-transform duration-300 ease-out-expo active:scale-[0.97]"
            >
              See the screens
              <span className="grid size-8 place-items-center rounded-full bg-on-accent text-accent">
                <ArrowRight width={16} height={16} className="transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-0.5" />
              </span>
            </a>
          </div>
        </div>

        <div aria-hidden className="relative min-h-[250px] [perspective:1400px] sm:min-h-[380px] lg:col-span-7 lg:min-h-[520px]">
          <div className="absolute inset-0 transition-transform duration-700 ease-out-expo [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
            {shots[2] && (
              <img src={shots[2]} alt="" loading="lazy" className={`${frame} top-[6%] right-[-7%] w-[58%] rotate-6 opacity-70 [transform:translateZ(-40px)_rotate(6deg)]`} />
            )}
            {shots[1] && (
              <img src={shots[1]} alt="" loading="lazy" className={`${frame} bottom-[-9%] left-[-3%] w-[52%] opacity-80 [transform:translateZ(-10px)_rotate(-7deg)]`} />
            )}
            <img src={shots[0]} alt="" loading="lazy" className={`${frame} top-[16%] left-[13%] w-[76%] [transform:translateZ(50px)]`} />
          </div>
        </div>
      </div>
    </Reveal>
  )
}
