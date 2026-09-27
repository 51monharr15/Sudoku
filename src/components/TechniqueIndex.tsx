const TECHNIQUES = [
  'naked_single',
  'hidden_single',
  'naked_pair',
  'hidden_pair',
  'naked_triple',
  'pointing',
  'x_wing',
  'xy_wing',
  'skyscraper',
  'two_string_kite',
  'strong_link',
] as const

interface TechniqueIndexProps {
  counts: Record<string, number>
  enabled: Record<string, boolean>
  onToggle: (key: string) => void
}

export function TechniqueIndex({ counts, enabled, onToggle }: TechniqueIndexProps) {
  return (
    <div className="tech-index">
      <h2 className="tech-title">Techniques</h2>
      <p className="tech-hint">Swipe back for grid. Toggle highlights (prototype).</p>
      <ul className="tech-list">
        {TECHNIQUES.map((key) => (
          <li key={key}>
            <label className="tech-row">
              <input
                type="checkbox"
                checked={enabled[key] ?? false}
                onChange={() => onToggle(key)}
                disabled={(counts[key] ?? 0) === 0}
              />
              <span className="tech-name">{key.replace(/_/g, ' ')}</span>
              <span className="tech-count">{counts[key] ?? 0}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
