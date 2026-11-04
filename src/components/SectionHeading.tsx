import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  index: string
  label: string
  title: ReactNode
  intro: ReactNode
  headingId: string
}

export function SectionHeading({
  index,
  label,
  title,
  intro,
  headingId,
}: SectionHeadingProps) {
  return (
    <div className="section-head">
      <Reveal>
        <p className="section-head__meta">
          <span className="section-head__index">{index}</span>
          <span className="section-head__rule" aria-hidden="true" />
          <span>{label}</span>
        </p>
      </Reveal>
      <div className="section-head__body">
        <Reveal delay={70}>
          <h2 className="section-head__title" id={headingId}>
            {title}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="section-head__intro">{intro}</p>
        </Reveal>
      </div>
    </div>
  )
}
