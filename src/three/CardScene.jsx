import { use, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefersReducedMotion } from '../lib/hooks.js'
import { CARD_COLORS, drawCardFaces } from './cardFaces.js'

// Real business-card proportions: 3.5 × 2 units.
const W = 3.5
const H = 2
const D = 0.03
const R = 0.13

let facesPromise
const getFaces = () => (facesPromise ??= drawCardFaces())

function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
  return s
}

function useCardGeometry() {
  const geo = useMemo(() => {
    const shape = roundedRect(W, H, R)
    const body = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false, curveSegments: 14 })
    body.translate(0, 0, -D / 2)

    const face = new THREE.ShapeGeometry(shape, 14)
    const pos = face.attributes.position
    const uv = face.attributes.uv
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / W + 0.5, pos.getY(i) / H + 0.5)
    uv.needsUpdate = true
    return { body, face }
  }, [])
  useEffect(() => () => (geo.body.dispose(), geo.face.dispose()), [geo])
  return geo
}

function useCanvasTexture(canvas) {
  const gl = useThree((s) => s.gl)
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    return t
  }, [canvas, gl])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/** Mouse position relative to the canvas centre, -1…1 (mouse only, not touch). */
function useMouseTilt() {
  const gl = useThree((s) => s.gl)
  const tilt = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = gl.domElement.getBoundingClientRect()
      const clamp = (v) => Math.max(-1, Math.min(1, v))
      tilt.current.x = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2))
      tilt.current.y = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2))
    }
    const reset = () => {
      tilt.current.x = 0
      tilt.current.y = 0
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', reset)
    }
  }, [gl])
  return tilt
}

function Card({ faces, flipSignal, reducedMotion, scale }) {
  const group = useRef()
  const { body, face } = useCardGeometry()
  const front = useCanvasTexture(faces.front)
  const back = useCanvasTexture(faces.back)
  const tilt = useMouseTilt()
  // flips: whole half-turns; offset: live drag angle
  const spin = useRef({ flips: 0, offset: 0, drag: null })

  useEffect(() => {
    if (flipSignal > 0) spin.current.flips += 1
  }, [flipSignal])

  // Entrance: the card swings in and settles.
  useEffect(() => {
    if (!reducedMotion && group.current) group.current.rotation.set(0.5, -1.25, 0.08)
  }, [reducedMotion])

  const onPointerDown = (e) => {
    e.stopPropagation()
    const s = spin.current
    // The ray crosses several card meshes; handle each physical press once.
    if (s.drag) return
    const startX = e.nativeEvent.clientX
    s.drag = { moved: false }
    document.body.style.cursor = 'grabbing'

    const move = (ev) => {
      const dx = ev.clientX - startX
      if (Math.abs(dx) > 6) s.drag.moved = true
      s.offset = dx * 0.011
    }
    const end = (ev) => {
      const tapped = ev.type === 'pointerup' && !s.drag?.moved
      if (tapped) {
        s.flips += 1
      } else if (Math.abs(s.offset) > 0.55) {
        s.flips += Math.sign(s.offset) * Math.max(1, Math.round(Math.abs(s.offset) / Math.PI))
      }
      s.offset = 0
      s.drag = null
      document.body.style.cursor = ''
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.5)
    const t = state.clock.elapsedTime
    const s = spin.current
    const idle = reducedMotion ? 0 : 1
    const dragging = !!s.drag

    const targetY =
      s.flips * Math.PI +
      s.offset +
      (dragging ? 0 : idle * Math.sin(t * 0.55) * 0.13 + tilt.current.x * 0.34)
    const targetX = 0.05 + (dragging ? 0 : idle * Math.cos(t * 0.45) * 0.05 + tilt.current.y * 0.22)

    const turnSpeed = dragging ? 16 : reducedMotion ? 9 : 4.2
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, turnSpeed, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, 0, 3, dt)

    // Lift toward the viewer mid-flip, like a card turned in the hand.
    const remaining = Math.abs(g.rotation.y - targetY)
    g.position.z = THREE.MathUtils.damp(g.position.z, Math.min(0.55, remaining * 0.3), 6, dt)
  })

  return (
    <group
      ref={group}
      scale={scale}
      onPointerDown={onPointerDown}
      onPointerOver={() => !spin.current.drag && (document.body.style.cursor = 'grab')}
      onPointerOut={() => !spin.current.drag && (document.body.style.cursor = '')}
    >
      {/* Painted edges in the accent colour */}
      <mesh geometry={body}>
        <meshStandardMaterial color={CARD_COLORS.accent} roughness={0.55} />
      </mesh>
      <mesh geometry={face} position-z={D / 2 + 0.0008}>
        <meshPhysicalMaterial
          map={front}
          roughness={0.62}
          clearcoat={0.35}
          clearcoatRoughness={0.38}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      <mesh geometry={face} position-z={-(D / 2 + 0.0008)} rotation-y={Math.PI}>
        <meshPhysicalMaterial
          map={back}
          roughness={0.55}
          clearcoat={0.35}
          clearcoatRoughness={0.38}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  )
}

function ReadySignal({ onReady }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(() => onReady?.())
  })
  return null
}

function Scene({ faces, flipSignal, reducedMotion, onReady }) {
  const viewport = useThree((s) => s.viewport)
  const scale = Math.min(1.1, (viewport.width * 0.8) / W, (viewport.height * 0.64) / H)

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight position={[2.5, 4, 5]} intensity={2.6} />
      <Environment resolution={128} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={2} position={[0, 2.6, 5]} scale={[10, 1.4, 1]} />
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[-5, -0.5, 1.5]}
          rotation-y={Math.PI / 2}
          scale={[6, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color={CARD_COLORS.accent}
          position={[5, 0, -1]}
          rotation-y={-Math.PI / 2}
          scale={[6, 3, 1]}
        />
      </Environment>

      <Float
        speed={reducedMotion ? 0 : 1.3}
        rotationIntensity={0}
        floatIntensity={reducedMotion ? 0 : 0.6}
        floatingRange={[-0.06, 0.06]}
      >
        <Card faces={faces} flipSignal={flipSignal} reducedMotion={reducedMotion} scale={scale} />
      </Float>

      <ContactShadows
        position={[0, -(H / 2) * scale - 0.42, 0]}
        opacity={0.3}
        scale={W * scale * 1.8}
        blur={2.8}
        far={2.4}
        resolution={256}
        color={CARD_COLORS.ink}
      />
      <ReadySignal onReady={onReady} />
    </>
  )
}

export default function CardScene({ flipSignal, active, onReady }) {
  const faces = use(getFaces())
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Canvas
      className="card-canvas"
      flat
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 6.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-label="Interactive 3D business card. Drag or tap to flip it."
      role="img"
    >
      <Scene faces={faces} flipSignal={flipSignal} reducedMotion={reducedMotion} onReady={onReady} />
    </Canvas>
  )
}
