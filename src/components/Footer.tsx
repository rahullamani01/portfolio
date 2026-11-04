import { EMAIL, EMAIL_HREF } from '../content/contact'
import { GITHUB_PROFILE } from '../content/projects'

const LINKS = [
  { href: '#work', label: 'work' },
  { href: '#lab', label: 'lab' },
  { href: '#notes', label: 'notes' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="footer__name">Rahul Lamani</p>
            <p className="footer__descriptor">Python · AI systems · experiments</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer__links">
            <a href={EMAIL_HREF} aria-label={`Email Rahul Lamani at ${EMAIL}`}>
              Email
            </a>
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Rahul Lamani's GitHub profile (opens in a new tab)"
            >
              GitHub ↗
            </a>
            <a className="footer__top" href="#home">
              Back to top ↑
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {YEAR} Rahul Lamani</span>
          <span className="footer__bottom-note">
            Built with React, TypeScript &amp; Vite · no cookies, no trackers
          </span>
        </div>
      </div>
    </footer>
  )
}
