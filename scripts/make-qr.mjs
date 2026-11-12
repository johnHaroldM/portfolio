// Generates print-ready QR codes for your calling card.
//   npm run qr                      → uses profile.website from src/content.js
//   npm run qr -- https://you.com   → uses the address you pass
import { mkdir } from 'node:fs/promises'
import QRCode from 'qrcode'
import { profile } from '../src/content.js'

const url = process.argv[2] || profile.website

if (!/^https?:\/\//.test(url)) {
  console.error(`✗ "${url}" is not a full web address. Use something like https://yourname.com`)
  process.exit(1)
}
if (url.includes('example.com')) {
  console.warn('! This is still the sample address. Put your real site in src/content.js (profile.website) first.\n')
}

const options = {
  errorCorrectionLevel: 'Q', // survives small scuffs and print imperfections
  margin: 4, // the quiet zone scanners need
  color: { dark: '#191B22', light: '#FFFFFF' },
}

await mkdir('qr', { recursive: true })
await QRCode.toFile('qr/portfolio-qr.svg', url, { ...options, type: 'svg' })
await QRCode.toFile('qr/portfolio-qr.png', url, { ...options, type: 'png', width: 1500 })

console.log(`✓ QR codes for ${url}`)
console.log('  qr/portfolio-qr.svg  ← send this one to the printer (vector, any size)')
console.log('  qr/portfolio-qr.png  ← 1500 px, for Canva / Word / previews')
console.log('\nPrint it at least 2 × 2 cm (0.8 in) and test-scan the proof before ordering.')
