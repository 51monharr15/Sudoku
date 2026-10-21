import {
  TECHNIQUE_LABEL,
  TECHNIQUE_ORDER,
  type TechniqueKey,
} from '../sudoku/techniqueStats'

interface TechniqueIndexProps {
  counts: Record<TechniqueKey, number>
  enabled: Partial<Record<TechniqueKey, boolean>>
  onToggle: (key: TechniqueKey) => void
}

export function TechniqueIndex({ counts, enabled, onToggle }: TechniqueIndexProps) {
  return (
    <div className="tech-index">
      <h2 className="tech-title">Consequences</h2>
      <p className="tech-hint">
        Swipe ← for grid. Turn a row on to see that pattern on the board (counts are how many exist now).
      </p>
      <ul className="tech-list">
        {TECHNIQUE_ORDER.map((key) => {
          const count = counts[key] ?? 0
          return (
            <li key={key}>
              <label className={`tech-row ${count === 0 ? 'tech-row-dim' : ''}`}>
                <input
                  type="checkbox"
                  checked={enabled[key] ?? false}
                  onChange={() => onToggle(key)}
                  disabled={count === 0}
                />
                <span className="tech-abbr">{key}</span>
                <span className="tech-count">{count}</span>
              </label>
              {enabled[key] && (
                <p className="tech-desc">{TECHNIQUE_LABEL[key]}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
