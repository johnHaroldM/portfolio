import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Rounded rectangle centred on the origin. */
export function roundedRect(w, h, r) {
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

/** Mouse position relative to the canvas centre, -1…1 (mouse only, not touch). */
export function useMouseTilt() {
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

/** Fires onReady once the first frame has been drawn. */
export function ReadySignal({ onReady }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    requestAnimationFrame(() => onReady?.())
  })
  return null
}
