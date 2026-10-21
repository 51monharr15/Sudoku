import { useMemo } from 'react'
import { colOf, rowOf, maskDigits } from '../sudoku/grid'
import type { CellMarks } from '../sudoku/strongPairMarks'
import type { CandidateMask, CellValue, Digit, Grid } from '../sudoku/types'

export type CellHighlight =
  | 'cl-finding'
  | 'cl-elim'
  | 'conflict'
  | 'conflict-peer'
  | 'selected'
  | 'tech-ns'
  | 'tech-os'

interface SudokuGridProps {
  values: Grid
  givens: boolean[]
  candidates: CandidateMask[]
  selectedCell: number | null
  selectedDigits: Digit[]
  highlights: Map<number, CellHighlight>
  edgeMarks: Map<number, CellMarks>
  onSelectCell: (cell: number) => void
}

function cellClasses(
  cell: number,
  selectedCell: number | null,
  highlights: Map<number, CellHighlight>,
): string {
  const parts = ['cell']
  const r = rowOf(cell)
  const c = colOf(cell)
  if (c === 2 || c === 5) parts.push('border-right-thick')
  if (r === 2 || r === 5) parts.push('border-bottom-thick')
  if (cell === selectedCell) parts.push('selected')
  const h = highlights.get(cell)
  if (h) parts.push(`hl-${h}`)
  return parts.join(' ')
}

function EdgeMarks({ marks }: { marks: CellMarks }) {
  return (
    <>
      {marks.top && <span className="edge-mark edge-top" aria-hidden />}
      {marks.bottom && <span className="edge-mark edge-bottom" aria-hidden />}
      {marks.left && <span className="edge-mark edge-left" aria-hidden />}
      {marks.right && <span className="edge-mark edge-right" aria-hidden />}
    </>
  )
}

export function SudokuGrid({
  values,
  givens,
  candidates,
  selectedCell,
  selectedDigits,
  highlights,
  edgeMarks,
  onSelectCell,
}: SudokuGridProps) {
  const selectedSet = useMemo(() => new Set(selectedDigits), [selectedDigits])

  return (
    <div className="grid-wrap" role="grid" aria-label="Sudoku board">
      {values.map((value, cell) => {
        const isGiven = givens[cell]
        const displayValue = value as CellValue
        const cands = displayValue === 0 ? maskDigits(candidates[cell]) : []
        const marks = edgeMarks.get(cell)
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={`Row ${rowOf(cell) + 1} column ${colOf(cell) + 1}`}
            className={cellClasses(cell, selectedCell, highlights)}
            onClick={() => onSelectCell(cell)}
          >
            {marks && <EdgeMarks marks={marks} />}
            {displayValue !== 0 ? (
              <span
                className={`digit ${isGiven ? 'given' : 'user'} ${
                  selectedSet.has(displayValue) ? `digit-hl digit-hl-${displayValue}` : ''
                }`}
              >
                {displayValue}
              </span>
            ) : (
              <span className="candidates">
                {Array.from({ length: 9 }, (_, i) => {
                  const d = (i + 1) as Digit
                  const on = cands.includes(d)
                  const picked = on && selectedSet.has(d)
                  return (
                    <span
                      key={d}
                      className={`cand ${on ? 'on' : 'off'} cand-d${d} ${
                        picked ? `cand-hl cand-hl-${d}` : ''
                      }`}
                    >
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
