export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type CellValue = Digit | 0

export type Grid = CellValue[]

export type CandidateMask = number

export const ALL_CANDIDATES: CandidateMask = 0b1111111110

export type ChainStepKind =
  | 'proposed'
  | 'eliminate'
  | 'naked_single'
  | 'hidden_single'

export interface ChainStep {
  id: number
  kind: ChainStepKind
  cell: number
  digit: Digit
  /** Human-readable reason */
  reason: string
  /** Parent step id for tree view; -1 for root */
  parentId: number
  /** Cells visually implicated by this step */
  relatedCells: number[]
}

export interface ProposedMoveAnalysis {
  valid: boolean
  error?: string
  /** Final grid if move were applied and singles propagated */
  resultValues: Grid
  /** Candidate masks after propagation */
  resultCandidates: CandidateMask[]
  steps: ChainStep[]
  /** cell -> highlight role */
  highlights: Map<number, 'proposed' | 'elimination' | 'forced' | 'peer'>
  /** cell -> eliminated digits from proposed move chain */
  eliminations: Map<number, Digit[]>
}

export interface PuzzleImportResult {
  values: Grid
  givens: boolean[]
  format: string
  warnings: string[]
}
