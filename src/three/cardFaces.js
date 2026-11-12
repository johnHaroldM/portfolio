import QRCode from 'qrcode'
import { profile, fullName, initials, siteHost } from '../content.js'

/** Page palette (index.css), on a slightly whiter card stock so it lifts off the page. */
export const CARD_COLORS = {
  paper: '#fbf9f4',
  ink: '#191b22',
  muted: '#5c5f6b',
  accent: '#ea5a3c',
}

// 3.5 × 2 in card at 2048 px wide.
const TW = 2048
const TH = Math.round(TW / 1.75)
const P = 118

const DISPLAY = '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace'

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = TW
  canvas.height = TH
  return [canvas, canvas.getContext('2d')]
}

const track = (ctx, px) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`
}

/** Seeded speckle so the card reads as paper, not plastic. */
function grain(ctx, seed, dark, light) {
  let s = seed
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (const color of [dark, light]) {
    ctx.fillStyle = color
    for (let i = 0; i < 9000; i++) {
      const size = rnd() * 1.8 + 0.6
      ctx.fillRect(rnd() * TW, rnd() * TH, size, size)
    }
  }
}

/** Largest font size (≤ start) at which text fits maxWidth. */
function fit(ctx, text, weight, family, start, maxWidth, trackingEm = 0) {
  let size = start
  for (; size > 36; size -= 4) {
    ctx.font = `${weight} ${size}px ${family}`
    track(ctx, size * trackingEm)
    if (ctx.measureText(text).width <= maxWidth) break
  }
  return size
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawFront() {
  const { paper, ink, muted, accent } = CARD_COLORS
  const [canvas, ctx] = makeCanvas()

  ctx.fillStyle = paper
  ctx.fillRect(0, 0, TW, TH)
  grain(ctx, 7, 'rgba(25,27,34,0.045)', 'rgba(255,255,255,0.55)')

  // Top row: mark + label, website
  ctx.textBaseline = 'middle'
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(P + 22, P + 22, 22, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = ink
  ctx.font = `500 34px ${MONO}`
  track(ctx, 5)
  ctx.textAlign = 'left'
  ctx.fillText('PORTFOLIO', P + 72, P + 24)
  ctx.textAlign = 'right'
  ctx.fillText(siteHost.toUpperCase(), TW - P, P + 24)

  // Name
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  const size = fit(ctx, fullName, 700, DISPLAY, 210, TW - P * 2, -0.035)
  ctx.fillStyle = ink
  ctx.fillText(fullName, P - size * 0.03, TH - P - 250)

  // Role
  ctx.font = `500 36px ${MONO}`
  track(ctx, 5)
  ctx.fillStyle = muted
  ctx.fillText(profile.shortRole.toUpperCase(), P, TH - P - 168)

  // Hairline
  ctx.fillStyle = 'rgba(25,27,34,0.2)'
  ctx.fillRect(P, TH - P - 100, TW - P * 2, 2)

  // Contact row
  ctx.fillStyle = ink
  ctx.font = `500 33px ${MONO}`
  track(ctx, 2)
  ctx.textAlign = 'left'
  ctx.fillText(profile.email, P, TH - P - 6)
  ctx.textAlign = 'right'
  ctx.fillText(profile.phone || '', TW - P, TH - P - 6)

  return canvas
}

function drawBack() {
  const { paper, ink, accent } = CARD_COLORS
  const [canvas, ctx] = makeCanvas()

  ctx.fillStyle = accent
  ctx.fillRect(0, 0, TW, TH)
  grain(ctx, 11, 'rgba(25,27,34,0.06)', 'rgba(255,255,255,0.12)')

  // Oversized initials bleeding off the bottom-left edge
  ctx.fillStyle = paper
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `800 860px ${DISPLAY}`
  track(ctx, -36)
  ctx.fillText(initials, P - 70, TH + 48)

  // QR code — scan straight from someone else's phone screen
  const qrBox = 420
  const qx = TW - P - qrBox
  const qy = P
  ctx.fillStyle = paper
  roundRect(ctx, qx, qy, qrBox, qrBox, 30)
  ctx.fill()
  try {
    const qr = QRCode.create(profile.website, { errorCorrectionLevel: 'M' })
    const n = qr.modules.size
    const inset = 34
    const cell = (qrBox - inset * 2) / n
    ctx.fillStyle = ink
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.modules.get(r, c)) {
          ctx.fillRect(qx + inset + c * cell, qy + inset + r * cell, cell + 0.6, cell + 0.6)
        }
      }
    }
  } catch {
    /* invalid URL — leave the plate blank */
  }

  // Top-left text block
  ctx.fillStyle = ink
  ctx.textBaseline = 'middle'
  ctx.font = `500 34px ${MONO}`
  track(ctx, 5)
  ctx.fillText('LET’S TALK —', P, P + 24)

  ctx.textBaseline = 'alphabetic'
  fit(ctx, profile.email, 600, DISPLAY, 76, qx - P - 80, -0.02)
  ctx.fillText(profile.email, P - 4, P + 150)

  ctx.font = `500 34px ${MONO}`
  track(ctx, 3)
  ctx.fillText(profile.phone || '', P, P + 222)

  // Bottom-right URL
  ctx.textAlign = 'right'
  ctx.font = `500 34px ${MONO}`
  track(ctx, 5)
  ctx.fillText(siteHost.toUpperCase(), TW - P, TH - P - 6)

  return canvas
}

async function loadFonts() {
  if (!document.fonts?.load) return
  const wanted = [
    `700 200px ${DISPLAY}`,
    `800 200px ${DISPLAY}`,
    `600 76px ${DISPLAY}`,
    `500 34px ${MONO}`,
  ]
  await Promise.race([
    Promise.all(wanted.map((f) => document.fonts.load(f))),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]).catch(() => {})
}

export async function drawCardFaces() {
  await loadFonts()
  return { front: drawFront(), back: drawBack() }
}
