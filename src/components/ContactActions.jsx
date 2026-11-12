import { profile } from '../content.js'
import { downloadVCard } from '../lib/vcard.js'
import { ContactAdd, Mail, Phone } from './Icons.jsx'

const telHref = `tel:${profile.phone.replace(/[^\d+]/g, '')}`
export { telHref }

const pill =
  'inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-medium transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-[0.97]'

/** The three things someone holding your card wants to do. */
export function ContactActions({ id }) {
  return (
    <div id={id} className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
      <button
        type="button"
        onClick={downloadVCard}
        className={`${pill} col-span-2 bg-ink text-bg hover:bg-accent hover:text-on-accent`}
      >
        <ContactAdd />
        Save contact
      </button>
      <a href={`mailto:${profile.email}`} className={`${pill} border border-line hover:border-ink`}>
        <Mail />
        Email
      </a>
      <a href={telHref} className={`${pill} border border-line hover:border-ink`}>
        <Phone />
        Call
      </a>
    </div>
  )
}
