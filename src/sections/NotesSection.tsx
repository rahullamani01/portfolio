import { notes } from '../content/notes'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ArrowUpRight } from '../components/Icons'

export function NotesSection() {
  return (
    <section className="section" id="notes" aria-labelledby="notes-title">
      <div className="container">
        <SectionHeading
          index="04"
          label="Notebook"
          headingId="notes-title"
          title={
            <>
              Working notes, <em>not content.</em>
            </>
          }
          intro="Short records of what I am testing, what surprised me, and what I still cannot explain. Each note stays attached to the repository it came from."
        />

        <div className="notes-list">
          {notes.map((note) => (
            <Reveal key={note.id}>
              <details className="note">
                <summary className="note__summary">
                  <span className="note__index">{note.index}</span>
                  <span>
                    <span className="note__title">{note.title}</span>
                    <span className="note__teaser">{note.teaser}</span>
                  </span>
                  <span className="note__meta">
                    <span>{note.date}</span>
                    <span>{note.tag}</span>
                  </span>
                  <span className="note__plus" aria-hidden="true" />
                </summary>
                <div className="note__body">
                  <p className="note__question">{note.question}</p>
                  {note.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                  <a
                    className="link-arrow note__link"
                    href={note.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {note.repoLabel}
                    <ArrowUpRight size={13} />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
