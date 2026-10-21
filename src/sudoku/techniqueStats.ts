import { findHiddenSingle, placeDigit } from './candidates'
import { cloneGrid, maskDigits } from './grid'
import { strongLinksForN } from './strongLinks'
import type { CandidateMask, Grid } from './types'

export type TechniqueKey = 'Ns' | 'Os' | 'Nd' | 'Od' | 'Sd' | 'St' | 'Nt' | 'Ot'

export const TECHNIQUE_ORDER: TechniqueKey[] = ['Ns', 'Os', 'Nd', 'Od', 'Sd', 'St', 'Nt', 'Ot']

export const TECHNIQUE_LABEL: Record<TechniqueKey, string> = {
  Ns: 'Naked single — one candidate left in a cell',
  Os: 'Obscured single — one place for a digit in a row, column, or box',
  Nd: 'Naked double — two cells, two digits only (not wired yet)',
  Od: 'Obscured double — two places for one digit (not wired yet)',
  Sd: 'Strong double — digit in exactly two cells in one region',
  St: 'Strong triple — three cells in one region',
  Nt: 'Naked triple (not wired yet)',
  Ot: 'Obscured triple (not wired yet)',
}

export function countNakedSingles(values: Grid, candidates: CandidateMask[]): number {
  let n = 0
  for (let cell = 0; cell < 81; cell++) {
    if (values[cell] !== 0) continue
    if (maskDigits(candidates[cell]).length === 1) n++
  }
  return n
}

export function nakedSingleCells(values: Grid, candidates: CandidateMask[]): number[] {
  const out: number[] = []
  for (let cell = 0; cell < 81; cell++) {
    if (values[cell] !== 0) continue
    if (maskDigits(candidates[cell]).length === 1) out.push(cell)
  }
  return out
}

export function hiddenSingleCells(values: Grid, candidates: CandidateMask[]): number[] {
  const v = cloneGrid(values)
  const c = candidates.slice()
  const cells: number[] = []
  for (;;) {
    const hit = findHiddenSingle(v, c)
    if (!hit) break
    cells.push(hit.cell)
    placeDigit(v, c, hit.cell, hit.digit)
  }
  return cells
}

export function countHiddenSingles(values: Grid, candidates: CandidateMask[]): number {
  return hiddenSingleCells(values, candidates).length
}

export function countStrongDoubles(candidates: CandidateMask[]): number {
  return strongLinksForN(candidates, 2).length
}

export function techniqueCounts(values: Grid, candidates: CandidateMask[]): Record<TechniqueKey, number> {
  return {
    Ns: countNakedSingles(values, candidates),
    Os: countHiddenSingles(values, candidates),
    Nd: 0,
    Od: 0,
    Sd: countStrongDoubles(candidates),
    St: strongLinksForN(candidates, 3).length,
    Nt: 0,
    Ot: 0,
  }
}
