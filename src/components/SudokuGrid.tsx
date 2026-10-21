import { useMemo } from 'react'
import { colOf, rowOf, maskDigits } from '../sudoku/grid'
import type { CandStrongMark, EdgeMark } from '../sudoku/strongPairMarks'
import { candMarkKey } from '../sudoku/strongPairMarks'
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
  candStrongMarks: Map<string, CandStrongMark>
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

function CandEdgeMarks({ mark }: { mark: CandStrongMark }) {
  const unitClass = `unit-${mark.unit}`
  return (
    <>
      {mark.edges.map((e: EdgeMark) => (
        <span key={e} className={`cand-edge cand-edge-${e} ${unitClass}`} aria-hidden />
      ))}
      {mark.setSize >= 4 && (
        <span className={`cand-unit-tag ${unitClass}`} aria-hidden>
          {mark.unit === 'row' ? 'R' : mark.unit === 'col' ? 'C' : 'B'}
        </span>
      )}
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
  candStrongMarks,
  onSelectCell,
}: SudokuGridProps) {
  const selectedSet = useMemo(() => new Set(selectedDigits), [selectedDigits])

  return (
    <div className="grid-wrap" role="grid" aria-label="Sudoku board">
      {values.map((value, cell) => {
        const isGiven = givens[cell]
        const displayValue = value as CellValue
        const cands = displayValue === 0 ? maskDigits(candidates[cell]) : []
        const digitColored = displayValue !== 0 && selectedSet.has(displayValue)
        return (
          <button
            key={cell}
            type="button"
            role="gridcell"
            aria-label={`Row ${rowOf(cell) + 1} column ${colOf(cell) + 1}`}
            className={cellClasses(cell, selectedCell, highlights)}
            onClick={() => onSelectCell(cell)}
          >
            {displayValue !== 0 ? (
              <span
                className={`digit ${isGiven ? 'given' : 'user'} ${
                  digitColored ? `digit-color-${displayValue}` : 'digit-muted'
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
                  const sm = on ? candStrongMarks.get(candMarkKey(cell, d)) : undefined
                  const showColor = picked || sm
                  return (
                    <span
                      key={d}
                      className={`cand ${on ? 'on' : 'off'} ${
                        showColor ? `cand-color-${d}` : on ? 'cand-muted' : ''
                      }`}
                    >
                      {on ? d : ''}
                      {sm && (
                        <CandEdgeMarks mark={sm} />
                      )}
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
