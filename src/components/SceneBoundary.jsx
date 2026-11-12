import { Component } from 'react'

export const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

/** If a 3D scene fails, drop it quietly and keep the flat fallback on screen. */
export class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('3D scene unavailable, showing the flat version instead.', error)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
