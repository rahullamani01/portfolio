import { useState } from 'react'
import {
  GITHUB_PROFILE,
  otherProjects,
  projects,
  type Project,
} from '../content/projects'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { AtlasVisual, MiniDiagram } from '../components/ProjectVisuals'
import { ArrowUpRight, ChevronDown } from '../components/Icons'

function CaseStudy({
  project,
  open,
  panelId,
  onToggle,
}: {
  project: Project
  open: boolean
  panelId: string
  onToggle: () => void
}) {
  return (
    <div className={`case${open ? ' is-open' : ''}`}>
      <button
        className="case__toggle"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="case__plus" aria-hidden="true" />
        <span>{open ? 'Close case study' : 'Read the case study'}</span>
        <span className="case__toggle-meta" aria-hidden="true">
          {project.caseStudy.length} sections · diagram
        </span>
      </button>

      <div
        className="case__reveal"
        id={panelId}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="case__clip">
          <div className="case__body">
            {project.diagram && (
              <div className="case__block case__block--wide">
                <MiniDiagram key={open ? 'open' : 'closed'} kind={project.diagram} />
              </div>
            )}

            {project.caseStudy.map((section) => (
              <div className="case__block" key={section.label}>
                <h4 className="case__label">{section.label}</h4>
                <p className="case__text">{section.body}</p>
              </div>
            ))}

            <div className="case__block case__block--wide case__foot">
              <a
                className="link-arrow"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the ${project.name} repository on GitHub (opens in a new tab)`}
              >
                Source on GitHub
                <ArrowUpRight size={13} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              {project.featured && (
                <a className="link-arrow" href="#lab">
                  Open the lab
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl className="project__facts">
      <dt>Stack</dt>
      <dd>{project.tech.join(' · ')}</dd>
      <dt>Status</dt>
      <dd>{project.status}</dd>
      <dt>Tests</dt>
      <dd>
        {project.id === 'atlas'
          ? '179-test suite reported in the README'
          : 'Test suite in the repository'}
      </dd>
      <dt>Updated</dt>
      <dd>{project.updated}</dd>
    </dl>
  )
}

function ProjectEntry({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const panelId = `case-${project.id}`
  const toggle = () => setOpen((value) => !value)

  if (project.featured) {
    return (
      <article className={`project project--featured${open ? ' is-open' : ''}`}>
        <div className="project__head">
          <span className="project__index">{project.index}</span>
          <div>
            <h3 className="project__title">
              <button
                className="project__title-button"
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={toggle}
              >
                {project.name}
                <span className="project__title-hint" aria-hidden="true">
                  case study
                </span>
              </button>
            </h3>
            <p className="project__tagline">{project.tagline}</p>
            <p className="project__contribution">{project.contribution}</p>
          </div>
          <div className="project__meta">
            <span className="status" data-kind={project.statusKind}>
              {project.status}
            </span>
            <p className="project__tech">{project.tech.join(' / ')}</p>
          </div>
          <button
            className="project__arrow"
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={toggle}
            aria-label={`${open ? 'Close' : 'Open'} the ${project.name} case study`}
          >
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="project__body">
          <Reveal className="project-media">
            <div className="project-media__bar">
              <span>phase 02 / planning</span>
              <span>A* · 8-connected</span>
            </div>
            <div className="project-media__figure">
              <AtlasVisual />
            </div>
            <p className="project-media__caption">
              A* result computed by this site&apos;s TypeScript planner on the grid
              shown. The Python module in the repository is the reference
              implementation.
            </p>
          </Reveal>

          <div className="project__copy">
            <p className="project__summary">{project.summary}</p>
            <ProjectFacts project={project} />
          </div>
        </div>

        <CaseStudy
          project={project}
          open={open}
          panelId={panelId}
          onToggle={toggle}
        />
      </article>
    )
  }

  return (
    <article className={`project${open ? ' is-open' : ''}`}>
      <div className="project__row">
        <span className="project__index">{project.index}</span>
        <div>
          <h3 className="project__title">
            <button
              className="project__title-button"
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={toggle}
            >
              {project.name}
              <span className="project__title-hint" aria-hidden="true">
                case study
              </span>
            </button>
          </h3>
          <p className="project__tagline">{project.tagline}</p>
          <p className="project__contribution">{project.contribution}</p>
        </div>
        <div className="project__meta">
          <span className="status" data-kind={project.statusKind}>
            {project.status}
          </span>
          <p className="project__tech">{project.tech.join(' / ')}</p>
        </div>
        <button
          className="project__arrow"
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          aria-label={`${open ? 'Close' : 'Open'} the ${project.name} case study`}
        >
          <ChevronDown size={15} />
        </button>
      </div>

      <CaseStudy
        project={project}
        open={open}
        panelId={panelId}
        onToggle={toggle}
      />
    </article>
  )
}

export function WorkSection() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          index="01"
          label="Selected work"
          headingId="work-title"
          title={
            <>
              Built to be <em>understood.</em>
            </>
          }
          intro="Four systems I have built, tested, broken, and learned from. Open any entry to see how it is structured, what exists, and where the evidence stops."
        />

        <div className="work-list">
          {projects.map((project) => (
            <ProjectEntry project={project} key={project.id} />
          ))}
        </div>

        <Reveal>
          <div className="also">
            <span className="also__label">Also on GitHub</span>
            {otherProjects.map((project) => (
              <a
                key={project.name}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.name}
                <span className="also__note"> / {project.note}</span>
              </a>
            ))}
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the full GitHub profile (opens in a new tab)"
            >
              all repositories ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
