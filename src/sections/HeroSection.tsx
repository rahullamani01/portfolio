import { useEffect, useRef } from 'react'
import { GITHUB_PROFILE } from '../content/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { GlyphField } from '../components/GlyphField'
import { ArrowRight, ArrowUpRight, CodeIcon, GridIcon, NetworkIcon, WaveIcon } from '../components/Icons'

const STRIP = [
  {
    icon: CodeIcon,
    label: 'Python engineering',
    note: 'systems, from scratch',
  },
  {
    icon: NetworkIcon,
    label: 'Machine learning',
    note: 'PyTorch · evaluation',
  },
  {
    icon: WaveIcon,
    label: 'Model internals',
    note: 'attention · tokenization',
  },
  {
    icon: GridIcon,
    label: 'Simulation',
    note: 'planning · control',
  },
]

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    if (reduced) {
      hero.style.removeProperty('--hero-p')
      return
    }

    let frame = 0

    const update = () => {
      frame = 0
      const rect = hero.getBoundingClientRect()
      const height = Math.max(hero.offsetHeight, 1)
      const progress = Math.min(1, Math.max(0, -rect.top / (height * 0.82)))
      hero.style.setProperty('--hero-p', progress.toFixed(3))
    }

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== 0) window.cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <section className="hero" id="home" ref={heroRef} aria-labelledby="hero-name">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__reeded" />
        <GlyphField />
      </div>

      <div className="container hero__inner">
        <div className="hero__top">
          <p className="hero__eyebrow">
            <span>Portfolio — 2026</span>
            <span className="hero__eyebrow-sep" aria-hidden="true" />
            <strong>learning in public</strong>
          </p>

          <aside className="terminal" aria-hidden="true">
            <div className="terminal__bar">
              <span className="terminal__bar-left">
                <span className="terminal__status" />
                rahul@dev:~
              </span>
              <span className="terminal__bar-meta">session / 01</span>
            </div>
            <div className="terminal__body">
              <p className="terminal__line">
                <span className="terminal__prompt">$</span>
                <span>system.status()</span>
              </p>
              <p className="terminal__out terminal__out--bright">
                Python · AI systems
              </p>
              <p className="terminal__out">learning in public</p>
              <div className="terminal__rule" />
              <p className="terminal__meta">
                <span>focus → model internals</span>
                <span>simulation</span>
              </p>
              <p className="terminal__line terminal__line--last">
                <span className="terminal__prompt">$</span>
                <span>
                  <span className="terminal__caret" />
                </span>
              </p>
            </div>
          </aside>
        </div>

        <h1 className="hero__name" id="hero-name">
          <span className="name-line">
            <span>Rahul</span>
          </span>
          <span className="name-line">
            <span>
              Lamani<span className="name-line__dot">.</span>
            </span>
          </span>
        </h1>

        <div className="hero__sub">
          <div>
            <p className="hero__role">
              Python Developer · AI Systems · Machine Learning
            </p>
            <p className="hero__lede">
              I build to <em>understand systems</em> — not just to make them run.
            </p>
          </div>

          <div className="hero__actions">
            <a className="btn" href="#work">
              Explore selected work
              <ArrowRight size={14} />
            </a>
            <a
              className="link-arrow"
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub
              <ArrowUpRight size={13} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-strip">
        <div className="container">
          <div className="hero-strip__grid">
            {STRIP.map(({ icon: Icon, label, note }) => (
              <div className="hero-strip__item" key={label}>
                <Icon size={16} className="hero-strip__icon" />
                <span>
                  <span className="hero-strip__label">{label}</span>
                  <span className="hero-strip__note">{note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
