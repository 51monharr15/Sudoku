import type { Digit, Grid } from './types'

export type { Grid } from './types'

export const SIZE = 9
export const CELL_COUNT = 81

export function rowOf(cell: number): number {
  return Math.floor(cell / SIZE)
}

export function colOf(cell: number): number {
  return cell % SIZE
}

export function boxOf(cell: number): number {
  return Math.floor(rowOf(cell) / 3) * 3 + Math.floor(colOf(cell) / 3)
}

export function cellIndex(row: number, col: number): number {
  return row * SIZE + col
}

export function peersOf(cell: number): number[] {
  const r = rowOf(cell)
  const c = colOf(cell)
  const b = boxOf(cell)
  const set = new Set<number>()
  for (let i = 0; i < SIZE; i++) {
    if (i !== c) set.add(cellIndex(r, i))
    if (i !== r) set.add(cellIndex(i, c))
  }
  const br = Math.floor(b / 3) * 3
  const bc = (b % 3) * 3
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const idx = cellIndex(br + dr, bc + dc)
      if (idx !== cell) set.add(idx)
    }
  }
  return [...set]
}

export function unitCells(unit: 'row' | 'col' | 'box', index: number): number[] {
  const cells: number[] = []
  if (unit === 'row') {
    for (let c = 0; c < SIZE; c++) cells.push(cellIndex(index, c))
  } else if (unit === 'col') {
    for (let r = 0; r < SIZE; r++) cells.push(cellIndex(r, index))
  } else {
    const br = Math.floor(index / 3) * 3
    const bc = (index % 3) * 3
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        cells.push(cellIndex(br + dr, bc + dc))
      }
    }
  }
  return cells
}

export function emptyGrid(): Grid {
  return Array(CELL_COUNT).fill(0) as Grid
}

export function cloneGrid(g: Grid): Grid {
  return [...g] as Grid
}

export function digitInUnit(values: Grid, unit: 'row' | 'col' | 'box', index: number, d: Digit): boolean {
  for (const cell of unitCells(unit, index)) {
    if (values[cell] === d) return true
  }
  return false
}

export function isValidPlacement(values: Grid, cell: number, d: Digit): boolean {
  if (values[cell] !== 0) return false
  const r = rowOf(cell)
  const c = colOf(cell)
  const b = boxOf(cell)
  if (digitInUnit(values, 'row', r, d)) return false
  if (digitInUnit(values, 'col', c, d)) return false
  if (digitInUnit(values, 'box', b, d)) return false
  return true
}

export function gridToString(values: Grid): string {
  return values.map((v) => (v === 0 ? '.' : String(v))).join('')
}

export function maskHas(mask: number, d: Digit): boolean {
  return (mask & (1 << d)) !== 0
}

export function maskDigits(mask: number): Digit[] {
  const out: Digit[] = []
  for (let d = 1; d <= 9; d++) {
    if (maskHas(mask, d as Digit)) out.push(d as Digit)
  }
  return out
}

export function maskRemove(mask: number, d: Digit): number {
  return mask & ~(1 << d)
}

export function maskOnly(d: Digit): number {
  return 1 << d
}

export function maskCount(mask: number): number {
  let n = 0
  for (let d = 1; d <= 9; d++) {
    if (maskHas(mask, d as Digit)) n++
  }
  return n
}

export function isSolved(values: Grid): boolean {
  return values.every((v) => v !== 0)
}

export function conflictingCells(values: Grid, cell: number): number[] {
  const v = values[cell]
  if (v === 0) return []
  const conflicts: number[] = []
  for (const p of peersOf(cell)) {
    if (values[p] === v) conflicts.push(p)
  }
  return conflicts
}

export function validateGrid(values: Grid): boolean {
  for (let i = 0; i < CELL_COUNT; i++) {
    if (values[i] !== 0 && conflictingCells(values, i).length > 0) return false
  }
  return true
}
