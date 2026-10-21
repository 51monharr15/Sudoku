import { colOf, rowOf } from './grid'
import type { StrongLinkGroup } from './strongLinks'

export type EdgeMark = 'top' | 'bottom' | 'left' | 'right'

export type CellMarks = Partial<Record<EdgeMark, true>>

/** Merge mark maps per cell index. */
export function mergeCellMarks(maps: Map<number, CellMarks>[]): Map<number, CellMarks> {
  const out = new Map<number, CellMarks>()
  for (const m of maps) {
    for (const [cell, marks] of m) {
      const prev = out.get(cell) ?? {}
      out.set(cell, { ...prev, ...marks })
    }
  }
  return out
}

function boxOrigin(boxIndex: number): { br: number; bc: number } {
  const br = Math.floor(boxIndex / 3) * 3
  const bc = (boxIndex % 3) * 3
  return { br, bc }
}

function distToBoxEdge(cell: number, boxIndex: number): {
  top: number
  bottom: number
  left: number
  right: number
} {
  const r = rowOf(cell)
  const c = colOf(cell)
  const { br, bc } = boxOrigin(boxIndex)
  return {
    top: r - br,
    bottom: br + 2 - r,
    left: c - bc,
    right: bc + 2 - c,
  }
}

function marksForColumnPair(cells: number[]): Map<number, CellMarks> {
  const m = new Map<number, CellMarks>()
  for (const cell of cells) {
    m.set(cell, { left: true, right: true })
  }
  return m
}

function marksForRowPair(cells: number[]): Map<number, CellMarks> {
  const m = new Map<number, CellMarks>()
  for (const cell of cells) {
    m.set(cell, { top: true, bottom: true })
  }
  return m
}

function marksForBoxPair(cells: number[], boxIndex: number): Map<number, CellMarks> {
  const m = new Map<number, CellMarks>()
  for (const cell of cells) {
    const d = distToBoxEdge(cell, boxIndex)
    const marks: CellMarks = {}
    if (d.left <= d.right) marks.left = true
    else marks.right = true
    if (d.top <= d.bottom) marks.top = true
    else marks.bottom = true
    m.set(cell, marks)
  }
  return m
}

/** Strong double (two cells): column = side marks; row = top/bottom; box = side + top/bottom toward nearest box edge. */
export function marksForStrongDouble(group: StrongLinkGroup): Map<number, CellMarks> {
  if (group.cells.length !== 2) return new Map()
  const cells = [...group.cells]
  switch (group.unit) {
    case 'col':
      return marksForColumnPair(cells)
    case 'row':
      return marksForRowPair(cells)
    case 'box':
      return marksForBoxPair(cells, group.unitIndex)
    default:
      return new Map()
  }
}

export function allStrongDoubleMarks(groups: StrongLinkGroup[]): Map<number, CellMarks> {
  const parts: Map<number, CellMarks>[] = []
  for (const g of groups) {
    if (g.cells.length === 2) parts.push(marksForStrongDouble(g))
  }
  return mergeCellMarks(parts)
}
