import { useEffect, useRef, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import { ArrowUpRight } from './Icons'

const SECTION_IDS = ['home', 'work', 'approach', 'lab', 'notes', 'about', 'contact']

const NAV_ITEMS = [
  { id: 'work', label: 'work' },
  { id: 'lab', label: 'lab' },
  { id: 'notes', label: 'notes' },
  { id: 'about', label: 'about' },
]

export function Header() {
  const active = useActiveSection(SECTION_IDS)
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        headerRef.current &&
        event.target instanceof Node &&
        !headerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)

    const focusFrame = window.requestAnimationFrame(() => {
      firstLinkRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
      window.cancelAnimationFrame(focusFrame)
    }
  }, [open])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container site-header__inner">
        <a className="wordmark" href="#home" aria-label="Rahul Lamani, back to home">
          <span className="wordmark__bracket" aria-hidden="true">[</span>
          rahul<span className="wordmark__dot">.</span>dev
          <span className="wordmark__bracket" aria-hidden="true">]</span>
        </a>

        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className="nav__link"
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
            >
              <span className="nav__prompt" aria-hidden="true">$</span>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contact">
          contact
          <ArrowUpRight size={12} />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          ref={menuButtonRef}
        >
          {open ? 'Close' : 'Menu'}
          <span className="menu-button__icon" aria-hidden="true" />
        </button>

        <div className="mobile-menu" id="mobile-menu" hidden={!open}>
          <nav aria-label="Mobile">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                ref={index === 0 ? firstLinkRef : undefined}
                className="mobile-menu__link"
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? 'location' : undefined}
              >
                <span>
                  <span className="nav__prompt" aria-hidden="true">$</span>
                  {item.label}
                </span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </a>
            ))}
            <a
              className="mobile-menu__link"
              href="#contact"
              onClick={() => setOpen(false)}
              aria-current={active === 'contact' ? 'location' : undefined}
            >
              <span>
                <span className="nav__prompt" aria-hidden="true">$</span>
                contact
              </span>
              <span>05</span>
            </a>
          </nav>
          <p className="mobile-menu__foot">Python · AI systems · learning in public</p>
        </div>
      </div>
    </header>
  )
}
