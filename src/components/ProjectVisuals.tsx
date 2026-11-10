import { useMemo } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { cellsToPathData, findPath, type Cell } from '../lib/astar'

const COLS = 24
const ROWS = 14

const WALLS: Array<[number, number]> = [
  ...Array.from({ length: 11 }, (_, index) => [1 + index, 8] as [number, number]).filter(
    ([row]) => row !== 6,
  ),
  ...Array.from({ length: 9 }, (_, index) => [4, 13 + index] as [number, number]).filter(
    ([, col]) => col !== 17,
  ),
  ...Array.from({ length: 3 }, (_, index) => [8 + index, 15] as [number, number]),
  ...Array.from({ length: 3 }, (_, index) => [8 + index, 16] as [number, number]),
  ...Array.from({ length: 3 }, (_, index) => [8 + index, 17] as [number, number]),
  [4, 3],
  [4, 4],
  [4, 5],
  [10, 3],
  [10, 4],
  [10, 5],
  [6, 20],
  [7, 20],
]

const START: Cell = { row: 11, col: 2 }
const GOAL: Cell = { row: 2, col: 21 }

export function AtlasVisual() {
  const result = useMemo(() => {
    const walls = Array.from({ length: ROWS }, () => Array(COLS).fill(false))
    for (const [row, col] of WALLS) walls[row][col] = true
    return findPath({ rows: ROWS, cols: COLS, walls, start: START, goal: GOAL })
  }, [])

  const pathData = cellsToPathData(result.path)

  return (
    <svg
      className="atlas-visual"
      viewBox={`0 0 ${COLS} ${ROWS}`}
      role="img"
      aria-label="A 24 by 14 occupancy grid with obstacles and an A* path from a start cell at bottom left to a goal cell at top right."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="atlas-grid" width="1" height="1" patternUnits="userSpaceOnUse">
          <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgba(242,239,232,0.08)" strokeWidth="0.012" />
        </pattern>
      </defs>

      <rect width={COLS} height={ROWS} fill="#0b0b09" />
      <rect width={COLS} height={ROWS} fill="url(#atlas-grid)" />

      {WALLS.map(([row, col]) => (
        <rect
          key={`${row}-${col}`}
          x={col + 0.04}
          y={row + 0.04}
          width={0.92}
          height={0.92}
          rx={0.08}
          fill="#322d27"
          stroke="rgba(242,239,232,0.035)"
          strokeWidth="0.015"
        />
      ))}

      {pathData && (
        <>
          <path
            d={pathData}
            fill="none"
            stroke="rgba(224,160,94,0.18)"
            strokeWidth="0.34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={pathData}
            fill="none"
            stroke="var(--amber)"
            strokeWidth="0.12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}

      <circle
        cx={START.col + 0.5}
        cy={START.row + 0.5}
        r="0.27"
        fill="#0b0b09"
        stroke="var(--ink-soft)"
        strokeWidth="0.05"
      />
      <circle
        cx={GOAL.col + 0.5}
        cy={GOAL.row + 0.5}
        r="0.23"
        fill="var(--amber)"
      />
      <circle
        cx={GOAL.col + 0.5}
        cy={GOAL.row + 0.5}
        r="0.42"
        fill="none"
        stroke="var(--amber)"
        strokeWidth="0.025"
        opacity="0.45"
      />

      <text
        x="0.45"
        y="0.75"
        fill="var(--ink-faint)"
        fontFamily="var(--mono)"
        fontSize="0.3"
        letterSpacing="0.04"
      >
        START
      </text>
      <text
        x={COLS - 0.45}
        y="0.75"
        fill="var(--ink-faint)"
        fontFamily="var(--mono)"
        fontSize="0.3"
        letterSpacing="0.04"
        textAnchor="end"
      >
        GOAL
      </text>
    </svg>
  )
}

const mono = 'var(--mono)'

function FlowDot({
  path,
  reduced,
  duration = 3,
  delay = 0,
  r = 2.2,
}: {
  path: string
  reduced: boolean
  duration?: number
  delay?: number
  r?: number
}) {
  if (reduced) return null

  return (
    <circle r={r} fill="var(--amber)" opacity="0.9">
      <animateMotion
        dur={`${duration}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
      />
    </circle>
  )
}

function AtlasStructure({ reduced }: { reduced: boolean }) {
  const nodes = [
    { title: '2D world', line1: 'bounds + obstacles', line2: 'world.py' },
    { title: 'grid + A*', line1: 'inflate · 8-connected', line2: 'grid.py · search.py' },
    { title: 'PID follower', line1: 'carrot · heading', line2: 'path_follower.py' },
    { title: 'LiDAR + filter', line1: 'odometry · scan match', line2: 'particle_filter.py' },
    { title: 'detect + recover', line1: 'replan · scan · backup', line2: 'supervisor.py' },
  ]

  return (
    <figure className="case__diagram" tabIndex={0}>
      <svg
        viewBox="0 0 640 176"
        role="img"
        aria-label="ATLAS navigation structure: a 2D world becomes an occupancy grid, A* plans a route, a PID follower tracks it, LiDAR and a particle filter estimate pose, and a supervisor detects new obstacles, replans, and recovers when the route is blocked."
      >
        <text x="0" y="12" fill="var(--ink-faint)" fontFamily={mono} fontSize="8" letterSpacing="1">
          NAVIGATION PIPELINE
        </text>

        {nodes.map((node, index) => {
          const x = index * 126
          return (
            <g
              key={node.title}
              className="live-node"
              style={{ animationDelay: `${index * 0.22}s` }}
            >
              <rect
                x={x}
                y="32"
                width="112"
                height="66"
                rx="5"
                fill={index === 3 ? 'rgba(224,160,94,0.06)' : 'rgba(242,239,232,0.025)'}
                stroke={index === 3 ? 'rgba(224,160,94,0.28)' : 'rgba(242,239,232,0.12)'}
              />
              <text x={x + 11} y="51" fill={index === 3 ? 'var(--amber)' : 'var(--ink-soft)'} fontFamily={mono} fontSize="8">
                {node.title}
              </text>
              <text x={x + 11} y="66" fill="var(--ink-faint)" fontFamily={mono} fontSize="7">
                {node.line1}
              </text>
              <text x={x + 11} y="80" fill="var(--ink-faint)" fontFamily={mono} fontSize="7">
                {node.line2}
              </text>
            </g>
          )
        })}

        {nodes.slice(0, -1).map((_, index) => {
          const x1 = index * 126 + 112
          const x2 = (index + 1) * 126
          return (
            <g key={index}>
              <path
                d={`M${x1} 65 H${x2}`}
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth="1"
                className="live-flow"
              />
              <FlowDot
                path={`M${x1} 65 H${x2}`}
                reduced={reduced}
                duration={2.8}
                delay={index * 0.42}
              />
            </g>
          )
        })}

        <text x="0" y="126" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5">
          phase 00–06 / navigation · 179 tests reported in the README
        </text>
        <text x="0" y="145" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5">
          closed loop on estimated pose · replans around new obstacles
        </text>
        <text x="640" y="145" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5" textAnchor="end">
          simulation, not a deployed robot
        </text>
      </svg>
      <figcaption className="mini-diagram__caption">
        Architecture of the implemented Phase 6 pipeline. Motion is illustrative, not live telemetry.
      </figcaption>
    </figure>
  )
}

export function MiniDiagram({
  kind,
}: {
  kind: 'atlas' | 'tokens' | 'signal' | 'frame'
}) {
  const reduced = useReducedMotion()

  if (kind === 'atlas') return <AtlasStructure reduced={reduced} />

  if (kind === 'tokens') {
    const tokens = ['R', 'O', 'M', 'E', 'O', ':']
    const bars = [4, 9, 26, 48, 31, 12]

    return (
      <figure className="case__diagram" tabIndex={0}>
        <svg
          viewBox="0 0 640 170"
          role="img"
          aria-label="Conceptual diagram: six character tokens are embedded and passed through the transformer, producing a next-token probability distribution."
        >
          <text x="0" y="14" fill="var(--ink-faint)" fontFamily={mono} fontSize="9" letterSpacing="1">
            CHARACTERS
          </text>
          {tokens.map((token, index) => (
            <g key={`${token}-${index}`}>
              <rect
                x={index * 34}
                y={28}
                width="26"
                height="30"
                rx="3"
                fill="rgba(242,239,232,0.04)"
                stroke="rgba(242,239,232,0.15)"
              />
              <text
                x={index * 34 + 13}
                y={48}
                fill="var(--ink-soft)"
                fontFamily={mono}
                fontSize="12"
                textAnchor="middle"
              >
                {token}
              </text>
            </g>
          ))}

          <path
            d="M222 43H254"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            className="live-flow"
          />
          <FlowDot path="M222 43H254" reduced={reduced} duration={2.6} />
          <defs>
            <marker id="token-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0L6 3L0 6" fill="none" stroke="var(--ink-faint)" strokeWidth="1" />
            </marker>
          </defs>

          <g className="live-node">
            <rect
              x="258"
              y="22"
              width="120"
              height="42"
              rx="5"
              fill="rgba(224,160,94,0.06)"
              stroke="rgba(224,160,94,0.28)"
            />
            <text x="318" y="40" fill="var(--ink-muted)" fontFamily={mono} fontSize="8" textAnchor="middle">
              EMBEDDING +
            </text>
            <text x="318" y="53" fill="var(--ink-muted)" fontFamily={mono} fontSize="8" textAnchor="middle">
              ATTENTION
            </text>
          </g>

          <path
            d="M382 43H414"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            className="live-flow"
          />
          <FlowDot path="M382 43H414" reduced={reduced} duration={2.6} delay={0.8} />

          <text x="420" y="20" fill="var(--ink-faint)" fontFamily={mono} fontSize="8" letterSpacing="0.6">
            NEXT TOKEN
          </text>
          {bars.map((bar, index) => (
            <rect
              key={index}
              x={420}
              y={26 + index * 20}
              width={bar * 3}
              height="8"
              rx="2"
              fill={index === 3 ? 'var(--amber)' : 'rgba(242,239,232,0.15)'}
              className={index === 3 ? 'live-bar' : undefined}
            />
          ))}
          {['the', 'a', 'I', ' ', 'you', 'and'].map((word, index) => (
            <g key={word}>
              <text
                x="576"
                y={33 + index * 20}
                fill={index === 3 ? 'var(--ink-soft)' : 'var(--ink-faint)'}
                fontFamily={mono}
                fontSize="8"
              >
                {JSON.stringify(word)}
              </text>
              <text
                x="620"
                y={33 + index * 20}
                fill="var(--ink-faint)"
                fontFamily={mono}
                fontSize="8"
                textAnchor="end"
              >
                {bars[index]}%
              </text>
            </g>
          ))}

          <text x="0" y="152" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
            character-level path shown · BPE is an optional alternative
          </text>
        </svg>
        <figcaption className="mini-diagram__caption">
          Conceptual pipeline based on tiny-llm&apos;s default character-level tokenizer.
          Percentages are illustrative, not model output.
        </figcaption>
      </figure>
    )
  }

  if (kind === 'signal') {
    return (
      <figure className="case__diagram" tabIndex={0}>
        <svg
          viewBox="0 0 640 170"
          role="img"
          aria-label="Conceptual diagram of the streaming detector: voice activity detection, sliding windows, CNN and BiLSTM scoring, and exponential moving average smoothing."
        >
          <text x="0" y="14" fill="var(--ink-faint)" fontFamily={mono} fontSize="9" letterSpacing="1">
            AUDIO IN
          </text>
          <path
            d="M0 58H34L42 34L50 78L58 46L66 66L74 52L82 62L90 48L98 70L106 40L114 60L122 50L130 64L138 44L146 72L154 54L162 60H190"
            fill="none"
            stroke="var(--ink-faint)"
            strokeWidth="1"
          />
          <text x="0" y="94" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
            waveform / VAD
          </text>

          <path
            d="M200 58H228"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            className="live-flow"
          />
          <FlowDot path="M200 58H228" reduced={reduced} duration={2.8} />
          <defs>
            <marker id="signal-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0 0L6 3L0 6" fill="none" stroke="var(--ink-faint)" strokeWidth="1" />
            </marker>
          </defs>

          {[0, 1, 2, 3].map((index) => (
            <g
              key={index}
              className={index === 2 ? 'live-window' : undefined}
              style={index === 2 ? { animationDelay: '0.2s' } : undefined}
            >
              <rect
                x={236 + index * 54}
                y="30"
                width="44"
                height="54"
                rx="3"
                fill={index === 2 ? 'rgba(224,160,94,0.08)' : 'rgba(242,239,232,0.025)'}
                stroke={index === 2 ? 'rgba(224,160,94,0.32)' : 'rgba(242,239,232,0.11)'}
              />
              <text
                x={258 + index * 54}
                y="60"
                fill={index === 2 ? 'var(--amber)' : 'var(--ink-faint)'}
                fontFamily={mono}
                fontSize="8"
                textAnchor="middle"
              >
                1.5s
              </text>
            </g>
          ))}
          <text x="236" y="99" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
            sliding windows
          </text>

          <path
            d="M468 58H496"
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            className="live-flow"
          />
          <FlowDot path="M468 58H496" reduced={reduced} duration={2.8} delay={0.6} />
          <g className="live-node">
            <rect
              x="502"
              y="26"
              width="116"
              height="62"
              rx="5"
              fill="rgba(242,239,232,0.025)"
              stroke="rgba(242,239,232,0.12)"
            />
            <text x="560" y="48" fill="var(--ink-muted)" fontFamily={mono} fontSize="8" textAnchor="middle">
              CNN + BiLSTM
            </text>
            <text x="560" y="62" fill="var(--ink-faint)" fontFamily={mono} fontSize="8" textAnchor="middle">
              attention pool
            </text>
            <text x="560" y="76" fill="var(--ink-faint)" fontFamily={mono} fontSize="8" textAnchor="middle">
              P(spoof)
            </text>
          </g>

          <text x="0" y="142" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
            per-window scores → EMA smoothing → alert threshold
          </text>
          <path d="M330 134H640" stroke="rgba(242,239,232,0.08)" strokeWidth="1" />
        </svg>
        <figcaption className="mini-diagram__caption">
          Conceptual signal path. The real pipeline lives in the repository; no accuracy
          result is claimed here.
        </figcaption>
      </figure>
    )
  }

  return (
    <figure className="case__diagram" tabIndex={0}>
      <svg
        viewBox="0 0 640 176"
        role="img"
        aria-label="Diagram of the chat frame: an eight-byte header containing a four-byte JSON length and a four-byte binary length, followed by the JSON payload and raw binary payload. Frames flow from a sender to the server and then to recipients."
      >
        <text x="0" y="10" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5" letterSpacing="0.6">
          sender
        </text>
        <text x="320" y="10" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5" textAnchor="middle" letterSpacing="0.6">
          server
        </text>
        <text x="640" y="10" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5" textAnchor="end" letterSpacing="0.6">
          recipients
        </text>
        <path d="M48 7H300 M340 7H592" fill="none" stroke="var(--line-strong)" strokeWidth="1" className="live-flow" />
        <FlowDot path="M48 7H592" reduced={reduced} duration={4.6} />

        <text x="0" y="30" fill="var(--ink-faint)" fontFamily={mono} fontSize="7.5" letterSpacing="0.8">
          ONE FRAME
        </text>

        <rect x="0" y="40" width="96" height="38" rx="3" fill="rgba(224,160,94,0.1)" stroke="rgba(224,160,94,0.4)" />
        <text x="48" y="56" fill="var(--ink-soft)" fontFamily={mono} fontSize="8" textAnchor="middle">
          json_len
        </text>
        <text x="48" y="68" fill="var(--ink-faint)" fontFamily={mono} fontSize="7" textAnchor="middle">
          4 bytes BE
        </text>

        <rect x="100" y="40" width="96" height="38" rx="3" fill="rgba(224,160,94,0.1)" stroke="rgba(224,160,94,0.4)" />
        <text x="148" y="56" fill="var(--ink-soft)" fontFamily={mono} fontSize="8" textAnchor="middle">
          bin_len
        </text>
        <text x="148" y="68" fill="var(--ink-faint)" fontFamily={mono} fontSize="7" textAnchor="middle">
          4 bytes BE
        </text>

        <rect x="200" y="40" width="250" height="38" rx="3" fill="rgba(242,239,232,0.035)" stroke="rgba(242,239,232,0.14)" />
        <text x="325" y="56" fill="var(--ink-soft)" fontFamily={mono} fontSize="8" textAnchor="middle">
          JSON payload
        </text>
        <text x="325" y="68" fill="var(--ink-faint)" fontFamily={mono} fontSize="7" textAnchor="middle">
          type, user, text, metadata
        </text>

        <rect x="454" y="40" width="186" height="38" rx="3" fill="rgba(242,239,232,0.02)" stroke="rgba(242,239,232,0.12)" strokeDasharray="3 3" />
        <text x="547" y="56" fill="var(--ink-soft)" fontFamily={mono} fontSize="8" textAnchor="middle">
          raw binary
        </text>
        <text x="547" y="68" fill="var(--ink-faint)" fontFamily={mono} fontSize="7" textAnchor="middle">
          file chunk / voice note
        </text>

        <path d="M0 96H640" stroke="rgba(242,239,232,0.08)" strokeWidth="1" />
        <text x="0" y="116" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
          receiver: read 8 bytes → read json_len → read bin_len
        </text>
        <text x="0" y="134" fill="var(--ink-faint)" fontFamily={mono} fontSize="8">
          no message boundaries are assumed from a single recv()
        </text>
      </svg>
      <figcaption className="mini-diagram__caption">
        The framing scheme implemented in protocol.py. Limits: 1 MB JSON, 4 MB binary per frame.
      </figcaption>
    </figure>
  )
}
