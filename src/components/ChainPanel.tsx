import { colOf, rowOf } from '../sudoku/grid'
import type { ChainStep } from '../sudoku/types'

interface ChainPanelProps {
  steps: ChainStep[]
  activeStepId: number | null
  onSelectStep: (stepId: number | null) => void
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
  }
}

export function ChainPanel({ steps, activeStepId, onSelectStep, error }: ChainPanelProps) {
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
          Select an empty cell, choose a digit, and tap <strong>Preview</strong> to see forced
          follow-ups.
        </p>
      </section>
    )
  }

  return (
    <section className="chain-panel">
      <h2>Consequence chain ({steps.length})</h2>
      <ol className="chain-list">
        {steps.map((step) => {
          const active = activeStepId === step.id
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`chain-step ${active ? 'active' : ''} kind-${step.kind}`}
                onClick={() => onSelectStep(active ? null : step.id)}
              >
                <span className="chain-kind">{kindLabel(step.kind)}</span>
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
