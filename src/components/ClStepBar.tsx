import type { ChainStep } from '../sudoku/types'

interface ClStepBarProps {
  steps: ChainStep[]
  stepIndex: number | null
  onBack: () => void
  onForward: () => void
  onApply?: () => void
  showApply: boolean
}

function stepLabel(step: ChainStep | undefined): string {
  if (!step) return 'No steps'
  switch (step.kind) {
    case 'naked_single':
      return 'Naked single'
    case 'hidden_single':
      return 'Hidden single'
    default:
      return step.kind.replace(/_/g, ' ')
  }
}

export function ClStepBar({ steps, stepIndex, onBack, onForward, onApply, showApply }: ClStepBarProps) {
  const n = steps.length
  const idx = stepIndex
  const step = idx !== null && idx >= 0 && idx < n ? steps[idx] : undefined
  const counter = n === 0 ? '0 steps' : idx === null ? `${n} steps` : `${(idx ?? 0) + 1}/${n}`

  return (
    <div className="cl-bar">
      <button type="button" className="btn icon" onClick={onBack} disabled={n === 0 || idx === null || idx <= 0} aria-label="Previous step">
        ◀
      </button>
      <div className="cl-bar-center">
        <span className="cl-label">{step ? stepLabel(step) : n ? 'Tap ▶ to walk steps' : 'No consequences'}</span>
        <span className="cl-counter">{counter}</span>
      </div>
      <button type="button" className="btn icon" onClick={onForward} disabled={n === 0} aria-label="Next step">
        ▶
      </button>
      {showApply && onApply && (
        <button type="button" className="btn apply compact" onClick={onApply}>
          Apply
        </button>
      )}
    </div>
  )
}
