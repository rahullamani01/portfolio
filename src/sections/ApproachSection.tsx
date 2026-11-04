import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

const PRINCIPLES = [
  {
    title: 'Understand the mechanism',
    body:
      'I want to know why a system works, not only how to call its API. That means following the data flow, the mathematical assumptions, and the implementation details until I can explain the result without the library.',
  },
  {
    title: 'Measure before claiming',
    body:
      'A result is evidence only when I understand how it was measured. I try to keep the test, the split, and the limitation close to the claim — especially when the number looks good.',
  },
  {
    title: 'Build, inspect, improve',
    body:
      'I learn through implementation, debugging, and comparison. The failed attempt usually teaches more than the demo that happens to work. I write both down.',
  },
]

const USED = [
  ['Python', 'systems · simulation · ML'],
  ['PyTorch', 'models · training'],
  ['NumPy', 'arrays · geometry'],
  ['FastAPI', 'HTTP · WebSocket'],
  ['TCP sockets', 'protocol · concurrency'],
  ['Git & GitHub', 'versioning · CI'],
  ['Linux & macOS', 'shell · tooling'],
  ['React & TypeScript', 'this site'],
]

const STUDYING = [
  ['Mathematics for ML', 'linear algebra · probability'],
  ['Transformer internals', 'attention · tokenization'],
  ['Robot kinematics', 'control · localisation'],
  ['Evaluation methodology', 'splits · metrics'],
]

export function ApproachSection() {
  return (
    <section className="section" id="approach" aria-labelledby="approach-title">
      <div className="container">
        <SectionHeading
          index="02"
          label="Approach"
          headingId="approach-title"
          title={
            <>
              How I approach <em>a system.</em>
            </>
          }
          intro="I am more interested in being able to explain a system than in collecting the technologies around it. These are the habits I am trying to build."
        />

        <div className="principles">
          {PRINCIPLES.map((principle, index) => (
            <Reveal key={principle.title}>
              <div className="principle">
                <span className="principle__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="principle__title">{principle.title}</h3>
                <p className="principle__body">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="skills">
          <Reveal>
            <div>
              <p className="skills__label">Used in projects</p>
              <ul className="skills__list">
                {USED.map(([name, context]) => (
                  <li className="skills__item" key={name}>
                    {name}
                    <span>{context}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div>
              <p className="skills__label">Currently studying</p>
              <ul className="skills__list">
                {STUDYING.map(([name, context]) => (
                  <li className="skills__item" key={name}>
                    {name}
                    <span>{context}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <p className="skills__note">
            No logo wall. If a tool is not used in a project above, it is not claimed
            as experience. The second list is study, not production work.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
