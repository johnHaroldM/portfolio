import { useEffect, useState } from 'react'
import { profile, fullName } from '../content.js'
import { copyText, useFlash } from '../lib/hooks.js'
import { downloadVCard } from '../lib/vcard.js'
import { telHref } from './ContactActions.jsx'
import { ArrowRight, ArrowUp, Check, ContactAdd, Copy, Share } from './Icons.jsx'
import { Reveal, container } from './ui.jsx'

function useLocalTime(timeZone) {
  const format = () => {
    try {
      return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone }).format(new Date())
    } catch {
      return null
    }
  }
  const [time, setTime] = useState(() => (timeZone ? format() : null))
  useEffect(() => {
    if (!timeZone) return
    const id = setInterval(() => setTime(format()), 30_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone])
  return time
}

const chip =
  'inline-flex h-11 items-center gap-2 rounded-full border border-on-accent/30 px-4 text-[14px] font-medium transition-[background-color,border-color,color,transform] duration-300 ease-out-expo hover:border-on-accent hover:bg-on-accent hover:text-accent active:scale-[0.97]'

export function Contact() {
  const [copied, flashCopied] = useFlash()
  const [shared, flashShared] = useFlash()
  const time = useLocalTime(profile.timeZone)
  const year = new Date().getFullYear()

  const onCopy = async () => {
    if (await copyText(profile.email)) flashCopied()
  }

  const onShare = async () => {
    const url = window.location.href.split('#')[0]
    if (navigator.share) {
      try {
        await navigator.share({ title: fullName, text: `${fullName} — ${profile.role}`, url })
      } catch {
        /* dismissed */
      }
    } else if (await copyText(url)) {
      flashShared()
    }
  }

  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-accent text-on-accent selection:bg-on-accent selection:text-accent"
    >
      <div className={`${container} pt-16 pb-8 lg:pt-28`}>
        <Reveal as="p" className="font-mono text-[12px] tracking-[0.14em] uppercase opacity-80">
          (03) Contact
        </Reveal>

        <Reveal
          as="h2"
          id="contact-title"
          className="mt-6 text-[clamp(3.2rem,14vw,10.5rem)] leading-[0.84] font-bold tracking-[-0.05em]"
        >
          Let’s make
          <br />
          <span className="font-light">something good.</span>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 text-[clamp(1.5rem,5.2vw,3rem)] leading-tight font-medium tracking-[-0.025em] [overflow-wrap:anywhere]"
            >
              <span className="underline decoration-2 underline-offset-[0.18em] transition-[text-decoration-thickness] group-hover:decoration-[3px]">
                {profile.email}
              </span>
              <ArrowRight className="hidden size-[0.8em] shrink-0 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0 sm:block" />
            </a>
            <a href={telHref} className="mt-3 block text-[clamp(1.1rem,3vw,1.5rem)] font-medium opacity-85 hover:opacity-100">
              {profile.phone}
            </a>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <button type="button" onClick={onCopy} className={chip}>
                {copied ? <Check width={18} height={18} /> : <Copy width={18} height={18} />}
                <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
              </button>
              <button type="button" onClick={downloadVCard} className={chip}>
                <ContactAdd width={18} height={18} />
                Save contact
              </button>
              <button type="button" onClick={onShare} className={chip}>
                {shared ? <Check width={18} height={18} /> : <Share width={18} height={18} />}
                <span aria-live="polite">{shared ? 'Link copied' : 'Share'}</span>
              </button>
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-4 lg:col-start-9">
            <h3 className="font-mono text-[12px] tracking-[0.14em] uppercase opacity-80">Elsewhere</h3>
            <ul className="mt-5 border-b border-on-accent/25">
              {profile.socials.map((s) => (
                <li key={s.label} className="border-t border-on-accent/25">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="text-[1.15rem] font-semibold tracking-[-0.01em]">{s.label}</span>
                    <span className="flex items-center gap-2 font-mono text-[12px] opacity-80 group-hover:opacity-100">
                      {s.handle}
                      <ArrowRight
                        width={16}
                        height={16}
                        className="-rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-on-accent/25 pt-6 font-mono text-[11px] tracking-[0.08em] uppercase sm:flex-row sm:items-center sm:justify-between lg:mt-28">
          <span>
            © {year} {fullName}
          </span>
          <span className="opacity-80">
            {profile.location}
            {time && <> · {time} local time</>}
          </span>
          <a href="#top" className="inline-flex items-center gap-2 hover:underline">
            Back to top <ArrowUp width={14} height={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
