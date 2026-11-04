import { EMAIL, EMAIL_HREF, PHONE, PHONE_HREF } from '../content/contact'
import { GITHUB_PROFILE } from '../content/projects'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ArrowUpRight } from '../components/Icons'

export function ContactSection() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          index="06"
          label="Contact"
          headingId="contact-title"
          title={
            <>
              Have a technical question, or a project <em>in mind?</em>
            </>
          }
          intro="I am happy to talk about Python, machine learning, systems, and the things I am building."
        />

        <div className="contact__grid">
          <Reveal>
            <div>
              <p className="contact__copy">
                Email is the fastest way to reach me. I am open to Python and AI
                engineering internships, collaborations, and technical conversations.
              </p>
              <p className="contact__note">
                No contact form. No newsletter. No tracking. Direct links only.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="contact-links">
              <a
                className="contact-link"
                href={EMAIL_HREF}
                aria-label={`Email Rahul Lamani at ${EMAIL}`}
              >
                <span className="contact-link__text">
                  <span className="contact-link__label">Email</span>
                  <span className="contact-link__handle">{EMAIL}</span>
                </span>
                <span className="contact-link__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </a>

              <a
                className="contact-link"
                href={PHONE_HREF}
                aria-label={`Call Rahul Lamani at ${PHONE}`}
              >
                <span className="contact-link__text">
                  <span className="contact-link__label">Phone</span>
                  <span className="contact-link__handle">{PHONE}</span>
                </span>
                <span className="contact-link__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </a>

              <a
                className="contact-link"
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Rahul Lamani's GitHub profile (opens in a new tab)"
              >
                <span className="contact-link__text">
                  <span className="contact-link__label">GitHub</span>
                  <span className="contact-link__handle">@rahullamani01</span>
                </span>
                <span className="contact-link__arrow" aria-hidden="true">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
