import { findHiddenSingle, placeDigit } from './candidates'
import { cloneGrid, maskDigits } from './grid'
import { strongLinksForN, strongNakedSets } from './strongLinks'
import type { CandidateMask, Grid } from './types'

/** Short code + full title shown in the consequences tab. */
export type TechniqueKey =
  | 'Ns'
  | 'Os'
  | 'Nd'
  | 'Od'
  | 'Nt'
  | 'Ot'
  | 'Nq'
  | 'Oq'
  | 'Sd'
  | 'St'
  | 'Sq'
  | 'Ss'
  | 'pointing'
  | 'locked'
  | 'x_wing'
  | 'xy_wing'
  | 'skyscraper'
  | 'two_string_kite'

export const TECHNIQUE_ROWS: { key: TechniqueKey; title: string }[] = [
  { key: 'Ns', title: 'Naked single' },
  { key: 'Os', title: 'Obscured single' },
  { key: 'Nd', title: 'Naked double' },
  { key: 'Od', title: 'Obscured double' },
  { key: 'Nt', title: 'Naked triple' },
  { key: 'Ot', title: 'Obscured triple' },
  { key: 'Nq', title: 'Naked quad' },
  { key: 'Oq', title: 'Obscured quad' },
  { key: 'Ss', title: 'Strong single (solved cell)' },
  { key: 'Sd', title: 'Strong double' },
  { key: 'St', title: 'Strong triple' },
  { key: 'Sq', title: 'Strong quad (4 cells, those 4 digits only in the unit)' },
  { key: 'pointing', title: 'Pointing pair / triple' },
  { key: 'locked', title: 'Locked candidates' },
  { key: 'x_wing', title: 'X-Wing' },
  { key: 'xy_wing', title: 'XY-Wing' },
  { key: 'skyscraper', title: 'Skyscraper' },
  { key: 'two_string_kite', title: 'Two-string kite' },
]

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

export function countStrongDoubles(candidates: CandidateMask[]): number {
  return strongLinksForN(candidates, 2).length
}

export function techniqueCounts(values: Grid, candidates: CandidateMask[]): Record<TechniqueKey, number> {
  const base: Record<TechniqueKey, number> = {
    Ns: countNakedSingles(values, candidates),
    Os: hiddenSingleCells(values, candidates).length,
    Nd: 0,
    Od: 0,
    Nt: 0,
    Ot: 0,
    Nq: 0,
    Oq: 0,
    Ss: 0,
    Sd: countStrongDoubles(candidates),
    St: strongLinksForN(candidates, 3).length,
    Sq: strongNakedSets(candidates, 4).length,
    pointing: 0,
    locked: 0,
    x_wing: 0,
    xy_wing: 0,
    skyscraper: 0,
    two_string_kite: 0,
  }
  return base
}
