import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { ChainPanel } from './components/ChainPanel'
import { ImportModal } from './components/ImportModal'
import { SudokuGrid, type CellHighlight } from './components/SudokuGrid'
import { computeCandidates } from './sudoku/candidates'
import { cloneGrid } from './sudoku/grid'
import { importPuzzle, SAMPLE_PUZZLE } from './sudoku/import'
import { analyzeProposedMove } from './sudoku/implications'
import type { Digit, Grid, ProposedMoveAnalysis } from './sudoku/types'

type InputMode = 'value' | 'propose'

function initialFromSample(): { values: Grid; givens: boolean[] } {
  const { values, givens } = importPuzzle(SAMPLE_PUZZLE)
  return { values, givens }
}

export default function App() {
  const [initial] = useState(initialFromSample)
  const [values, setValues] = useState<Grid>(() => cloneGrid(initial.values))
  const [givens, setGivens] = useState<boolean[]>(() => [...initial.givens])
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('value')
  const [showCandidates, setShowCandidates] = useState(true)
  const [importOpen, setImportOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ProposedMoveAnalysis | null>(null)
  const [activeStepId, setActiveStepId] = useState<number | null>(null)
  const [previewOn, setPreviewOn] = useState(false)

  const candidates = useMemo(() => computeCandidates(values), [values])

  const highlights = useMemo(() => {
    const map = new Map<number, CellHighlight>()
    if (analysis && previewOn) {
      for (const [cell, role] of analysis.highlights) {
        map.set(cell, role)
      }
    }
    if (selectedCell !== null) {
      if (!map.has(selectedCell)) map.set(selectedCell, 'selected')
      else map.set(selectedCell, 'selected')
    }
    if (activeStepId !== null && analysis) {
      const step = analysis.steps.find((s) => s.id === activeStepId)
      if (step) {
        map.set(step.cell, step.kind === 'proposed' ? 'proposed' : 'forced')
        for (const c of step.relatedCells) {
          if (!map.has(c)) map.set(c, 'related')
        }
      }
    }
    return map
  }, [analysis, previewOn, selectedCell, activeStepId])

  const activeChainCell = useMemo(() => {
    if (activeStepId === null || !analysis) return null
    return analysis.steps.find((s) => s.id === activeStepId)?.cell ?? null
  }, [activeStepId, analysis])

  const previewValues = previewOn && analysis?.valid ? analysis.resultValues : null

  const runPreview = useCallback(
    (cell: number, digit: Digit) => {
      const result = analyzeProposedMove(values, cell, digit)
      setAnalysis(result)
      setPreviewOn(true)
      setActiveStepId(result.steps[0]?.id ?? null)
    },
    [values],
  )

  const applyDigit = useCallback(
    (digit: Digit) => {
      if (selectedCell === null) return
      if (givens[selectedCell]) return

      if (inputMode === 'propose') {
        runPreview(selectedCell, digit)
        return
      }

      setValues((prev) => {
        const next = cloneGrid(prev)
        next[selectedCell] = digit
        return next
      })
      setAnalysis(null)
      setPreviewOn(false)
      setActiveStepId(null)
    },
    [selectedCell, givens, inputMode, runPreview],
  )

  const clearCell = useCallback(() => {
    if (selectedCell === null || givens[selectedCell]) return
    setValues((prev) => {
      const next = cloneGrid(prev)
      next[selectedCell] = 0
      return next
    })
    setAnalysis(null)
    setPreviewOn(false)
  }, [selectedCell, givens])

  const commitPreview = useCallback(() => {
    if (!analysis?.valid) return
    setValues(cloneGrid(analysis.resultValues))
    setPreviewOn(false)
    setAnalysis(null)
    setActiveStepId(null)
  }, [analysis])

  const handleImport = (text: string) => {
    try {
      const result = importPuzzle(text)
      setValues(cloneGrid(result.values))
      setGivens([...result.givens])
      setImportError(null)
      setAnalysis(null)
      setPreviewOn(false)
      setSelectedCell(null)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
    }
  }

  return (
    <div className="app">
      <header className="top-bar">
        <h1>Sudoku Studio</h1>
        <div className="top-actions">
          <button type="button" className="btn ghost small" onClick={() => setImportOpen(true)}>
            Import
          </button>
        </div>
      </header>

      {importError && (
        <p className="banner error" role="alert">
          {importError}
        </p>
      )}

      <SudokuGrid
        values={values}
        givens={givens}
        candidates={previewOn && analysis ? analysis.resultCandidates : candidates}
        showCandidates={showCandidates}
        selectedCell={selectedCell}
        highlights={highlights}
        previewValues={previewValues}
        activeChainCell={activeChainCell}
        onSelectCell={setSelectedCell}
      />

      <div className="mode-bar">
        <button
          type="button"
          className={`btn toggle ${inputMode === 'value' ? 'on' : ''}`}
          onClick={() => setInputMode('value')}
        >
          Fill
        </button>
        <button
          type="button"
          className={`btn toggle ${inputMode === 'propose' ? 'on' : ''}`}
          onClick={() => setInputMode('propose')}
        >
          Propose
        </button>
        <button
          type="button"
          className={`btn toggle ${showCandidates ? 'on' : ''}`}
          onClick={() => setShowCandidates((v) => !v)}
        >
          Candidates
        </button>
      </div>

      <div className="numpad" role="group" aria-label="Digits">
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => (
          <button key={n} type="button" className="num" onClick={() => applyDigit(n)}>
            {n}
          </button>
        ))}
        <button type="button" className="num wide" onClick={clearCell}>
          Clear
        </button>
      </div>

      {inputMode === 'propose' && (
        <div className="propose-bar">
          <button
            type="button"
            className="btn primary"
            disabled={!analysis?.valid || !previewOn}
            onClick={commitPreview}
          >
            Apply chain
          </button>
          <button
            type="button"
            className="btn ghost"
            disabled={!previewOn}
            onClick={() => {
              setPreviewOn(false)
              setAnalysis(null)
              setActiveStepId(null)
            }}
          >
            Dismiss preview
          </button>
        </div>
      )}

      <ChainPanel
        steps={previewOn && analysis ? analysis.steps : []}
        activeStepId={activeStepId}
        onSelectStep={setActiveStepId}
        error={analysis && !analysis.valid ? analysis.error : undefined}
      />

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
    </div>
  )
}
