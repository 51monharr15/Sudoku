import { TECHNIQUE_ROWS, type TechniqueKey } from '../sudoku/techniqueStats'

interface TechniqueIndexProps {
  counts: Record<TechniqueKey, number>
  active: Partial<Record<TechniqueKey, boolean>>
  onSelect: (key: TechniqueKey) => void
}

export function TechniqueIndex({ counts, active, onSelect }: TechniqueIndexProps) {
  return (
    <div className="tech-index">
      <p className="tech-hint">
        Tap a row to show that pattern on the grid above. The number is how many exist now (0 = none to show).
      </p>
      <ul className="tech-list">
        {TECHNIQUE_ROWS.map(({ key, title }) => {
          const count = counts[key] ?? 0
          const on = active[key] ?? false
          return (
            <li key={key}>
              <button
                type="button"
                className={`tech-row-btn ${on ? 'on' : ''} ${count === 0 ? 'zero' : ''}`}
                onClick={() => onSelect(key)}
                disabled={count === 0}
              >
                <span className="tech-abbr">{key}</span>
                <span className="tech-title-text">{title}</span>
                <span className="tech-count">{count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
