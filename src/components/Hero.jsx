import { Suspense, lazy, useState } from 'react'
import { profile, fullName, initials, siteHost } from '../content.js'
import { useInView } from '../lib/hooks.js'
import { ContactActions } from './ContactActions.jsx'
import { SceneBoundary, hasWebGL } from './SceneBoundary.jsx'
import { Rotate } from './Icons.jsx'
import { container } from './ui.jsx'

// Three.js is loaded only after the text is on screen, so the page is
// readable instantly on a phone that just scanned the card.
const CardScene = lazy(() => import('../three/CardScene.jsx'))

/** Plain-CSS stand-in shown while the 3D card loads (or if WebGL is off). */
function FlatCard({ hidden }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700 ease-out-expo ${hidden ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative flex aspect-[7/4] w-[min(76%,560px)] flex-col justify-between rounded-[3.5%/6%] bg-[#fbf9f4] p-[5.5%] text-[#191b22] shadow-[0_30px_60px_-30px_rgba(25,27,34,0.45)] ring-1 ring-black/5">
        <div className="flex items-center justify-between font-mono text-[clamp(7px,1.6vw,11px)] tracking-[0.1em]">
          <span className="flex shrink-0 items-center gap-2">
            <span className="size-[0.9em] rounded-full bg-[#ea5a3c]" />
            PORTFOLIO
          </span>
          <span className="ml-3 min-w-0 truncate">{siteHost}</span>
        </div>
        <div>
          <p className="text-[clamp(20px,6vw,46px)] leading-none font-bold tracking-[-0.035em]">{fullName}</p>
          <p className="mt-[0.6em] font-mono text-[clamp(7px,1.5vw,11px)] tracking-[0.1em] text-[#5c5f6b] uppercase">
            {profile.shortRole}
          </p>
        </div>
      </div>
    </div>
  )
}

/** Printer's crop marks around the stage — a nod to the physical card. */
function CropMarks() {
  const mark = 'absolute size-4 border-muted/40'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className={`${mark} top-0 left-0 border-t border-l`} />
      <span className={`${mark} top-0 right-0 border-t border-r`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} right-0 bottom-0 border-r border-b`} />
      <span className="absolute top-3 left-6 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:text-[11px]">
        Fig. 01 — Calling card
      </span>
      <span className="absolute right-6 bottom-3 font-mono text-[10px] tracking-[0.14em] text-muted uppercase sm:text-[11px]">
        3.5 × 2 in
      </span>
    </div>
  )
}

function CardStage() {
  const [webgl] = useState(hasWebGL)
  const [ready, setReady] = useState(false)
  const [flipSignal, setFlipSignal] = useState(0)
  const [stageRef, onScreen] = useInView()

  return (
    <div className="fade-in" style={{ animationDelay: '150ms' }}>
      <div
        ref={stageRef}
        className="relative h-[clamp(260px,44svh,420px)] w-full sm:h-[clamp(320px,52svh,520px)] lg:h-[clamp(420px,70svh,700px)]"
      >
        <CropMarks />
        <FlatCard hidden={ready} />
        {webgl && (
          <SceneBoundary>
            <Suspense fallback={null}>
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-out-expo ${ready ? 'opacity-100' : 'opacity-0'}`}
              >
                <CardScene flipSignal={flipSignal} active={onScreen} onReady={() => setReady(true)} />
              </div>
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setFlipSignal((n) => n + 1)}
          aria-label="Flip the card over"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase transition-colors hover:text-ink"
        >
          <Rotate width={14} height={14} />
          <span className="[@media(hover:hover)]:hidden">Tap or drag the card</span>
          <span className="hidden [@media(hover:hover)]:inline">Click or drag the card</span>
        </button>
      </div>
    </div>
  )
}

export function Hero() {
  const year = new Date().getFullYear()
  return (
    <section
      id="top"
      aria-label="Introduction"
      className={`${container} grid grid-cols-1 gap-y-7 pb-20 lg:min-h-[calc(100svh-96px)] lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:pb-24`}
    >
      <div className="lg:order-2 lg:col-span-6 xl:col-span-7">
        <CardStage />
      </div>

      <div className="lg:order-1 lg:col-span-6 xl:col-span-5">
        <p
          className="rise mb-5 hidden font-mono text-[12px] tracking-[0.14em] text-muted uppercase lg:block"
          style={{ animationDelay: '60ms' }}
        >
          Portfolio — {year} · {initials}
        </p>
        <h1 className="text-[clamp(3.4rem,15vw,6rem)] leading-[0.86] tracking-[-0.045em] [overflow-wrap:anywhere] lg:text-[clamp(5rem,8.4vw,9rem)]">
          <span className="rise block font-bold" style={{ animationDelay: '120ms' }}>
            {profile.firstName}
          </span>
          <span className="rise block font-light" style={{ animationDelay: '200ms' }}>
            {profile.lastName}
          </span>
        </h1>
        <p
          className="rise mt-6 max-w-[34ch] text-[clamp(1.05rem,2.6vw,1.3rem)] leading-snug text-pretty text-muted lg:mt-8"
          style={{ animationDelay: '280ms' }}
        >
          <span className="font-medium text-ink">{profile.role}.</span> {profile.intro}
        </p>
        <div className="rise mt-7 lg:mt-10" style={{ animationDelay: '360ms' }}>
          <ContactActions id="hero-actions" />
        </div>
      </div>
    </section>
  )
}
