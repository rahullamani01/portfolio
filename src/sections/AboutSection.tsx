import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

export function AboutSection() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          index="05"
          label="About"
          headingId="about-title"
          title={
            <>
              More interested in the <em>mechanism.</em>
            </>
          }
          intro="A short version: what I am studying, what I am building, and the kind of engineer I am trying to become."
        />

        <div className="about-grid">
          <Reveal>
            <div>
              <p className="about-statement">
                A student engineer, <em>learning in public.</em>
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="about-copy">
              <p>
                I&apos;m Rahul Lamani, a BCA student building my foundation in Python
                engineering, machine learning, and the mathematics behind intelligent
                systems.
              </p>
              <p>
                I learn best by building things, testing assumptions, and finding out
                why something breaks. My projects range from networked Python
                applications to language-model experiments, audio classification, and
                2D simulation.
              </p>
              <p>
                I&apos;d rather show a small system I can explain than a large stack I
                can&apos;t. The projects above are the evidence; the limitations are
                part of the record.
              </p>

              <dl className="facts">
                <div className="fact">
                  <dt>Education</dt>
                  <dd>BCA · in progress</dd>
                </div>
                <div className="fact">
                  <dt>Focus</dt>
                  <dd>Python · AI systems · ML</dd>
                </div>
                <div className="fact">
                  <dt>Building</dt>
                  <dd>ATLAS — Phases 0–6 complete</dd>
                </div>
                <div className="fact">
                  <dt>Open to</dt>
                  <dd>Python / AI internships and collaborations</dd>
                </div>
                <div className="fact">
                  <dt>Status</dt>
                  <dd>Learning in public · documenting the failures</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <p className="about-quote">
            A small system I can explain is worth more than a large stack I
            can&apos;t. <span aria-hidden="true">↗</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
