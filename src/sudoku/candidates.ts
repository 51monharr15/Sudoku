import { maskCount, maskDigits, maskHas, maskRemove, peersOf } from './grid'
import { ALL_CANDIDATES, type CandidateMask, type Digit, type Grid } from './types'

function usedDigitsInPeers(values: Grid, cell: number): number {
  let used = 0
  for (const p of peersOf(cell)) {
    const v = values[p]
    if (v !== 0) used |= 1 << v
  }
  return used
}

/** Auto-generated pencil marks from placed values only */
export function computeCandidates(values: Grid): CandidateMask[] {
  const masks: CandidateMask[] = []
  for (let cell = 0; cell < 81; cell++) {
    if (values[cell] !== 0) {
      masks.push(0)
      continue
    }
    const used = usedDigitsInPeers(values, cell)
    masks.push(ALL_CANDIDATES & ~used)
  }
  return masks
}

export function candidatesForCell(values: Grid, cell: number): Digit[] {
  if (values[cell] !== 0) return []
  const used = usedDigitsInPeers(values, cell)
  return maskDigits(ALL_CANDIDATES & ~used)
}

export function eliminateFromPeers(
  values: Grid,
  candidates: CandidateMask[],
  cell: number,
  digit: Digit,
): { changed: boolean; eliminations: { cell: number; digit: Digit }[] } {
  const eliminations: { cell: number; digit: Digit }[] = []
  let changed = false
  for (const p of peersOf(cell)) {
    if (values[p] !== 0) continue
    if (maskHas(candidates[p], digit)) {
      candidates[p] = maskRemove(candidates[p], digit)
      eliminations.push({ cell: p, digit })
      changed = true
    }
  }
  return { changed, eliminations }
}

export function findNakedSingle(
  values: Grid,
  candidates: CandidateMask[],
): { cell: number; digit: Digit } | null {
  for (let cell = 0; cell < 81; cell++) {
    if (values[cell] !== 0) continue
    if (maskCount(candidates[cell]) === 1) {
      const [digit] = maskDigits(candidates[cell])
      return { cell, digit }
    }
  }
  return null
}

function hiddenSingleInUnit(
  values: Grid,
  candidates: CandidateMask[],
  unit: 'row' | 'col' | 'box',
  cells: number[],
): { cell: number; digit: Digit; unit: 'row' | 'col' | 'box' } | null {
  for (let d = 1; d <= 9; d++) {
    const digit = d as Digit
    let foundCell = -1
    let count = 0
    for (const cell of cells) {
      if (values[cell] !== 0) continue
      if (maskHas(candidates[cell], digit)) {
        count++
        foundCell = cell
      }
    }
    if (count === 1 && foundCell >= 0) {
      return { cell: foundCell, digit, unit }
    }
  }
  return null
}

export function findHiddenSingle(
  values: Grid,
  candidates: CandidateMask[],
): { cell: number; digit: Digit; unit: 'row' | 'col' | 'box' } | null {
  for (let r = 0; r < 9; r++) {
    const cells = Array.from({ length: 9 }, (_, c) => r * 9 + c)
    const hit = hiddenSingleInUnit(values, candidates, 'row', cells)
    if (hit) return hit
  }
  for (let c = 0; c < 9; c++) {
    const cells = Array.from({ length: 9 }, (_, r) => r * 9 + c)
    const hit = hiddenSingleInUnit(values, candidates, 'col', cells)
    if (hit) return hit
  }
  for (let b = 0; b < 9; b++) {
    const br = Math.floor(b / 3) * 3
    const bc = (b % 3) * 3
    const cells: number[] = []
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        cells.push((br + dr) * 9 + (bc + dc))
      }
    }
    const hit = hiddenSingleInUnit(values, candidates, 'box', cells)
    if (hit) return hit
  }
  return null
}

export function placeDigit(
  values: Grid,
  candidates: CandidateMask[],
  cell: number,
  digit: Digit,
): void {
  values[cell] = digit
  candidates[cell] = 0
  for (const p of peersOf(cell)) {
    if (values[p] === 0) {
      candidates[p] = maskRemove(candidates[p], digit)
    }
  }
}
