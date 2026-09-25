import { describe, expect, it } from 'vitest'
import { computeCandidates } from './candidates'
import { importPuzzle, SAMPLE_PUZZLE } from './import'
import { analyzeProposedMove } from './implications'
import { isValidPlacement, validateGrid } from './grid'
import type { Digit } from './types'

describe('importPuzzle', () => {
  it('parses 81-character SDK string', () => {
    const { values, givens, format } = importPuzzle(SAMPLE_PUZZLE)
    expect(values.length).toBe(81)
    expect(givens.filter(Boolean).length).toBeGreaterThan(20)
    expect(format).toContain('81')
    expect(validateGrid(values)).toBe(true)
  })

  it('parses nine lines', () => {
    const lines = `5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
. . . | . 6 . | . . 3
. . . | . . . | . . .
. . . | . . . | . . .
. . . | . . . | . . .
. . . | . . . | . . .
. . . | . . . | . . .`
    const { values } = importPuzzle(lines)
    expect(values[0]).toBe(5)
    expect(values[2]).toBe(0)
  })
})

describe('candidates', () => {
  it('computes pencil marks for empty cells', () => {
    const { values } = importPuzzle(SAMPLE_PUZZLE)
    const cands = computeCandidates(values)
    const empty = values.findIndex((v) => v === 0)
    const filled = values.findIndex((v) => v !== 0)
    expect(cands[filled]).toBe(0)
    expect(cands[empty]).not.toBe(0)
  })
})

describe('analyzeProposedMove', () => {
  it('builds a chain with at least the proposed step', () => {
    const { values } = importPuzzle(SAMPLE_PUZZLE)
    const cell = values.findIndex((v) => v === 0)
    let digit: Digit | null = null
    for (let d = 1; d <= 9; d++) {
      if (isValidPlacement(values, cell, d as Digit)) {
        digit = d as Digit
        break
      }
    }
    expect(digit).not.toBeNull()
    const analysis = analyzeProposedMove(values, cell, digit!)
    expect(analysis.valid).toBe(true)
    expect(analysis.steps[0].kind).toBe('proposed')
  })

  it('rejects conflicting placement', () => {
    const { values } = importPuzzle(SAMPLE_PUZZLE)
    const analysis = analyzeProposedMove(values, 0, 5)
    expect(analysis.valid).toBe(false)
  })
})
