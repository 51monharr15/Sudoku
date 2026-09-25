import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { ChainPanel } from './components/ChainPanel'
import { ImportModal } from './components/ImportModal'
import { SudokuGrid, type CellHighlight } from './components/SudokuGrid'
import { computeCandidates } from './sudoku/candidates'
import { cloneGrid, conflictingCells, maskHas } from './sudoku/grid'
import { importPuzzle, SAMPLE_PUZZLE } from './sudoku/import'
import { analyzeProposedMove } from './sudoku/implications'
import { strongLinksForN } from './sudoku/strongLinks'
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
  const [conflictAt, setConflictAt] = useState<number | null>(null)
  const [conflictPeers, setConflictPeers] = useState<number[]>([])

  const [selectedDigits, setSelectedDigits] = useState<Digit[]>([])
  const [strongN, setStrongN] = useState<2 | 3 | 4>(2)
  const [showStrongLinks, setShowStrongLinks] = useState(true)

  const lastSelectedDigit = selectedDigits.length > 0 ? selectedDigits[selectedDigits.length - 1] : null

  const candidates = useMemo(() => computeCandidates(values), [values])

  const strongLinkCells = useMemo(() => {
    if (!showStrongLinks) return new Set<number>()
    const groups = strongLinksForN(candidates, strongN)
    const cells = new Set<number>()
    for (const g of groups) for (const c of g.cells) cells.add(c)
    return cells
  }, [candidates, strongN, showStrongLinks])

  const digitColor = useMemo(() => {
    const map = new Map<number, Digit>()
    for (const d of selectedDigits) {
      for (let cell = 0; cell < 81; cell++) {
        const v = values[cell]
        if (v === d || (v === 0 && maskHas(candidates[cell], d))) {
          map.set(cell, d)
        }
      }
    }
    return map
  }, [selectedDigits, values, candidates])

  const highlights = useMemo(() => {
    const map = new Map<number, CellHighlight>()

    if (selectedDigits.length > 0) {
      for (let cell = 0; cell < 81; cell++) {
        if (digitColor.has(cell)) map.set(cell, 'digit-match')
      }
    }

    if (!previewOn && showStrongLinks) {
      for (const c of strongLinkCells) {
        if (!map.has(c)) map.set(c, 'strong-link')
      }
    }

    if (conflictAt !== null) {
      map.set(conflictAt, 'conflict')
      for (const p of conflictPeers) map.set(p, 'conflict-peer')
    }

    if (analysis && previewOn) {
      for (const [cell, role] of analysis.highlights) {
        map.set(cell, role as CellHighlight)
      }
    }

    if (selectedCell !== null) {
      const existing = map.get(selectedCell)
      if (!existing || existing === 'digit-match') map.set(selectedCell, 'selected')
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
    digitColor,
    strongLinkCells,
    showStrongLinks,
    conflictAt,
    conflictPeers,
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
      setConflictAt(null)
      setConflictPeers([])
    },
    [values],
  )

  const toggleDigit = useCallback((digit: Digit) => {
    setSelectedDigits((prev) => {
      const i = prev.indexOf(digit)
      if (i >= 0) return [...prev.slice(0, i), ...prev.slice(i + 1)]
      return [...prev, digit]
    })
  }, [])

  const applyFill = useCallback(
    (cell: number, digit: Digit) => {
      const next = cloneGrid(values)
      next[cell] = digit
      setValues(next)
      setAnalysis(null)
      setPreviewOn(false)
      setActiveStepId(null)
      const peers = conflictingCells(next, cell)
      if (peers.length > 0) {
        setConflictAt(cell)
        setConflictPeers(peers)
      } else {
        setConflictAt(null)
        setConflictPeers([])
      }
    },
    [values],
  )

  const handleCell = useCallback(
    (cell: number) => {
      setSelectedCell(cell)
      const digit = lastSelectedDigit
      if (digit === null || givens[cell]) return

      if (inputMode === 'propose') {
        runPreview(cell, digit)
        return
      }

      if (values[cell] !== 0 && givens[cell]) return
      applyFill(cell, digit)
    },
    [lastSelectedDigit, givens, inputMode, runPreview, values, applyFill],
  )

  const clearCell = useCallback(() => {
    if (selectedCell === null || givens[selectedCell]) return
    setValues((prev) => {
      const next = cloneGrid(prev)
      next[selectedCell] = 0
      return next
    })
    setConflictAt(null)
    setConflictPeers([])
    setAnalysis(null)
    setPreviewOn(false)
  }, [selectedCell, givens])

  const clearClash = useCallback(() => {
    if (conflictAt === null) return
    setValues((prev) => {
      const next = cloneGrid(prev)
      for (const p of conflictPeers) {
        if (!givens[p]) next[p] = 0
      }
      return next
    })
    setConflictAt(null)
    setConflictPeers([])
  }, [conflictAt, conflictPeers, givens])

  const commitPreview = useCallback(() => {
    if (!analysis?.valid) return
    setValues(cloneGrid(analysis.resultValues))
    setPreviewOn(false)
    setAnalysis(null)
    setActiveStepId(null)
    setConflictAt(null)
    setConflictPeers([])
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
      setConflictAt(null)
      setConflictPeers([])
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
    }
  }

  const conflictMsg =
    conflictAt !== null
      ? `Rule clash: same digit in row/column/box. Clear clash removes the other cell(s), keeps your last entry.`
      : null

  return (
    <div className="app">
      <header className="top-bar">
        <div className="title-block">
          <h1>Sudoku Studio</h1>
          <span className="app-version" title="Build version">
            {__APP_VERSION__}
          </span>
        </div>
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

      {conflictMsg && (
        <div className="banner conflict" role="alert">
          <p>{conflictMsg}</p>
          <button type="button" className="btn ghost small" onClick={clearClash}>
            Clear clash
          </button>
        </div>
      )}

      <SudokuGrid
        values={values}
        givens={givens}
        candidates={previewOn && analysis ? analysis.resultCandidates : candidates}
        showCandidates={showCandidates}
        selectedCell={selectedCell}
        highlights={highlights}
        digitColor={digitColor}
        filterDigits={selectedDigits}
        previewDim={previewOn}
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
        Fill = solve empty cells (Import for new puzzles). # then cell. Import for givens.
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
