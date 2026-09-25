import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { ChainPanel } from './components/ChainPanel'
import { ImportModal } from './components/ImportModal'
import { SudokuGrid, type CellHighlight } from './components/SudokuGrid'
import { computeCandidates } from './sudoku/candidates'
import { cloneGrid, maskHas } from './sudoku/grid'
import { importPuzzle, SAMPLE_PUZZLE } from './sudoku/import'
import { analyzeProposedMove } from './sudoku/implications'
import { strongLinksForSelection } from './sudoku/strongLinks'
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

  /** Order preserved; last entry = last selected digit */
  const [selectedDigits, setSelectedDigits] = useState<Digit[]>([])
  const [strongN, setStrongN] = useState<2 | 3 | 4>(2)
  const [showStrongLinks, setShowStrongLinks] = useState(true)

  const lastSelectedDigit = selectedDigits.length > 0 ? selectedDigits[selectedDigits.length - 1] : null

  const candidates = useMemo(() => computeCandidates(values), [values])

  const strongLinkCells = useMemo(() => {
    if (!showStrongLinks) return new Set<number>()
    const groups = strongLinksForSelection(candidates, strongN, selectedDigits)
    const cells = new Set<number>()
    for (const g of groups) for (const c of g.cells) cells.add(c)
    return cells
  }, [candidates, strongN, selectedDigits, showStrongLinks])

  const highlights = useMemo(() => {
    const map = new Map<number, CellHighlight>()

    if (!previewOn && selectedDigits.length > 0) {
      for (let cell = 0; cell < 81; cell++) {
        const v = values[cell]
        let match = false
        for (const d of selectedDigits) {
          if (v === d) match = true
          else if (v === 0 && maskHas(candidates[cell], d)) match = true
        }
        if (match) map.set(cell, 'digit-match')
      }
    }

    if (!previewOn && showStrongLinks) {
      for (const c of strongLinkCells) {
        if (!map.has(c)) map.set(c, 'strong-link')
      }
    }

    if (analysis && previewOn) {
      for (const [cell, role] of analysis.highlights) {
        map.set(cell, role as CellHighlight)
      }
    }

    if (selectedCell !== null) {
      map.set(selectedCell, previewOn ? (map.get(selectedCell) ?? 'selected') : 'selected')
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
  }, [
    analysis,
    previewOn,
    selectedCell,
    activeStepId,
    selectedDigits,
    values,
    candidates,
    strongLinkCells,
    showStrongLinks,
  ])

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

  const toggleDigit = useCallback((digit: Digit) => {
    setSelectedDigits((prev) => {
      const i = prev.indexOf(digit)
      if (i >= 0) {
        const next = [...prev.slice(0, i), ...prev.slice(i + 1)]
        return next
      }
      return [...prev, digit]
    })
  }, [])

  const handleCell = useCallback(
    (cell: number) => {
      setSelectedCell(cell)
      const digit = lastSelectedDigit
      if (digit === null || givens[cell]) return

      if (inputMode === 'propose') {
        runPreview(cell, digit)
        return
      }

      if (values[cell] === 0 || !givens[cell]) {
        setValues((prev) => {
          const next = cloneGrid(prev)
          next[cell] = digit
          return next
        })
        setAnalysis(null)
        setPreviewOn(false)
        setActiveStepId(null)
      }
    },
    [lastSelectedDigit, givens, inputMode, runPreview, values],
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

  const handleStepOffset = useCallback(
    (delta: number) => {
      if (!analysis?.steps.length) return
      const steps = analysis.steps
      const idx = steps.findIndex((s) => s.id === activeStepId)
      const base = idx >= 0 ? idx : 0
      const next = (base + delta + steps.length) % steps.length
      setActiveStepId(steps[next].id)
    },
    [analysis, activeStepId],
  )

  const handleImport = (text: string) => {
    try {
      const result = importPuzzle(text)
      setValues(cloneGrid(result.values))
      setGivens([...result.givens])
      setImportError(null)
      setAnalysis(null)
      setPreviewOn(false)
      setSelectedCell(null)
      setSelectedDigits([])
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
        filterDigits={previewOn ? [] : selectedDigits}
        previewValues={previewValues}
        activeChainCell={activeChainCell}
        onSelectCell={handleCell}
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
        <button
          type="button"
          className={`btn toggle ${showStrongLinks ? 'on' : ''}`}
          onClick={() => setShowStrongLinks((v) => !v)}
        >
          Strong
        </button>
      </div>

      <div className="strong-bar" role="group" aria-label="Strong link size">
        {([2, 3, 4] as const).map((n) => (
          <button
            key={n}
            type="button"
            className={`btn toggle small ${strongN === n ? 'on' : ''}`}
            onClick={() => setStrongN(n)}
          >
            n={n}
          </button>
        ))}
        {selectedDigits.length > 0 && (
          <button type="button" className="btn ghost small" onClick={() => setSelectedDigits([])}>
            Clear #
          </button>
        )}
      </div>

      <p className="hint-bar">
        Tap digits to highlight (tap again to off). Last # + cell → {inputMode === 'propose' ? 'propose' : 'fill'}.
      </p>

      <div className="numpad" role="group" aria-label="Digits">
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => (
          <button
            key={n}
            type="button"
            className={`num ${selectedDigits.includes(n) ? 'picked' : ''} ${
              lastSelectedDigit === n ? 'last-picked' : ''
            }`}
            onClick={() => toggleDigit(n)}
          >
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
        onStepOffset={handleStepOffset}
        error={analysis && !analysis.valid ? analysis.error : undefined}
      />

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />
    </div>
  )
}
