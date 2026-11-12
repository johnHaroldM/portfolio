import { profile, fullName } from '../content.js'

const esc = (value = '') =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')

/** A vCard 3.0 file — opens straight into Contacts on iOS and Android. */
export function buildVCard(p = profile) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(p.lastName)};${esc(p.firstName)};;;`,
    `FN:${esc(fullName)}`,
    p.role && `TITLE:${esc(p.role)}`,
    p.company && `ORG:${esc(p.company)}`,
    p.email && `EMAIL;TYPE=INTERNET,PREF:${p.email}`,
    p.phone && `TEL;TYPE=CELL:${p.phone.replace(/[^\d+]/g, '')}`,
    p.website && `URL:${p.website}`,
    p.location && `ADR;TYPE=WORK:;;;${esc(p.location)};;;`,
    ...(p.socials ?? []).map((s) => `X-SOCIALPROFILE;TYPE=${s.label.toLowerCase()}:${s.url}`),
    p.vcardNote && `NOTE:${esc(p.vcardNote)}`,
    'END:VCARD',
  ].filter(Boolean)
  return lines.join('\r\n') + '\r\n'
}

export function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fullName.replace(/\s+/g, '-')}.vcf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
