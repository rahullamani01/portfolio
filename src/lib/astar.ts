export interface Cell {
  row: number
  col: number
}

export interface GridDefinition {
  rows: number
  cols: number
  walls: boolean[][]
  start: Cell
  goal: Cell
}

export interface SearchResult {
  found: boolean
  path: Cell[]
  cost: number
  expanded: number
  visited: Cell[]
}

interface QueueNode {
  row: number
  col: number
  g: number
  f: number
  h: number
}

class MinHeap {
  private items: QueueNode[] = []

  get size() {
    return this.items.length
  }

  push(node: QueueNode) {
    const items = this.items
    items.push(node)
    let index = items.length - 1

    while (index > 0) {
      const parent = (index - 1) >> 1
      if (!this.less(items[index], items[parent])) break
      ;[items[index], items[parent]] = [items[parent], items[index]]
      index = parent
    }
  }

  pop(): QueueNode | undefined {
    const items = this.items
    if (items.length === 0) return undefined
    const root = items[0]
    const last = items.pop()!

    if (items.length > 0) {
      items[0] = last
      let index = 0

      while (true) {
        const left = index * 2 + 1
        const right = left + 1
        let smallest = index

        if (left < items.length && this.less(items[left], items[smallest])) {
          smallest = left
        }
        if (right < items.length && this.less(items[right], items[smallest])) {
          smallest = right
        }
        if (smallest === index) break
        ;[items[index], items[smallest]] = [items[smallest], items[index]]
        index = smallest
      }
    }

    return root
  }

  private less(a: QueueNode, b: QueueNode) {
    if (a.f !== b.f) return a.f < b.f
    return a.h < b.h
  }
}

const KEY = (row: number, col: number) => `${row}:${col}`

const octile = (row: number, col: number, goal: Cell) => {
  const dr = Math.abs(row - goal.row)
  const dc = Math.abs(col - goal.col)
  return dr + dc + (Math.SQRT2 - 2) * Math.min(dr, dc)
}

export function findPath(grid: GridDefinition): SearchResult {
  const { rows, cols, walls, start, goal } = grid

  const inBounds = (row: number, col: number) =>
    row >= 0 && col >= 0 && row < rows && col < cols

  if (
    !inBounds(start.row, start.col) ||
    !inBounds(goal.row, goal.col) ||
    walls[start.row]?.[start.col] ||
    walls[goal.row]?.[goal.col]
  ) {
    return { found: false, path: [], cost: 0, expanded: 0, visited: [] }
  }

  if (start.row === goal.row && start.col === goal.col) {
    return { found: true, path: [{ ...start }], cost: 0, expanded: 1, visited: [{ ...start }] }
  }

  const open = new MinHeap()
  const bestCost = new Map<string, number>()
  const parent = new Map<string, string | null>()
  const closed = new Set<string>()
  const visited: Cell[] = []

  const startKey = KEY(start.row, start.col)
  bestCost.set(startKey, 0)
  parent.set(startKey, null)
  open.push({
    row: start.row,
    col: start.col,
    g: 0,
    f: octile(start.row, start.col, goal),
    h: octile(start.row, start.col, goal),
  })

  let expanded = 0

  while (open.size > 0) {
    const current = open.pop()!
    const currentKey = KEY(current.row, current.col)

    if (closed.has(currentKey)) continue
    const knownBest = bestCost.get(currentKey)
    if (knownBest !== undefined && current.g > knownBest) continue

    closed.add(currentKey)
    expanded += 1
    visited.push({ row: current.row, col: current.col })

    if (current.row === goal.row && current.col === goal.col) {
      const path: Cell[] = []
      let cursor: string | null = currentKey

      while (cursor !== null) {
        const [row, col] = cursor.split(':').map(Number)
        path.push({ row, col })
        cursor = parent.get(cursor) ?? null
      }

      path.reverse()
      return {
        found: true,
        path,
        cost: current.g,
        expanded,
        visited,
      }
    }

    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue

        const row = current.row + dr
        const col = current.col + dc
        if (!inBounds(row, col) || walls[row][col]) continue

        const diagonal = dr !== 0 && dc !== 0
        if (diagonal) {
          // A diagonal move may not cut across the corner of a wall.
          if (walls[current.row][col] || walls[row][current.col]) continue
        }

        const neighbourKey = KEY(row, col)
        if (closed.has(neighbourKey)) continue

        const step = diagonal ? Math.SQRT2 : 1
        const nextCost = current.g + step
        const previous = bestCost.get(neighbourKey)

        if (previous !== undefined && nextCost >= previous) continue

        bestCost.set(neighbourKey, nextCost)
        parent.set(neighbourKey, currentKey)
        const h = octile(row, col, goal)
        open.push({ row, col, g: nextCost, f: nextCost + h, h })
      }
    }
  }

  return { found: false, path: [], cost: 0, expanded, visited }
}

export function cellsToPathData(path: Cell[]) {
  if (path.length === 0) return ''
  return path
    .map((cell, index) => `${index === 0 ? 'M' : 'L'} ${cell.col + 0.5} ${cell.row + 0.5}`)
    .join(' ')
}
