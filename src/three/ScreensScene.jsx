import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../lib/hooks.js'
import { drawFrame, frameSize } from './screenFrame.js'
import { ReadySignal, roundedRect, useMouseTilt } from './shared.js'

const PW = 3.2 // panel width in world units
const DEPTH = 0.035
const RADIUS = 0.07
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const mod = (v, n) => ((v % n) + n) % n

/** Texture resolution: sharp on big screens, light on phones. */
const textureWidth = () =>
  clamp(Math.round(window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) * 0.6), 800, 1400)

function usePanelGeometry(ph) {
  const geo = useMemo(() => {
    const shape = roundedRect(PW, ph, RADIUS)
    const body = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false, curveSegments: 10 })
    body.translate(0, 0, -DEPTH / 2)
    const face = new THREE.ShapeGeometry(shape, 10)
    const pos = face.attributes.position
    const uv = face.attributes.uv
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / PW + 0.5, pos.getY(i) / ph + 0.5)
    uv.needsUpdate = true
    return { body, face }
  }, [ph])
  useEffect(() => () => (geo.body.dispose(), geo.face.dispose()), [geo])
  return geo
}

/** Browser-window texture; shows an empty frame until the screenshot has loaded. */
function useScreenTexture(slide, width) {
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const [texture] = useState(() => {
    const t = new THREE.CanvasTexture(drawFrame(document.createElement('canvas'), null, slide.title, width))
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    return t
  })
  useEffect(() => {
    let alive = true
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (!alive) return
      drawFrame(texture.image, img, slide.title, width)
      texture.needsUpdate = true
      invalidate()
    }
    img.src = slide.src
    return () => {
      alive = false
      img.onload = null
    }
  }, [slide.src, slide.title, width, texture, invalidate])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function Panel({ slide, index, geo, width, registry, onPick }) {
  const texture = useScreenTexture(slide, width)
  const entry = (registry.current[index] ??= {})
  return (
    <group
      ref={(g) => (entry.group = g)}
      onClick={(e) => {
        e.stopPropagation()
        if (e.delta > 8) return // that was a drag, not a tap
        onPick(index)
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <mesh geometry={geo.body}>
        <meshStandardMaterial color="#d6cfc2" roughness={0.6} />
      </mesh>
      <mesh geometry={geo.face} position-z={DEPTH / 2 + 0.0008}>
        <meshBasicMaterial
          ref={(m) => (entry.mat = m)}
          map={texture}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  )
}

/** Cover-flow placement for a panel `o` slots away from the centre. */
function place(o, spread) {
  const a = Math.abs(o)
  const s = Math.sign(o)
  const near = Math.min(a, 1)
  const far = Math.max(a - 1, 0)
  return {
    x: s * (near * spread + far * spread * 0.42),
    z: -(near * 1.15 + far * 0.6),
    ry: -s * near * 0.58,
    dim: Math.min(a, 2) / 2,
  }
}

function Carousel({ slides, active, onActive, onOpen, reducedMotion }) {
  const gl = useThree((s) => s.gl)
  const viewport = useThree((s) => s.viewport)
  const size = useThree((s) => s.size)
  const [width] = useState(textureWidth)
  const { height } = frameSize(width)
  const PH = (PW * height) / width
  const geo = usePanelGeometry(PH)
  const tilt = useMouseTilt()
  const root = useRef()
  const registry = useRef([])
  const count = slides.length
  const nav = useRef({ pos: active, target: active, drag: null })
  // With 3+ screens the carousel loops, so there are always neighbours on both sides.
  const loop = count >= 3
  const limit = loop ? Math.min(3.6, count / 2 - 0.25) : 3.6
  const offsetOf = (i, pos) => (loop ? mod(i - pos + count / 2, count) - count / 2 : i - pos)

  const portrait = size.width < 700 // phones: one big panel with neighbours peeking in
  const scale = Math.min(1.3, (viewport.width * (portrait ? 0.74 : 0.42)) / PW, (viewport.height * 0.66) / PH)
  const spread = PW * scale * (portrait ? 0.9 : 0.8)

  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive

  // Buttons / keyboard outside the canvas move the carousel too.
  useEffect(() => {
    const n = nav.current
    if (n.drag) return
    if (!loop) {
      n.target = active
      return
    }
    const here = Math.round(n.target)
    const delta = mod(active - here + count / 2, count) - count / 2 // shortest way round
    n.target = here + Math.round(delta)
  }, [active, loop, count])

  // Horizontal drag anywhere on the canvas; vertical swipes still scroll the page.
  useEffect(() => {
    const el = gl.domElement
    const down = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      const n = nav.current
      n.drag = { x0: e.clientX, y0: e.clientY, p0: n.target, axis: null, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
    }
    const move = (e) => {
      const d = nav.current.drag
      if (!d) return
      const dx = e.clientX - d.x0
      const dy = e.clientY - d.y0
      if (!d.axis) {
        if (Math.hypot(dx, dy) < 8) return
        d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        if (d.axis === 'x') document.body.style.cursor = 'grabbing'
      }
      if (d.axis !== 'x') return
      const perSlide = Math.max(160, el.clientWidth * 0.3)
      const t = d.p0 - dx / perSlide
      nav.current.target = loop ? t : clamp(t, -0.4, count - 0.6)
      const dt = Math.max(1, e.timeStamp - d.lastT)
      d.v = (-(e.clientX - d.lastX) / perSlide / dt) * 1000 // slides per second
      d.lastX = e.clientX
      d.lastT = e.timeStamp
    }
    const up = () => {
      const d = nav.current.drag
      nav.current.drag = null
      if (!d || d.axis !== 'x') return
      document.body.style.cursor = ''
      let next = Math.round(nav.current.target + clamp(d.v * 0.18, -1.5, 1.5))
      if (!loop) next = clamp(next, 0, count - 1)
      nav.current.target = next
      onActiveRef.current(mod(next, count))
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, count, loop])

  const pick = (i) => {
    if (i === mod(Math.round(nav.current.target), count)) onOpen(i)
    else onActiveRef.current(i)
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.5)
    const n = nav.current
    const dragging = n.drag?.axis === 'x'
    n.pos = THREE.MathUtils.damp(n.pos, n.target, dragging ? 18 : reducedMotion ? 14 : 6.5, dt)

    for (let i = 0; i < count; i++) {
      const entry = registry.current[i]
      if (!entry?.group) continue
      const o = offsetOf(i, n.pos)
      const p = place(o, spread)
      const g = entry.group
      g.visible = Math.abs(o) < limit
      g.position.set(p.x, 0, p.z)
      g.rotation.set(0, p.ry, 0)
      entry.mat?.color.setScalar(1 - p.dim * 0.38)
    }

    const r = root.current
    if (r) {
      const t = state.clock.elapsedTime
      const idle = reducedMotion || dragging ? 0 : 1
      r.rotation.y = THREE.MathUtils.damp(r.rotation.y, tilt.current.x * 0.12, 3, dt)
      r.rotation.x = THREE.MathUtils.damp(r.rotation.x, 0.04 + tilt.current.y * 0.08, 3, dt)
      r.position.y = idle * Math.sin(t * 0.9) * 0.035
    }
  })

  return (
    <>
      <group ref={root} scale={scale}>
        {slides.map((s, i) => (
          <Panel key={s.src} slide={s} index={i} geo={geo} width={width} registry={registry} onPick={pick} />
        ))}
      </group>
      <ContactShadows
        position={[0, -(PH / 2) * scale - 0.3, 0]}
        opacity={0.26}
        scale={[PW * scale * 4, PW * scale * 1.4]}
        blur={2.6}
        far={2.2}
        resolution={256}
        color="#191b22"
      />
    </>
  )
}

export default function ScreensScene({ slides, active, onActive, onOpen, running, onReady }) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      frameloop={running ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-label="3D carousel of system screenshots. Drag sideways, or use the buttons below, to browse."
      role="img"
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[2, 4, 6]} intensity={2.2} />
      <Carousel slides={slides} active={active} onActive={onActive} onOpen={onOpen} reducedMotion={reducedMotion} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  )
}
