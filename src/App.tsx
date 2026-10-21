import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { AppMenu } from './components/AppMenu'
import { ClStepBar } from './components/ClStepBar'
import { ImportModal } from './components/ImportModal'
import { SudokuGrid, type CellHighlight } from './components/SudokuGrid'
import { TechniqueIndex } from './components/TechniqueIndex'
import { APP_VERSION } from './appVersion'
import { computeCandidates } from './sudoku/candidates'
import {
  buildConsequenceList,
  stepHighlightCells,
  toggleCandidateMask,
} from './sudoku/consequenceList'
import { allStrongLinkCandMarks } from './sudoku/strongPairMarks'
import { strongLinksForN, strongNakedSets } from './sudoku/strongLinks'
import {
  hiddenSingleCells,
  nakedSingleCells,
  techniqueCounts,
  type TechniqueKey,
} from './sudoku/techniqueStats'
import { cloneGrid, conflictingCells } from './sudoku/grid'
import { importPuzzle, SAMPLE_PUZZLE } from './sudoku/import'
import type { CandidateMask, ChainStep, Digit, Grid } from './sudoku/types'

type EntryMode = 'solution' | 'pencil'

function initialFromSample(): { values: Grid; givens: boolean[] } {
  const { values, givens } = importPuzzle(SAMPLE_PUZZLE)
  return { values, givens }
}

function syncCandidates(values: Grid, prev: CandidateMask[] | null): CandidateMask[] {
  const auto = computeCandidates(values)
  if (!prev) return auto
  return auto.map((a, i) => {
    if (values[i] !== 0) return 0
    return prev[i] & a
  })
}

export default function App() {
  const [initial] = useState(initialFromSample)
  const [values, setValues] = useState<Grid>(() => cloneGrid(initial.values))
  const [givens, setGivens] = useState<boolean[]>(() => [...initial.givens])
  const [candidates, setCandidates] = useState<CandidateMask[]>(() =>
    computeCandidates(initial.values),
  )
  const [selectedCell, setSelectedCell] = useState<number | null>(null)
  const [selectedDigits, setSelectedDigits] = useState<Digit[]>([])
  const [entryMode, setEntryMode] = useState<EntryMode>('solution')
  const [menuOpen, setMenuOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [conflictAt, setConflictAt] = useState<number | null>(null)
  const [conflictPeers, setConflictPeers] = useState<number[]>([])

  const [clSteps, setClSteps] = useState<ChainStep[]>(() =>
    buildConsequenceList(initial.values, computeCandidates(initial.values)),
  )
  const [clStepIndex, setClStepIndex] = useState<number | null>(null)
  const [pendingElims, setPendingElims] = useState<{ cell: number; digit: Digit }[]>([])
  const [techActive, setTechActive] = useState<Partial<Record<TechniqueKey, boolean>>>({})
  const [consequencesOpen, setConsequencesOpen] = useState(false)

  const rebuildCl = useCallback((v: Grid, c: CandidateMask[]) => {
    const steps = buildConsequenceList(v, c)
    setClSteps(steps)
    setClStepIndex(null)
    setPendingElims([])
  }, [])

  const mceAfterState = useCallback(
    (nextValues: Grid, nextCandidates: CandidateMask[]) => {
      setValues(nextValues)
      setCandidates(nextCandidates)
      rebuildCl(nextValues, nextCandidates)
    },
    [rebuildCl],
  )

  const activeDigit = selectedDigits.length > 0 ? selectedDigits[selectedDigits.length - 1] : null

  /** Tap toggles selection; last selected stays active for cell taps. ⌫# clears all. */
  const selectDigit = useCallback((digit: Digit) => {
    setSelectedDigits((prev) => {
      const i = prev.indexOf(digit)
      if (i >= 0) return prev.filter((_, idx) => idx !== i)
      return [...prev, digit]
    })
  }, [])

  const clearSelectedDigits = useCallback(() => setSelectedDigits([]), [])

  const applySolutionMce = useCallback(
    (cell: number, digit: Digit) => {
      if (givens[cell]) return
      const next = cloneGrid(values)
      if (next[cell] === digit) {
        next[cell] = 0
        const nc = syncCandidates(next, candidates)
        mceAfterState(next, nc)
        setConflictAt(null)
        setConflictPeers([])
        return
      }
      next[cell] = digit
      const nc = computeCandidates(next)
      const peers = conflictingCells(next, cell)
      mceAfterState(next, nc)
      if (peers.length > 0) {
        setConflictAt(cell)
        setConflictPeers(peers)
      } else {
        setConflictAt(null)
        setConflictPeers([])
      }
    },
    [values, candidates, givens, mceAfterState],
  )

  const applyPencilMce = useCallback(
    (cell: number, digit: Digit) => {
      if (givens[cell] || values[cell] !== 0) return
      const auto = computeCandidates(values)[cell]
      const nc = candidates.slice()
      nc[cell] = toggleCandidateMask(candidates[cell], digit, auto)
      mceAfterState(values, nc)
    },
    [values, candidates, givens, mceAfterState],
  )

  const handleCell = useCallback(
    (cell: number) => {
      setSelectedCell(cell)
      if (activeDigit === null || givens[cell]) return
      if (entryMode === 'solution') applySolutionMce(cell, activeDigit)
      else applyPencilMce(cell, activeDigit)
    },
    [activeDigit, givens, entryMode, applySolutionMce, applyPencilMce],
  )

  const clearClash = useCallback(() => {
    if (conflictAt === null) return
    const next = cloneGrid(values)
    for (const p of conflictPeers) {
      if (!givens[p]) next[p] = 0
    }
    const nc = computeCandidates(next)
    setConflictAt(null)
    setConflictPeers([])
    mceAfterState(next, nc)
  }, [conflictAt, conflictPeers, givens, values, mceAfterState])

  const handleImport = (text: string) => {
    try {
      const result = importPuzzle(text)
      const v = cloneGrid(result.values)
      const c = computeCandidates(v)
      setValues(v)
      setGivens([...result.givens])
      setCandidates(c)
      setImportError(null)
      setSelectedCell(null)
      setSelectedDigits([])
      setConflictAt(null)
      setConflictPeers([])
      rebuildCl(v, c)
    } catch (e) {
      setImportError(e instanceof Error ? e.message : 'Import failed')
    }
  }

  const activeStep = clStepIndex !== null ? clSteps[clStepIndex] : undefined

  const highlights = useMemo(() => {
    const map = new Map<number, CellHighlight>()
    if (conflictAt !== null) {
      map.set(conflictAt, 'conflict')
      for (const p of conflictPeers) map.set(p, 'conflict-peer')
    }
    if (activeStep) {
      for (const c of stepHighlightCells(activeStep)) map.set(c, 'cl-finding')
    }
    for (const { cell } of pendingElims) map.set(cell, 'cl-elim')
    if (techActive.Ns) {
      for (const c of nakedSingleCells(values, candidates)) map.set(c, 'tech-ns')
    }
    if (techActive.Os) {
      for (const c of hiddenSingleCells(values, candidates)) map.set(c, 'tech-os')
    }
    if (selectedCell !== null && !map.has(selectedCell)) map.set(selectedCell, 'selected')
    return map
  }, [conflictAt, conflictPeers, activeStep, pendingElims, selectedCell, techActive, values, candidates])

  const techCounts = useMemo(() => techniqueCounts(values, candidates), [values, candidates])

  const candStrongMarks = useMemo(() => {
    const groups: ReturnType<typeof strongLinksForN> = []
    if (techActive.Sd) groups.push(...strongLinksForN(candidates, 2))
    if (techActive.St) groups.push(...strongLinksForN(candidates, 3))
    if (techActive.Sq) groups.push(...strongNakedSets(candidates, 4))
    return allStrongLinkCandMarks(groups, candidates)
  }, [techActive.Sd, techActive.St, techActive.Sq, candidates])

  const showApply = pendingElims.length > 0

  const applyPending = useCallback(() => {
    if (pendingElims.length === 0) return
    const nc = candidates.slice()
    for (const { cell, digit } of pendingElims) {
      if (values[cell] === 0) nc[cell] = nc[cell] & ~(1 << digit)
    }
    setPendingElims([])
    mceAfterState(values, nc)
  }, [pendingElims, candidates, values, mceAfterState])

  const clForward = useCallback(() => {
    if (clSteps.length === 0) return
    setClStepIndex((i) => {
      if (i === null) return 0
      return Math.min(i + 1, clSteps.length - 1)
    })
  }, [clSteps.length])

  const clBack = useCallback(() => {
    setClStepIndex((i) => {
      if (i === null || i <= 0) return null
      return i - 1
    })
  }, [])

  const applyNakedSingleFromStep = useCallback(() => {
    if (!activeStep || activeStep.kind !== 'naked_single') return
    applySolutionMce(activeStep.cell, activeStep.digit)
  }, [activeStep, applySolutionMce])

  return (
    <div className="app">
      <header className="top-bar compact">
        <button type="button" className="btn icon menu-btn" onClick={() => setMenuOpen(true)} aria-label="Menu">
          ☰
        </button>
        <button
          type="button"
          className={`tab-btn consequences-toggle ${consequencesOpen ? 'on' : ''}`}
          aria-pressed={consequencesOpen}
          onClick={() => setConsequencesOpen((o) => !o)}
        >
          Consequences {consequencesOpen ? '▾' : '▸'}
        </button>
      </header>

      {importError && (
        <p className="banner error" role="alert">
          {importError}
        </p>
      )}

      {conflictAt !== null && (
        <div className="banner conflict compact">
          <button type="button" className="btn ghost small" onClick={clearClash}>
            Clear clash
          </button>
        </div>
      )}

      <section className="main-stage" aria-label="Sudoku board">
        <SudokuGrid
          values={values}
          givens={givens}
          candidates={candidates}
          selectedCell={selectedCell}
          selectedDigits={selectedDigits}
          highlights={highlights}
          candStrongMarks={candStrongMarks}
          onSelectCell={handleCell}
        />
        {consequencesOpen && (
          <TechniqueIndex
            counts={techCounts}
            active={techActive}
            onSelect={(key: TechniqueKey) =>
              setTechActive((e) => ({ ...e, [key]: !e[key] }))
            }
          />
        )}
        <ClStepBar
          steps={clSteps}
          stepIndex={clStepIndex}
          onBack={clBack}
          onForward={clForward}
          showApply={showApply}
          onApply={applyPending}
        />
        {activeStep?.kind === 'naked_single' && (
          <button type="button" className="btn primary compact set-ns" onClick={applyNakedSingleFromStep}>
            Set naked single
          </button>
        )}
      </section>

      <div className="bottom-bar">
        <div className="entry-strip">
          <div className="mode-toggle" role="group" aria-label="Entry mode">
            <button
              type="button"
              className={`btn toggle compact mode-btn ${entryMode === 'solution' ? 'on' : ''}`}
              onClick={() => setEntryMode('solution')}
              aria-label="Solution"
            >
              #
            </button>
            <button
              type="button"
              className={`btn toggle compact mode-btn ${entryMode === 'pencil' ? 'on' : ''}`}
              onClick={() => setEntryMode('pencil')}
              aria-label="Pencil"
            >
              ✎
            </button>
          </div>
          <div className="numpad numpad-3x3" role="group" aria-label="Digits">
            {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => (
              <button
                key={n}
                type="button"
                data-digit={n}
                className={`num ${selectedDigits.includes(n) ? 'picked' : ''} ${
                  activeDigit === n ? 'last-picked' : ''
                }`}
                onClick={() => selectDigit(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn clear-digits-btn"
            onClick={clearSelectedDigits}
            aria-label="Clear all selected digits"
          >
            ⌫
          </button>
        </div>
        <footer className="app-footer">
          <span className="app-version">{APP_VERSION}</span>
        </footer>
      </div>

      <AppMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onImport={() => setImportOpen(true)}
        onGuide={() => setGuideOpen(true)}
      />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />

      {guideOpen && (
        <div className="menu-backdrop" onClick={() => setGuideOpen(false)}>
          <div className="guide-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Getting started</h2>
            <p>
              Pick <strong>#</strong> or <strong>✎</strong>, tap digit(s) on the pad (they stay selected), tap cells.
              Last digit tapped is active. <strong>⌫#</strong> clears digits. ◀ ▶ walk consequences after each change.
            </p>
            <p>See <code>documentation/HOW-TO-USE-APP.txt</code> in the repo.</p>
            <button type="button" className="btn primary compact" onClick={() => setGuideOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
