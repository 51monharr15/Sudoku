import { maskHas } from './grid'
import { unitCells } from './grid'
import type { CandidateMask, Digit } from './types'

export type StrongLinkKind = 'hidden' | 'naked'

export interface StrongLinkGroup {
  kind: StrongLinkKind
  unit: 'row' | 'col' | 'box'
  unitIndex: number
  cells: number[]
  /** Digits involved in this link (size n for naked/hidden n-set) */
  digits: Digit[]
}

function cellsWithDigitInUnit(
  candidates: CandidateMask[],
  unitCellsList: number[],
  digit: Digit,
): number[] {
  return unitCellsList.filter((c) => maskHas(candidates[c], digit))
}

/** Digit appears as candidate in exactly n cells in the unit (hidden n-set for that digit). */
export function findHiddenStrongLinksForDigit(
  candidates: CandidateMask[],
  digit: Digit,
  n: 2 | 3 | 4,
): StrongLinkGroup[] {
  const out: StrongLinkGroup[] = []
  const units: { unit: 'row' | 'col' | 'box'; index: number }[] = []
  for (let i = 0; i < 9; i++) {
    units.push({ unit: 'row', index: i })
    units.push({ unit: 'col', index: i })
    units.push({ unit: 'box', index: i })
  }
  for (const { unit, index } of units) {
    const cells = unitCells(unit, index)
    const withD = cellsWithDigitInUnit(candidates, cells, digit)
    if (withD.length === n) {
      out.push({ kind: 'hidden', unit, unitIndex: index, cells: withD, digits: [digit] })
    }
  }
  return out
}

function comboIndices(size: number, n: number): number[][] {
  const res: number[][] = []
  const buf: number[] = []
  function go(start: number) {
    if (buf.length === n) {
      res.push([...buf])
      return
    }
    for (let i = start; i < size; i++) {
      buf.push(i)
      go(i + 1)
      buf.pop()
    }
  }
  go(0)
  return res
}

function unionCandidates(candidates: CandidateMask[], cells: number[]): number {
  let u = 0
  for (const c of cells) u |= candidates[c]
  return u
}

function popcount(x: number): number {
  let n = 0
  for (let d = 1; d <= 9; d++) if (x & (1 << d)) n++
  return n
}

/** n cells whose union of candidates has exactly n digits (naked n-set). */
export function findNakedStrongLinks(
  candidates: CandidateMask[],
  n: 2 | 3 | 4,
  filterDigits?: Digit[],
): StrongLinkGroup[] {
  const out: StrongLinkGroup[] = []
  const units: { unit: 'row' | 'col' | 'box'; index: number }[] = []
  for (let i = 0; i < 9; i++) {
    units.push({ unit: 'row', index: i })
    units.push({ unit: 'col', index: i })
    units.push({ unit: 'box', index: i })
  }

  for (const { unit, index } of units) {
    const all = unitCells(unit, index).filter((c) => candidates[c] !== 0)
    if (all.length < n) continue
    for (const combo of comboIndices(all.length, n)) {
      const cells = combo.map((i) => all[i])
      const union = unionCandidates(candidates, cells)
      if (popcount(union) !== n) continue
      const digits: Digit[] = []
      for (let d = 1; d <= 9; d++) {
        if (union & (1 << d)) digits.push(d as Digit)
      }
      if (filterDigits && !filterDigits.some((fd) => digits.includes(fd))) continue
      // Naked n-set: none of these digits may appear in any other cell in the unit.
      let valid = true
      for (const c of all) {
        if (cells.includes(c)) continue
        if ((candidates[c] & union) !== 0) {
          valid = false
          break
        }
      }
      if (valid) {
        out.push({ kind: 'naked', unit, unitIndex: index, cells, digits })
      }
    }
  }
  return out
}

/** Four cells whose only candidates in the unit are those four digits (naked quad), etc. */
export function strongNakedSets(candidates: CandidateMask[], n: 2 | 3 | 4): StrongLinkGroup[] {
  return findNakedStrongLinks(candidates, n)
}

export function strongLinksForN(candidates: CandidateMask[], n: 2 | 3 | 4): StrongLinkGroup[] {
  const groups: StrongLinkGroup[] = []
  const seen = new Set<string>()
  const key = (g: StrongLinkGroup) =>
    `${g.kind}-${g.unit}-${g.unitIndex}-${g.cells.join(',')}-${g.digits.join(',')}`

  for (let d = 1; d <= 9; d++) {
    for (const g of findHiddenStrongLinksForDigit(candidates, d as Digit, n)) {
      const k = key(g)
      if (!seen.has(k)) {
        seen.add(k)
        groups.push(g)
      }
    }
  }
  for (const g of findNakedStrongLinks(candidates, n)) {
    const k = key(g)
    if (!seen.has(k)) {
      seen.add(k)
      groups.push(g)
    }
  }
  return groups
}
