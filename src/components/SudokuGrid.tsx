import { colOf, rowOf } from '../sudoku/grid'
import { maskDigits } from '../sudoku/grid'
import type { CandidateMask, CellValue, Digit, Grid } from '../sudoku/types'

export type CellHighlight = 'proposed' | 'elimination' | 'forced' | 'peer' | 'selected' | 'related'

interface SudokuGridProps {
  values: Grid
  givens: boolean[]
  candidates: CandidateMask[]
  showCandidates: boolean
  selectedCell: number | null
  highlights: Map<number, CellHighlight>
  previewValues: Grid | null
  activeChainCell: number | null
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

export function SudokuGrid({
  values,
  givens,
  candidates,
  showCandidates,
  selectedCell,
  highlights,
  previewValues,
  activeChainCell,
  onSelectCell,
}: SudokuGridProps) {
  const display = previewValues ?? values

  return (
    <div className="grid-wrap" role="grid" aria-label="Sudoku board">
      {display.map((value, cell) => {
        const isGiven = givens[cell]
        const displayValue = value as CellValue
        const cands = showCandidates && displayValue === 0 ? maskDigits(candidates[cell]) : []
        const chainActive = activeChainCell === cell

        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={`Row ${rowOf(cell) + 1} column ${colOf(cell) + 1}`}
            className={cellClasses(cell, selectedCell, highlights) + (chainActive ? ' chain-focus' : '')}
            onClick={() => onSelectCell(cell)}
          >
            {displayValue !== 0 ? (
              <span className={`digit ${isGiven ? 'given' : 'user'}`}>{displayValue}</span>
            ) : showCandidates && cands.length > 0 ? (
              <span className="candidates">
                {Array.from({ length: 9 }, (_, i) => {
                  const d = (i + 1) as Digit
                  return (
                    <span key={d} className={cands.includes(d) ? 'cand on' : 'cand off'}>
                      {cands.includes(d) ? d : ''}
                    </span>
                  )
                })}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
