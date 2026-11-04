import { describe, expect, it } from 'vitest'
import { findPath, type Cell, type GridDefinition } from './astar'

function grid(
  rows: number,
  cols: number,
  walls: Array<[number, number]> = [],
  start: Cell = { row: 0, col: 0 },
  goal: Cell = { row: rows - 1, col: cols - 1 },
): GridDefinition {
  const cells = Array.from({ length: rows }, () => Array(cols).fill(false))
  for (const [row, col] of walls) cells[row][col] = true
  return { rows, cols, walls: cells, start, goal }
}

describe('findPath', () => {
  it('finds a straight path across an empty grid', () => {
    const result = findPath(grid(3, 3))
    expect(result.found).toBe(true)
    expect(result.cost).toBeCloseTo(2 * Math.SQRT2)
    expect(result.path[0]).toEqual({ row: 0, col: 0 })
    expect(result.path.at(-1)).toEqual({ row: 2, col: 2 })
  })

  it('returns a single-cell path when start equals goal', () => {
    const result = findPath(
      grid(3, 3, [], { row: 1, col: 1 }, { row: 1, col: 1 }),
    )
    expect(result.found).toBe(true)
    expect(result.path).toHaveLength(1)
    expect(result.cost).toBe(0)
  })

  it('routes around a wall', () => {
    const result = findPath(
      grid(
        5,
        5,
        [
          [1, 1],
          [1, 2],
          [1, 3],
          [2, 3],
          [3, 3],
        ],
        { row: 0, col: 0 },
        { row: 4, col: 4 },
      ),
    )
    expect(result.found).toBe(true)
    expect(result.path.some((cell) => cell.row === 1 && cell.col === 2)).toBe(false)
  })

  it('does not cut a diagonal through two blocking walls', () => {
    const result = findPath(
      grid(
        2,
        2,
        [
          [0, 1],
          [1, 0],
        ],
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ),
    )
    expect(result.found).toBe(false)
    expect(result.path).toHaveLength(0)
  })

  it('reports unreachable goals honestly', () => {
    const result = findPath(
      grid(
        5,
        5,
        [
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1],
          [4, 1],
        ],
        { row: 2, col: 0 },
        { row: 2, col: 4 },
      ),
    )
    expect(result.found).toBe(false)
    expect(result.expanded).toBeGreaterThan(0)
  })

  it('treats a wall on the start or goal as invalid', () => {
    const result = findPath(
      grid(4, 4, [[0, 0]], { row: 0, col: 0 }, { row: 3, col: 3 }),
    )
    expect(result.found).toBe(false)
    expect(result.expanded).toBe(0)
  })
})
