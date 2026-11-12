import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { screens } from '../content.js'
import { useInView } from '../lib/hooks.js'
import { ChevronLeft, ChevronRight, Close, Expand } from './Icons.jsx'
import { SceneBoundary, hasWebGL } from './SceneBoundary.jsx'
import { Reveal, SectionHeading, container } from './ui.jsx'

// Three.js loads only when this section is near the screen.
const ScreensScene = lazy(() => import('../three/ScreensScene.jsx'))

const pad = (n) => String(n).padStart(2, '0')
const roundBtn =
  'grid size-11 shrink-0 place-items-center rounded-full border border-line transition-[background-color,border-color,color,transform] duration-300 ease-out-expo hover:border-ink hover:bg-ink hover:text-bg active:scale-[0.95]'

/** Plain browser-window preview: shown while 3D loads, and instead of it without WebGL. */
function FlatPreview({ slide, hidden, onOpen }) {
  return (
    <div
      className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ease-out-expo ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <button
        type="button"
        onClick={onOpen}
        tabIndex={hidden ? -1 : 0}
        aria-label={`Enlarge: ${slide.alt}`}
        className="flex aspect-[1600/1067] h-[84%] max-w-[92%] flex-col overflow-hidden rounded-[10px] bg-[#fbf9f4] text-left shadow-[0_30px_60px_-30px_rgba(25,27,34,0.5)] ring-1 ring-black/5"
      >
        <span aria-hidden className="flex h-7 shrink-0 items-center gap-1.5 border-b border-[#dcd4c6] bg-[#ece6db] px-3">
          <span className="size-2 rounded-full bg-[#ea5a3c]" />
          <span className="size-2 rounded-full bg-[#d3cabb]" />
          <span className="size-2 rounded-full bg-[#d3cabb]" />
        </span>
        <img src={slide.src} alt="" className="min-h-0 w-full flex-1 object-cover object-top" />
      </button>
    </div>
  )
}

function Lightbox({ open, slide, index, count, onClose, onPrev, onNext }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const closeOnBackdrop = (e) => e.target === e.currentTarget && onClose()
  const btn =
    'grid size-11 place-items-center rounded-full border border-white/25 text-[#f2eee6] transition-colors hover:bg-white hover:text-[#191b22]'

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={closeOnBackdrop}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onPrev()
        if (e.key === 'ArrowRight') onNext()
      }}
      aria-label={slide.alt}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[#121318]/92 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full flex-col p-4 sm:p-8" onClick={closeOnBackdrop}>
        <div className="flex items-center justify-between gap-4 text-[#f2eee6]">
          <div className="min-w-0">
            <p className="font-mono text-[12px] opacity-70">
              {pad(index + 1)} / {pad(count)}
            </p>
            <p className="truncate text-[1.2rem] font-semibold tracking-[-0.02em]">
              {slide.title}
              {slide.caption && <span className="font-normal opacity-70"> — {slide.caption}</span>}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className={btn} autoFocus>
            <Close />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center py-4" onClick={closeOnBackdrop}>
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="max-h-full max-w-full rounded-lg object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
          />
        </div>
        {count > 1 && (
          <div className="flex justify-center gap-2">
            <button type="button" onClick={onPrev} aria-label="Previous screenshot" className={btn}>
              <ChevronLeft />
            </button>
            <button type="button" onClick={onNext} aria-label="Next screenshot" className={btn}>
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}

function ScreensSection() {
  const count = screens.length
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [webgl] = useState(hasWebGL)
  const [stageRef, onScreen] = useInView({ rootMargin: '300px 0px' })
  const [load, setLoad] = useState(false)
  const systems = new Set(screens.map((s) => s.title)).size

  useEffect(() => {
    if (onScreen) setLoad(true)
  }, [onScreen])

  const go = useCallback((i) => setActive(((i % count) + count) % count), [count])
  const slide = screens[active]

  return (
    <section id="screens" aria-labelledby="screens-title" className={`${container} scroll-mt-6 py-16 lg:py-28`}>
      <SectionHeading
        id="screens-title"
        index="02"
        title="Screens"
        meta={`${count} screen${count === 1 ? '' : 's'} · ${systems} system${systems === 1 ? '' : 's'}`}
      />

      <Reveal className="mt-8 lg:mt-12">
        <div
          ref={stageRef}
          className="relative h-[clamp(230px,34svh,340px)] w-full sm:h-[clamp(320px,50svh,520px)] lg:h-[clamp(400px,60svh,620px)]"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(active - 1)
            if (e.key === 'ArrowRight') go(active + 1)
          }}
        >
          <FlatPreview slide={slide} hidden={ready} onOpen={() => setOpen(true)} />
          {webgl && load && (
            <SceneBoundary>
              <Suspense fallback={null}>
                <div
                  className={`absolute inset-0 [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] transition-opacity duration-700 ease-out-expo ${ready ? 'opacity-100' : 'opacity-0'}`}
                >
                  <ScreensScene
                    slides={screens}
                    active={active}
                    onActive={go}
                    onOpen={(i) => (go(i), setOpen(true))}
                    running={onScreen && !open}
                    onReady={() => setReady(true)}
                  />
                </div>
              </Suspense>
            </SceneBoundary>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div className="min-w-0" aria-live="polite">
            <p className="font-mono text-[12px] text-muted">
              {pad(active + 1)} / {pad(count)}
            </p>
            <p className="mt-1 text-[clamp(1.25rem,3vw,1.6rem)] leading-tight font-semibold tracking-[-0.025em] text-balance">
              {slide.title}
            </p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              {slide.caption || slide.kind}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {count > 1 && (
              <button type="button" onClick={() => go(active - 1)} aria-label="Previous screenshot" className={roundBtn}>
                <ChevronLeft />
              </button>
            )}
            <button type="button" onClick={() => setOpen(true)} aria-label="View full size" className={roundBtn}>
              <Expand width={18} height={18} />
            </button>
            {count > 1 && (
              <button type="button" onClick={() => go(active + 1)} aria-label="Next screenshot" className={roundBtn}>
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </Reveal>

      <Lightbox
        open={open}
        slide={slide}
        index={active}
        count={count}
        onClose={() => setOpen(false)}
        onPrev={() => go(active - 1)}
        onNext={() => go(active + 1)}
      />
    </section>
  )
}

/** Hidden until at least one project lists a screenshot in content.js. */
export function Screens() {
  return screens.length > 0 ? <ScreensSection /> : null
}
