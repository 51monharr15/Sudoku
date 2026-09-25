import { colOf, rowOf } from '../sudoku/grid'
import type { ChainStep } from '../sudoku/types'

interface ChainPanelProps {
  steps: ChainStep[]
  activeStepId: number | null
  onSelectStep: (stepId: number | null) => void
  onStepOffset: (delta: number) => void
  error?: string
}

function kindLabel(kind: ChainStep['kind']): string {
  switch (kind) {
    case 'proposed':
      return 'Proposed'
    case 'eliminate':
      return 'Eliminate'
    case 'naked_single':
      return 'Naked single'
    case 'hidden_single':
      return 'Hidden single'
    case 'pointing':
      return 'Pointing'
    case 'locked':
      return 'Locked'
    case 'strong_link':
      return 'Strong link'
  }
}

export function ChainPanel({
  steps,
  activeStepId,
  onSelectStep,
  onStepOffset,
  error,
}: ChainPanelProps) {
  if (error) {
    return (
      <section className="chain-panel">
        <h2>Proposed move</h2>
        <p className="chain-error">{error}</p>
      </section>
    )
  }

  if (steps.length === 0) {
    return (
      <section className="chain-panel">
        <h2>Consequence chain</h2>
        <p className="chain-hint">
          Propose: select digit(s), tap cell. Step with Prev/Next when a chain exists.
        </p>
      </section>
    )
  }

  const idx = steps.findIndex((s) => s.id === activeStepId)
  const stepNum = idx >= 0 ? idx + 1 : 1

  return (
    <section className="chain-panel">
      <div className="chain-head">
        <h2>Chain {stepNum}/{steps.length}</h2>
        <div className="chain-nav">
          <button type="button" className="btn ghost small" onClick={() => onStepOffset(-1)}>
            Prev
          </button>
          <button type="button" className="btn ghost small" onClick={() => onStepOffset(1)}>
            Next
          </button>
        </div>
      </div>
      <ol className="chain-list">
        {steps.map((step, i) => {
          const active = activeStepId === step.id
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`chain-step ${active ? 'active' : ''} kind-${step.kind}`}
                onClick={() => onSelectStep(active ? null : step.id)}
              >
                <span className="chain-kind">
                  {i + 1}. {kindLabel(step.kind)}
                </span>
                <span className="chain-detail">
                  R{rowOf(step.cell) + 1}C{colOf(step.cell) + 1} · {step.digit}
                </span>
                <span className="chain-reason">{step.reason}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
