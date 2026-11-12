import { Suspense, lazy, useState } from 'react'
import { capabilities, experience, profile, projects, screens, fullName, initials, siteHost } from '../content.js'
import { useInView, useLocalTime } from '../lib/hooks.js'
import { ContactActions } from './ContactActions.jsx'
import { SceneBoundary, hasWebGL } from './SceneBoundary.jsx'
import { Rotate } from './Icons.jsx'
import { CountUp, Marquee, SplitText, container } from './ui.jsx'

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

/** Slow orbit rings and a breathing accent glow behind the card. */
function StageBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
      <span className="glow absolute aspect-square w-[62%] rounded-full bg-accent blur-[90px]" />
      <svg viewBox="0 0 400 400" className="h-[112%] max-w-none text-muted/35" fill="none" stroke="currentColor">
        <circle className="orbit" cx="200" cy="200" r="196" strokeWidth="0.6" strokeDasharray="2 9" />
        <circle className="orbit orbit-reverse" cx="200" cy="200" r="150" strokeWidth="0.6" strokeDasharray="1 14" />
        <g className="orbit">
          <circle cx="200" cy="200" r="112" strokeWidth="0.5" strokeDasharray="28 10" />
          <circle cx="312" cy="200" r="3.2" fill="var(--accent)" stroke="none" />
        </g>
        <path d="M200 0v400M0 200h400" strokeWidth="0.4" strokeDasharray="1 7" />
      </svg>
    </div>
  )
}

/** Small spec sheet under the intro: where, when, what, with what. */
function HeroDetails() {
  const time = useLocalTime(profile.timeZone)
  const current = experience[0]
  const rows = [
    ['Based in', <>{profile.location}{time && <span className="text-muted"> · {time}</span>}</>],
    current && ['Currently', <>{current.role}<span className="block text-[13px] font-normal text-muted">{current.company}</span></>],
    ['Focus', capabilities.slice(0, 3).map((c) => c.title).join(' · ')],
    profile.availability?.open && ['Status', profile.availability.long],
  ].filter(Boolean)
  return (
    <dl className="rise mt-9 grid max-w-[34rem] grid-cols-1 border-b border-line sm:grid-cols-2 sm:gap-x-8 lg:mt-12" style={{ animationDelay: '520ms' }}>
      {rows.map(([label, value]) => (
        <div key={label} className="border-t border-line py-3.5">
          <dt className="font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">{label}</dt>
          <dd className="mt-1 text-[14.5px] leading-snug font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const tools = [...new Set([...capabilities.flatMap((c) => c.tools), ...projects.flatMap((p) => p.tags ?? [])])].filter(
  (t) => t !== 'Freelance',
)
const systems = new Set(screens.map((s) => s.title)).size

/** Counters, a tools ticker and a scroll cue that close out the first screen. */
function HeroFooter() {
  const stats = [
    [projects.length, 'Projects shipped'],
    [systems, 'Systems in screenshots'],
    [capabilities.length, 'Areas of practice'],
    [tools.length, 'Tools in daily use'],
  ].filter(([n]) => n > 0)
  return (
    <div className="fade-in mt-14 lg:mt-6" style={{ animationDelay: '700ms' }}>
      <div className="flex items-end justify-between gap-6 border-t border-line pt-5">
        <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {stats.map(([n, label]) => (
            <li key={label}>
              <span className="block text-[clamp(2.2rem,5vw,3.6rem)] leading-none font-semibold tracking-[-0.04em]">
                <CountUp value={n} />
              </span>
              <span className="mt-2 block font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">{label}</span>
            </li>
          ))}
        </ul>
        <a
          href="#work"
          className="hidden shrink-0 flex-col items-center gap-3 font-mono text-[10.5px] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink lg:flex"
        >
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <span aria-hidden className="relative block h-12 w-px bg-line">
            <span className="scroll-cue absolute inset-0 bg-accent" />
          </span>
        </a>
      </div>
      <Marquee
        items={tools}
        duration={48}
        className="mt-8 border-y border-line py-3.5 font-mono text-[12px] tracking-[0.12em] text-muted uppercase"
      />
    </div>
  )
}

/** Rotating sticker pinned to the corner of the card stage. */
function Badge() {
  const text = `${profile.availability?.open ? profile.availability.long : profile.shortRole} ✦ ${profile.location} ✦ `
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-3 left-1 z-10 grid size-[5.5rem] place-items-center rounded-full bg-accent text-on-accent shadow-[0_14px_30px_-14px_rgba(25,27,34,0.6)] sm:size-28 lg:left-4 lg:size-32"
    >
      <svg viewBox="0 0 100 100" className="spin absolute inset-0 size-full">
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-current font-mono text-[8.6px] tracking-[0.14em] uppercase">
          <textPath href="#badge-circle" textLength="228">
            {text}
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 24 24" className="size-[34%]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
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
        <StageBackdrop />
        <CropMarks />
        <Badge />
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
      className={`${container} pb-16 lg:pb-20`}
    >
      <div className="grid grid-cols-1 gap-y-7 lg:min-h-[calc(100svh-300px)] lg:grid-cols-12 lg:items-center lg:gap-x-10">
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
          <span className="block font-bold">
            <SplitText text={profile.firstName} delay={120} />
          </span>
          <span className="block font-light">
            <SplitText text={profile.lastName} delay={420} />
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
        <HeroDetails />
      </div>
      </div>
      <HeroFooter />
    </section>
  )
}
