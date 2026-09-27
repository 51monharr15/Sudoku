import { findHiddenSingle, placeDigit } from './candidates'
import { cloneGrid, colOf, maskDigits, maskHas, rowOf } from './grid'
import type { CandidateMask, ChainStep, Digit, Grid } from './types'

let nextId = 0
function id(): number {
  return nextId++
}

export function resetConsequenceIds(): void {
  nextId = 0
}

function label(cell: number): string {
  return `R${rowOf(cell) + 1}C${colOf(cell) + 1}`
}

function allNakedSingles(
  values: Grid,
  candidates: CandidateMask[],
): { cell: number; digit: Digit }[] {
  const out: { cell: number; digit: Digit }[] = []
  for (let cell = 0; cell < 81; cell++) {
    if (values[cell] !== 0) continue
    const d = maskDigits(candidates[cell])
    if (d.length === 1) out.push({ cell, digit: d[0] })
  }
  return out
}

function allHiddenSingles(
  values: Grid,
  candidates: CandidateMask[],
): { cell: number; digit: Digit; unit: string }[] {
  const out: { cell: number; digit: Digit; unit: string }[] = []
  const v = cloneGrid(values)
  const c = candidates.slice()
  for (;;) {
    const hit = findHiddenSingle(v, c)
    if (!hit) break
    out.push({ cell: hit.cell, digit: hit.digit, unit: hit.unit })
    placeDigit(v, c, hit.cell, hit.digit)
  }
  return out
}

/** Ordered CL for prototype (extend with pairs, wings, …). */
export function buildConsequenceList(
  values: Grid,
  candidates: CandidateMask[],
): ChainStep[] {
  resetConsequenceIds()
  const steps: ChainStep[] = []
  const candCopy = candidates.slice()

  for (const { cell, digit } of allNakedSingles(values, candCopy)) {
    steps.push({
      id: id(),
      kind: 'naked_single',
      cell,
      digit,
      reason: `Naked single: ${digit} only in ${label(cell)}`,
      parentId: -1,
      relatedCells: [],
    })
  }

  for (const { cell, digit, unit } of allHiddenSingles(values, candCopy)) {
    steps.push({
      id: id(),
      kind: 'hidden_single',
      cell,
      digit,
      reason: `Hidden single: ${digit} only in ${unit} → ${label(cell)}`,
      parentId: -1,
      relatedCells: [],
    })
  }

  return steps
}

export function stepHighlightCells(step: ChainStep): number[] {
  return [step.cell, ...step.relatedCells]
}

export function countTechniques(steps: ChainStep[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const s of steps) {
    counts[s.kind] = (counts[s.kind] ?? 0) + 1
  }
  return counts
}

export function cellCandidateCount(candidates: CandidateMask[], cell: number): number {
  return maskDigits(candidates[cell]).length
}

export function toggleCandidateMask(
  mask: CandidateMask,
  digit: Digit,
  auto: CandidateMask,
): CandidateMask {
  if (!maskHas(auto, digit)) return mask
  if (maskHas(mask, digit)) return mask & ~(1 << digit)
  return mask | (1 << digit)
}
