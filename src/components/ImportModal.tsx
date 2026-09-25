import { useState } from 'react'
import { SAMPLE_PUZZLE } from '../sudoku/import'

interface ImportModalProps {
  open: boolean
  onClose: () => void
  onImport: (text: string) => void
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [text, setText] = useState('')

  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div className="modal">
        <h2 id="import-title">Import puzzle</h2>
        <p className="modal-help">
          Standard <strong>81-character</strong> string (Sudoku Exchange / .sdk: digits 1–9,{' '}
          <code>0</code> or <code>.</code> for empty), or <strong>9 lines</strong> of nine symbols.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={SAMPLE_PUZZLE}
          rows={6}
          spellCheck={false}
        />
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={() => setText(SAMPLE_PUZZLE)}>
            Sample
          </button>
          <button type="button" className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              onImport(text)
              setText('')
              onClose()
            }}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  )
}
