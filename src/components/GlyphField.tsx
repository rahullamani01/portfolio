import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const GLYPHS = [
  '{',
  '}',
  '[',
  ']',
  '(',
  ')',
  '<',
  '>',
  '/',
  '\\',
  '=',
  '+',
  '0',
  '1',
  'λ',
  'π',
  'Σ',
  '√',
  '·',
]

interface Particle {
  x: number
  y: number
  speed: number
  glyph: string
  alpha: number
  tone: 'warm' | 'amber'
}

function makeParticles(width: number, height: number, reduced: boolean) {
  const spacing = width < 640 ? 24 : 27
  const columns = Math.max(1, Math.floor((width - 24) / spacing))
  const count = Math.max(12, Math.min(reduced ? 22 : 34, Math.round(columns * 0.9)))
  const particles: Particle[] = []

  for (let index = 0; index < count; index += 1) {
    const column = Math.floor(Math.random() * columns)
    particles.push({
      x: 14 + column * spacing,
      y: Math.random() * height,
      speed: 7 + Math.random() * 13,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      alpha: 0.07 + Math.random() * 0.12,
      tone: Math.random() > 0.72 ? 'amber' : 'warm',
    })
  }

  return particles
}

export function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let frame = 0
    let running = true
    let lastDraw = 0

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.font = '10px "JetBrains Mono Variable", ui-monospace, monospace'
      context.textBaseline = 'middle'

      for (const particle of particles) {
        context.fillStyle =
          particle.tone === 'amber'
            ? `rgba(224, 160, 94, ${particle.alpha})`
            : `rgba(242, 239, 232, ${particle.alpha * 0.75})`
        context.fillText(particle.glyph, particle.x, particle.y)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      particles = makeParticles(width, height, reduced)
      draw()
    }

    const loop = (time: number) => {
      frame = 0
      if (!running) return

      if (time - lastDraw > 105) {
        const delta = Math.min(0.12, (time - (lastDraw || time)) / 1000)
        lastDraw = time

        for (const particle of particles) {
          particle.y += particle.speed * delta
          if (particle.y > height + 12) {
            particle.y = -12
            particle.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
        }

        draw()
      }

      frame = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (reduced || frame !== 0 || !running) return
      frame = window.requestAnimationFrame(loop)
    }

    const stop = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    if (reduced) {
      draw()
      return () => resizeObserver.disconnect()
    }

    const visibility = () => {
      running = !document.hidden
      if (running) {
        start()
      } else {
        stop()
      }
    }

    const intersection = new IntersectionObserver(
      (entries) => {
        running = entries.some((entry) => entry.isIntersecting) && !document.hidden
        if (running) {
          start()
        } else {
          stop()
        }
      },
      { threshold: 0 },
    )

    intersection.observe(canvas)
    document.addEventListener('visibilitychange', visibility)
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="glyph-field" aria-hidden="true" />
}
