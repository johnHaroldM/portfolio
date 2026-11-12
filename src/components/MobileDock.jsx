import { useEffect, useState } from 'react'
import { profile } from '../content.js'
import { downloadVCard } from '../lib/vcard.js'
import { telHref } from './ContactActions.jsx'
import { ContactAdd, Mail, Phone } from './Icons.jsx'

/**
 * Phone-only action bar. Appears once the hero buttons scroll away and
 * hides again over the contact section, so "Save contact" is always
 * one thumb-tap away for someone who just scanned the card.
 */
export function MobileDock() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero-actions')
    const contact = document.getElementById('contact')
    if (!hero || !contact || !('IntersectionObserver' in window)) return
    const state = { hero: true, contact: false }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.hero = e.isIntersecting
        else state.contact = e.isIntersecting
      }
      setShow(!state.hero && !state.contact)
    })
    io.observe(hero)
    io.observe(contact)
    return () => io.disconnect()
  }, [])

  const icon =
    'grid size-11 shrink-0 place-items-center rounded-full text-bg transition-colors hover:bg-bg/10 active:bg-bg/15'

  return (
    <div
      inert={!show}
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 transition-[translate,opacity] duration-500 ease-out-expo md:hidden ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[140%] opacity-0'
      }`}
    >
      <div className="flex items-center gap-1 rounded-full bg-ink p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]">
        <button
          type="button"
          onClick={downloadVCard}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-medium text-on-accent active:scale-[0.98]"
        >
          <ContactAdd width={18} height={18} />
          Save contact
        </button>
        <a href={`mailto:${profile.email}`} aria-label="Email" className={icon}>
          <Mail />
        </a>
        {profile.phone && (
          <a href={telHref} aria-label="Call" className={icon}>
            <Phone />
          </a>
        )}
      </div>
    </div>
  )
}
