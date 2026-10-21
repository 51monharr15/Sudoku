import { colOf, maskHas, rowOf } from './grid'
import type { StrongLinkGroup } from './strongLinks'
import type { CandidateMask, Digit } from './types'

export type EdgeMark = 'top' | 'bottom' | 'left' | 'right'
export type UnitKind = 'row' | 'col' | 'box'

export type CandStrongMark = {
  cell: number
  digit: Digit
  edges: EdgeMark[]
  unit: UnitKind
  setSize: number
}

export function candMarkKey(cell: number, digit: Digit): string {
  return `${cell}:${digit}`
}

function boxOrigin(boxIndex: number): { br: number; bc: number } {
  const br = Math.floor(boxIndex / 3) * 3
  const bc = (boxIndex % 3) * 3
  return { br, bc }
}

function distToBoxEdge(cell: number, boxIndex: number): {
  top: number
  bottom: number
  left: number
  right: number
} {
  const r = rowOf(cell)
  const c = colOf(cell)
  const { br, bc } = boxOrigin(boxIndex)
  return {
    top: r - br,
    bottom: br + 2 - r,
    left: c - bc,
    right: bc + 2 - c,
  }
}

function edgesForUnit(unit: UnitKind, cell: number, unitIndex: number): EdgeMark[] {
  switch (unit) {
    case 'col':
      return ['left', 'right']
    case 'row':
      return ['top', 'bottom']
    case 'box': {
      const d = distToBoxEdge(cell, unitIndex)
      const side: EdgeMark = d.left <= d.right ? 'left' : 'right'
      const vert: EdgeMark = d.top <= d.bottom ? 'top' : 'bottom'
      return [side, vert]
    }
    default:
      return []
  }
}

/** Per-candidate edge marks for a strong link group (double/triple/quad). */
export function marksForStrongGroup(
  group: StrongLinkGroup,
  candidates: CandidateMask[],
): CandStrongMark[] {
  const out: CandStrongMark[] = []
  for (const cell of group.cells) {
    for (const digit of group.digits) {
      if (!maskHas(candidates[cell], digit)) continue
      out.push({
        cell,
        digit,
        edges: edgesForUnit(group.unit, cell, group.unitIndex),
        unit: group.unit,
        setSize: group.cells.length,
      })
    }
  }
  return out
}

export function allStrongLinkCandMarks(
  groups: StrongLinkGroup[],
  candidates: CandidateMask[],
): Map<string, CandStrongMark> {
  const out = new Map<string, CandStrongMark>()
  for (const g of groups) {
    for (const m of marksForStrongGroup(g, candidates)) {
      const k = candMarkKey(m.cell, m.digit)
      const prev = out.get(k)
      if (!prev) {
        out.set(k, m)
        continue
      }
      const edges = new Set([...prev.edges, ...m.edges])
      out.set(k, { ...prev, edges: [...edges] })
    }
  }
  return out
}
