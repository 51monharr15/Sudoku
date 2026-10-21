import { emptyGrid } from './grid'
import type { Grid, PuzzleImportResult } from './types'

const DIGIT = /[1-9]/
const EMPTY = /[0.\-_?]/i

function parse81Flat(text: string): Grid | null {
  const chars = text.replace(/\s/g, '').split('')
  if (chars.length !== 81) return null
  const values = emptyGrid()
  for (let i = 0; i < 81; i++) {
    const ch = chars[i]
    if (DIGIT.test(ch)) values[i] = parseInt(ch, 10) as Grid[number]
    else if (EMPTY.test(ch)) values[i] = 0
    else return null
  }
  return values
}

function parseNineLines(text: string): Grid | null {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))
  if (lines.length !== 9) return null
  const values = emptyGrid()
  for (let r = 0; r < 9; r++) {
    const rowChars = lines[r].replace(/[^0-9.\-_?]/gi, '')
    if (rowChars.length !== 9) return null
    for (let c = 0; c < 9; c++) {
      const ch = rowChars[c]
      const i = r * 9 + c
      if (DIGIT.test(ch)) values[i] = parseInt(ch, 10) as Grid[number]
      else if (EMPTY.test(ch)) values[i] = 0
      else return null
    }
  }
  return values
}

/** Sudoku Exchange / 81-char row-major string and common variants */
export function importPuzzle(raw: string): PuzzleImportResult {
  const warnings: string[] = []
  let text = raw.trim()

  if (text.startsWith('#')) {
    const body = text
      .split(/\r?\n/)
      .filter((l) => !l.trim().startsWith('#'))
      .join('\n')
    text = body.trim()
    warnings.push('Stripped comment/header lines')
  }

  let values: Grid | null = null
  let format = 'unknown'

  const flat = text.replace(/\s/g, '')
  if (flat.length === 81 && !text.includes('\n')) {
    values = parse81Flat(flat)
    format = '81-character (Sudoku Exchange / SDK)'
  }

  if (!values && text.includes('\n')) {
    values = parseNineLines(text)
    format = '9-line grid'
  }

  if (!values && flat.length >= 81) {
    const m = flat.match(/^[\d.\-_?]{81}/)
    if (m) {
      values = parse81Flat(m[0])
      format = '81-character (embedded in text)'
      warnings.push('Used first 81 puzzle characters from longer input')
    }
  }

  if (!values) {
    throw new Error(
      'Could not parse puzzle. Paste 81 characters (0/. for empty) or 9 lines of 9 symbols.',
    )
  }

  const givens = values.map((v) => v !== 0)

  return { values, givens, format, warnings }
}

export const SAMPLE_PUZZLE =
  '009030820438092067000080900080320019391800000246719008973200080060078090804963000'
