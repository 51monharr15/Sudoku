import { APP_VERSION } from '../appVersion'

interface AppMenuProps {
  open: boolean
  onClose: () => void
  onImport: () => void
  onGuide: () => void
}

export function AppMenu({ open, onClose, onImport, onGuide }: AppMenuProps) {
  if (!open) return null
  return (
    <div className="menu-backdrop" role="presentation" onClick={onClose}>
      <nav className="menu-panel" role="menu" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="menu-item" onClick={() => { onImport(); onClose() }}>
          Import puzzle
        </button>
        <button type="button" className="menu-item" onClick={() => { onGuide(); onClose() }}>
          Getting started
        </button>
        <p className="menu-version">Version {APP_VERSION}</p>
      </nav>
    </div>
  )
}
