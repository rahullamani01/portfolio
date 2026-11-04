import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import {
  cellsToPathData,
  findPath,
  type Cell,
  type GridDefinition,
  type SearchResult,
} from '../lib/astar'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { ArrowRight } from '../components/Icons'

type Tool = 'wall' | 'start' | 'goal' | 'erase'

const ROWS = 10
const COLS = 16

const TOOLS: Array<{ id: Tool; label: string }> = [
  { id: 'wall', label: 'Wall' },
  { id: 'start', label: 'Start' },
  { id: 'goal', label: 'Goal' },
  { id: 'erase', label: 'Erase' },
]

function blankWalls() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false))
}

function createDefaultGrid(): GridDefinition {
  const walls = blankWalls()

  for (let row = 0; row < ROWS; row += 1) {
    if (row !== 4) walls[row][5] = true
  }
  for (let row = 1; row < ROWS; row += 1) {
    if (row !== 7) walls[row][10] = true
  }

  walls[2][7] = true
  walls[3][7] = true
  walls[2][8] = true
  walls[3][8] = true
  walls[6][12] = true
  walls[7][12] = true
  walls[8][13] = true
  walls[1][13] = true

  return {
    rows: ROWS,
    cols: COLS,
    walls,
    start: { row: 5, col: 1 },
    goal: { row: 4, col: 14 },
  }
}

function createRandomGrid(): GridDefinition {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const walls = blankWalls()
    const start: Cell = { row: 1 + Math.floor(Math.random() * (ROWS - 2)), col: 1 }
    const goal: Cell = {
      row: 1 + Math.floor(Math.random() * (ROWS - 2)),
      col: COLS - 2,
    }

    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const nearStart = Math.abs(row - start.row) <= 1 && col <= 2
        const nearGoal = Math.abs(row - goal.row) <= 1 && col >= COLS - 3
        if (!nearStart && !nearGoal && Math.random() < 0.2) {
          walls[row][col] = true
        }
      }
    }

    const candidate: GridDefinition = { rows: ROWS, cols: COLS, walls, start, goal }
    if (findPath(candidate).found) return candidate
  }

  return createDefaultGrid()
}

const cellKey = (row: number, col: number) => `${row}:${col}`

export function LabSection() {
  const initial = useMemo(() => {
    const grid = createDefaultGrid()
    return { grid, result: findPath(grid) }
  }, [])

  const [grid, setGrid] = useState<GridDefinition>(initial.grid)
  const [result, setResult] = useState<SearchResult | null>(initial.result)
  const [tool, setTool] = useState<Tool>('wall')
  const [focused, setFocused] = useState<Cell>(initial.grid.start)
  const [runId, setRunId] = useState(0)
  const painting = useRef(false)
  const gridRef = useRef(grid)

  const commitGrid = (next: GridDefinition) => {
    gridRef.current = next
    setGrid(next)
    setResult(null)
  }

  useEffect(() => {
    const stopPainting = () => {
      painting.current = false
    }
    window.addEventListener('pointerup', stopPainting)
    window.addEventListener('pointercancel', stopPainting)
    return () => {
      window.removeEventListener('pointerup', stopPainting)
      window.removeEventListener('pointercancel', stopPainting)
    }
  }, [])

  const visited = useMemo(() => {
    const set = new Set<string>()
    result?.visited.forEach((cell) => set.add(cellKey(cell.row, cell.col)))
    return set
  }, [result])

  const pathCells = useMemo(() => {
    const set = new Set<string>()
    result?.path.forEach((cell) => set.add(cellKey(cell.row, cell.col)))
    return set
  }, [result])

  const applyTool = (row: number, col: number) => {
    const current = gridRef.current

    if (tool === 'start') {
      if (current.walls[row][col]) return
      if (row === current.goal.row && col === current.goal.col) return
      if (row === current.start.row && col === current.start.col) return
      commitGrid({ ...current, start: { row, col } })
      setFocused({ row, col })
      return
    }

    if (tool === 'goal') {
      if (current.walls[row][col]) return
      if (row === current.start.row && col === current.start.col) return
      if (row === current.goal.row && col === current.goal.col) return
      commitGrid({ ...current, goal: { row, col } })
      setFocused({ row, col })
      return
    }

    if (
      tool === 'wall' &&
      ((row === current.start.row && col === current.start.col) ||
        (row === current.goal.row && col === current.goal.col))
    ) {
      return
    }

    if (current.walls[row][col] === (tool === 'wall')) return

    const walls = current.walls.map((line) => line.slice())
    walls[row][col] = tool === 'wall'
    commitGrid({ ...current, walls })
  }

  const run = () => {
    setResult(findPath(gridRef.current))
    setRunId((value) => value + 1)
  }

  const reset = () => {
    const next = createDefaultGrid()
    gridRef.current = next
    setGrid(next)
    setResult(findPath(next))
    setFocused(next.start)
    setRunId((value) => value + 1)
  }

  const shuffle = () => {
    const next = createRandomGrid()
    gridRef.current = next
    setGrid(next)
    setResult(findPath(next))
    setFocused(next.start)
    setRunId((value) => value + 1)
  }

  const onCellPointerDown = (row: number, col: number, event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' && (tool === 'wall' || tool === 'erase')) {
      painting.current = true
    }
    applyTool(row, col)
  }

  const onCellPointerEnter = (row: number, col: number) => {
    if (painting.current) applyTool(row, col)
  }

  const moveFocus = (row: number, col: number) => {
    const nextRow = Math.max(0, Math.min(grid.rows - 1, row))
    const nextCol = Math.max(0, Math.min(grid.cols - 1, col))
    setFocused({ row: nextRow, col: nextCol })
    window.requestAnimationFrame(() => {
      document.getElementById(`lab-cell-${nextRow}-${nextCol}`)?.focus()
    })
  }

  const onCellKeyDown = (event: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      applyTool(row, col)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(row - 1, col)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveFocus(row + 1, col)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveFocus(row, col - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveFocus(row, col + 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveFocus(row, 0)
    } else if (event.key === 'End') {
      event.preventDefault()
      moveFocus(row, grid.cols - 1)
    }
  }

  const status = result ? (result.found ? 'found' : 'blocked') : 'ready'
  const statusLabel = result
    ? result.found
      ? `Route found. Cost ${result.cost.toFixed(1)} grid units. ${result.expanded} cells expanded.`
      : `No route from start to goal. ${result.expanded} cells expanded.`
    : 'Ready to run'

  const pathData = result?.found ? cellsToPathData(result.path) : ''

  return (
    <section className="section" id="lab" aria-labelledby="lab-title">
      <div className="container">
        <SectionHeading
          index="03"
          label="Lab"
          headingId="lab-title"
          title={
            <>
              A* on an <em>occupancy grid.</em>
            </>
          }
          intro="A small, inspectable version of the planning idea in ATLAS: rasterise obstacles, search the grid, and reconstruct a path. The algorithm is real; the robot is not."
        />

        <div className="lab-grid">
          <Reveal>
            <div>
              <p className="lab-intro">
                Click a cell to apply the active tool. Draw walls, move the start or
                goal, then run the search. The path, expanded cells, and cost are
                computed in your browser by <strong>the TypeScript planner in this
                site</strong>.
              </p>

              <p className="lab-disclaimer">
                This is not running the ATLAS Python code. It is a browser
                reimplementation of the same Phase 2 idea, and it is not a robot
                controller. Diagonal moves are blocked from cutting through wall
                corners.
              </p>

              <div className="lab-controls">
                <div className="seg-control" role="group" aria-label="Grid editing tool">
                  {TOOLS.map((item) => (
                    <button
                      key={item.id}
                      className="seg-control__btn"
                      type="button"
                      aria-pressed={tool === item.id}
                      onClick={() => setTool(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="lab-actions">
                  <button className="btn btn--sm" type="button" onClick={run}>
                    Run A*
                    <ArrowRight size={13} />
                  </button>
                  <button className="btn btn--sm btn--ghost" type="button" onClick={shuffle}>
                    New layout
                  </button>
                  <button className="btn btn--sm btn--ghost" type="button" onClick={reset}>
                    Reset
                  </button>
                </div>

                <div className="lab-stats" aria-hidden="true">
                  <div className="lab-stat">
                    <span className="lab-stat__label">Path cost</span>
                    <span className="lab-stat__value">
                      {result?.found ? result.cost.toFixed(1) : '—'}
                    </span>
                  </div>
                  <div className="lab-stat">
                    <span className="lab-stat__label">Expanded</span>
                    <span className="lab-stat__value">
                      {result ? result.expanded : '—'}
                    </span>
                  </div>
                  <div className="lab-stat">
                    <span className="lab-stat__label">Waypoints</span>
                    <span className="lab-stat__value">
                      {result?.found ? result.path.length : '—'}
                    </span>
                  </div>
                </div>

                <p className="lab-status" data-state={status} role="status" aria-live="polite">
                  <span className="lab-status__dot" aria-hidden="true" />
                  {statusLabel}
                </p>

                <p className="skills__note" style={{ marginTop: 0 }}>
                  Keyboard: Tab into the grid, use arrow keys to move, press Enter or
                  Space to apply the selected tool. Screen readers get the state of every
                  cell in its label.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="lab-panel">
              <div className="lab-panel__bar" aria-hidden="true">
                <span>grid / {grid.cols} × {grid.rows}</span>
                <span>A* · octile · 8-connected</span>
              </div>

              <div className="lab-stage">
                <div
                  className="search-grid"
                  role="group"
                  aria-label="Interactive occupancy grid. Use arrow keys to move between cells and Enter to apply the selected tool."
                  style={{ '--cols': grid.cols } as CSSProperties}
                >
                  {grid.walls.map((line, row) =>
                    line.map((wall, col) => {
                      const key = cellKey(row, col)
                      const isStart = grid.start.row === row && grid.start.col === col
                      const isGoal = grid.goal.row === row && grid.goal.col === col
                      const isPath = pathCells.has(key)
                      const isVisited = visited.has(key) && !isPath
                      const state = [
                        wall ? 'wall' : 'open',
                        isStart ? 'start' : '',
                        isGoal ? 'goal' : '',
                      ]
                        .filter(Boolean)
                        .join(', ')

                      return (
                        <button
                          key={key}
                          id={`lab-cell-${row}-${col}`}
                          className="search-cell"
                          type="button"
                          tabIndex={focused.row === row && focused.col === col ? 0 : -1}
                          data-wall={wall}
                          data-start={isStart}
                          data-goal={isGoal}
                          data-path={isPath}
                          data-visited={isVisited}
                          aria-label={`Row ${row + 1}, column ${col + 1}: ${state}`}
                          onFocus={() => setFocused({ row, col })}
                          onPointerDown={(event) => onCellPointerDown(row, col, event)}
                          onPointerEnter={() => onCellPointerEnter(row, col)}
                          onKeyDown={(event) => onCellKeyDown(event, row, col)}
                        />
                      )
                    }),
                  )}
                </div>

                <svg
                  className="search-overlay"
                  viewBox={`0 0 ${grid.cols} ${grid.rows}`}
                  aria-hidden="true"
                >
                  {pathData && (
                    <>
                      <path
                        key={`glow-${runId}`}
                        d={pathData}
                        className="search-overlay__path search-overlay__path--glow"
                      />
                      <path
                        key={`path-${runId}`}
                        d={pathData}
                        className="search-overlay__path search-overlay__path--animate"
                        pathLength="1"
                      />
                    </>
                  )}
                  <circle
                    className="search-overlay__start"
                    cx={grid.start.col + 0.5}
                    cy={grid.start.row + 0.5}
                    r="0.27"
                  />
                  <circle
                    className="search-overlay__goal-ring"
                    cx={grid.goal.col + 0.5}
                    cy={grid.goal.row + 0.5}
                    r="0.4"
                  />
                  <circle
                    className="search-overlay__goal"
                    cx={grid.goal.col + 0.5}
                    cy={grid.goal.row + 0.5}
                    r="0.21"
                  />
                </svg>
              </div>

              <div className="lab-legend" aria-hidden="true">
                <span><i className="is-wall" /> wall</span>
                <span><i className="is-visited" /> expanded</span>
                <span><i className="is-path" /> path</span>
                <span><i /> start / goal</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
