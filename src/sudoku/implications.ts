import { cloneGrid, colOf, isValidPlacement, peersOf, rowOf } from './grid'
import {
  computeCandidates,
  findHiddenSingle,
  findNakedSingle,
  placeDigit,
} from './candidates'
import type { ChainStep, Digit, Grid, ProposedMoveAnalysis } from './types'

let stepId = 0

function nextStepId(): number {
  return stepId++
}

function resetStepIds(): void {
  stepId = 0
}

function cellLabel(cell: number): string {
  return `R${rowOf(cell) + 1}C${colOf(cell) + 1}`
}

export function analyzeProposedMove(
  baseValues: Grid,
  cell: number,
  digit: Digit,
): ProposedMoveAnalysis {
  resetStepIds()
  const highlights = new Map<number, 'proposed' | 'elimination' | 'forced' | 'peer'>()
  const eliminations = new Map<number, Digit[]>()
  const steps: ChainStep[] = []

  if (baseValues[cell] !== 0) {
    return {
      valid: false,
      error: `${cellLabel(cell)} is already filled`,
      resultValues: cloneGrid(baseValues),
      resultCandidates: computeCandidates(baseValues),
      steps: [],
      highlights,
      eliminations,
    }
  }

  if (!isValidPlacement(baseValues, cell, digit)) {
    return {
      valid: false,
      error: `${digit} conflicts with row, column, or box at ${cellLabel(cell)}`,
      resultValues: cloneGrid(baseValues),
      resultCandidates: computeCandidates(baseValues),
      steps: [],
      highlights,
      eliminations,
    }
  }

  const values = cloneGrid(baseValues)
  const candidates = computeCandidates(values)
  const rootId = nextStepId()

  highlights.set(cell, 'proposed')
  steps.push({
    id: rootId,
    kind: 'proposed',
    cell,
    digit,
    reason: `Place ${digit} in ${cellLabel(cell)}`,
    parentId: -1,
    relatedCells: peersOf(cell),
  })

  const baseCandidates = computeCandidates(baseValues)

  placeDigit(values, candidates, cell, digit)

  for (const p of peersOf(cell)) {
    if (baseValues[p] === 0) {
      const before = baseCandidates[p]
      const after = candidates[p]
      const removed: Digit[] = []
      for (let d = 1; d <= 9; d++) {
        const dig = d as Digit
        if ((before & (1 << d)) !== 0 && (after & (1 << d)) === 0) {
          removed.push(dig)
        }
      }
      if (removed.length > 0) {
        eliminations.set(p, removed)
        highlights.set(p, 'elimination')
        steps.push({
          id: nextStepId(),
          kind: 'eliminate',
          cell: p,
          digit: removed[0],
          reason: `Remove ${removed.join(', ')} from ${cellLabel(p)} (same row/col/box)`,
          parentId: rootId,
          relatedCells: [cell],
        })
      } else {
        highlights.set(p, 'peer')
      }
    }
  }

  let lastParentId = rootId
  let progressed = true

  while (progressed) {
    progressed = false

    const naked = findNakedSingle(values, candidates)
    if (naked) {
      const { cell: c, digit: d } = naked
      placeDigit(values, candidates, c, d)
      const id = nextStepId()
      highlights.set(c, 'forced')
      steps.push({
        id,
        kind: 'naked_single',
        cell: c,
        digit: d,
        reason: `Naked single: only ${d} fits in ${cellLabel(c)}`,
        parentId: lastParentId,
        relatedCells: peersOf(c),
      })
      lastParentId = id
      progressed = true
      continue
    }

    const hidden = findHiddenSingle(values, candidates)
    if (hidden) {
      const { cell: c, digit: d, unit } = hidden
      placeDigit(values, candidates, c, d)
      const id = nextStepId()
      highlights.set(c, 'forced')
      steps.push({
        id,
        kind: 'hidden_single',
        cell: c,
        digit: d,
        reason: `Hidden single: ${d} only once in ${unit} → ${cellLabel(c)}`,
        parentId: lastParentId,
        relatedCells: peersOf(c),
      })
      lastParentId = id
      progressed = true
    }
  }

  return {
    valid: true,
    resultValues: values,
    resultCandidates: candidates,
    steps,
    highlights,
    eliminations,
  }
}
