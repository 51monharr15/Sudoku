import { useMemo } from 'react'
import { colOf, rowOf, maskDigits } from '../sudoku/grid'
import { cellCandidateCount } from '../sudoku/consequenceList'
import type { CandidateMask, CellValue, Digit, Grid } from '../sudoku/types'

export type CellHighlight =
  | 'cl-finding'
  | 'cl-elim'
  | 'conflict'
  | 'conflict-peer'
  | 'selected'

interface SudokuGridProps {
  values: Grid
  givens: boolean[]
  candidates: CandidateMask[]
  selectedCell: number | null
  selectedDigits: Digit[]
  highlights: Map<number, CellHighlight>
  /** Whole-cell ring when any selected pad digit matches the cell value */
  valueMatchCells: Set<number>
  onSelectCell: (cell: number) => void
}

function cellClasses(
  cell: number,
  selectedCell: number | null,
  highlights: Map<number, CellHighlight>,
  valueMatch: boolean,
  candCount: number,
): string {
  const parts = ['cell']
  const r = rowOf(cell)
  const c = colOf(cell)
  if (c === 2 || c === 5) parts.push('border-right-thick')
  if (r === 2 || r === 5) parts.push('border-bottom-thick')
  if (cell === selectedCell) parts.push('selected')
  const h = highlights.get(cell)
  if (h) parts.push(`hl-${h}`)
  if (valueMatch) parts.push('hl-value-ring')
  if (candCount >= 1 && candCount <= 4) parts.push(`cand-shade-${candCount}`)
  return parts.join(' ')
}

export function SudokuGrid({
  values,
  givens,
  candidates,
  selectedCell,
  selectedDigits,
  highlights,
  valueMatchCells,
  onSelectCell,
}: SudokuGridProps) {
  const selectedSet = useMemo(() => new Set(selectedDigits), [selectedDigits])

  return (
    <div className="grid-wrap" role="grid" aria-label="Sudoku board">
      {values.map((value, cell) => {
        const isGiven = givens[cell]
        const displayValue = value as CellValue
        const cands = displayValue === 0 ? maskDigits(candidates[cell]) : []
        const candCount = displayValue === 0 ? cellCandidateCount(candidates, cell) : 0

        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={`Row ${rowOf(cell) + 1} column ${colOf(cell) + 1}`}
            className={cellClasses(
              cell,
              selectedCell,
              highlights,
              valueMatchCells.has(cell),
              candCount,
            )}
            onClick={() => onSelectCell(cell)}
          >
            {displayValue !== 0 ? (
              <span
                className={`digit ${isGiven ? 'given' : 'user'} ${
                  selectedSet.has(displayValue) ? 'digit-pad-match' : ''
                }`}
              >
                {displayValue}
              </span>
            ) : (
              <span className="candidates">
                {Array.from({ length: 9 }, (_, i) => {
                  const d = (i + 1) as Digit
                  const on = cands.includes(d)
                  const slice = on && selectedSet.has(d)
                  return (
                    <span key={d} className={`cand ${on ? 'on' : 'off'} ${slice ? 'slice-hl' : ''}`}>
                      {on ? d : ''}
                    </span>
                  )
                })}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
