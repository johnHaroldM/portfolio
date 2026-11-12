// Paints a screenshot inside a simple browser window, onto a canvas used as a texture.

const COLORS = {
  window: '#fbf9f4',
  bar: '#ece6db',
  pill: '#f7f3ec',
  line: '#dcd4c6',
  muted: '#5c5f6b',
  accent: '#ea5a3c',
  dot: '#d3cabb',
  empty: '#e6e0d5',
}
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace'

/** Screenshot area is 16:10; the title bar sits on top. */
export function frameSize(width) {
  const bar = Math.round(width * 0.042)
  const image = Math.round(width / 1.6)
  return { width, height: bar + image, bar, image }
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

export function drawFrame(canvas, img, label, width) {
  const { height, bar, image } = frameSize(width)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = COLORS.window
  ctx.fillRect(0, 0, width, height)

  // Title bar: three dots and an address pill with the system name.
  ctx.fillStyle = COLORS.bar
  ctx.fillRect(0, 0, width, bar)
  const r = bar * 0.15
  ;[COLORS.accent, COLORS.dot, COLORS.dot].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(bar * 0.62 + i * r * 3.1, bar / 2, r, 0, Math.PI * 2)
    ctx.fill()
  })
  const pillW = width * 0.4
  const pillH = bar * 0.58
  ctx.fillStyle = COLORS.pill
  roundRect(ctx, (width - pillW) / 2, (bar - pillH) / 2, pillW, pillH, pillH / 2)
  ctx.fill()
  ctx.fillStyle = COLORS.muted
  ctx.font = `500 ${Math.round(bar * 0.32)}px ${MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, width / 2, bar / 2 + 1, pillW - pillH)
  ctx.fillStyle = COLORS.line
  ctx.fillRect(0, bar - 1, width, 1)

  // Screenshot: fill the area, keep the top of the page in view.
  if (img && img.naturalWidth) {
    const scale = Math.max(width / img.naturalWidth, image / img.naturalHeight)
    const w = img.naturalWidth * scale
    const h = img.naturalHeight * scale
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, bar, width, image)
    ctx.clip()
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, (width - w) / 2, bar, w, h)
    ctx.restore()
  } else {
    ctx.fillStyle = COLORS.empty
    ctx.fillRect(0, bar, width, image)
  }
  return canvas
}
