# Sudoku Studio — User Guide

Sudoku Studio is a **mobile-first web app** (installable as a PWA) for solving Sudoku on phone or desktop. It helps you **see what a move would force** before you commit it—not only whether a digit is legal in one cell.

---

## Quick start

1. Open the app in your browser (or install it to your home screen).
2. A sample puzzle loads automatically.
3. Tap **Import** to paste your own puzzle, or play the sample.
4. Use **Fill** mode to enter answers; use **Propose** mode to explore consequences.

---

## Screen layout

```
┌─────────────────────────────────┐
│ Sudoku Studio          [Import] │  ← header
├─────────────────────────────────┤
│                                 │
│         9 × 9 grid              │  ← main board
│                                 │
├─────────────────────────────────┤
│ [Fill] [Propose] [Candidates]   │  ← mode toggles
├─────────────────────────────────┤
│  1  2  3  4  5                  │
│  6  7  8  9  [Clear]            │  ← numpad
├─────────────────────────────────┤
│ [Apply chain] [Dismiss preview] │  ← only in Propose + preview
├─────────────────────────────────┤
│ Consequence chain               │  ← scrollable step list
└─────────────────────────────────┘
```

On a small phone, scroll down to read the full chain after a proposed move.

---

## The grid

### Digits

| Appearance | Meaning |
|------------|---------|
| **White, bold** | **Given** — part of the imported puzzle; cannot be edited or cleared |
| **Light blue** | **Your entry** — placed in Fill mode or via **Apply chain** |

### Cell selection

- Tap any cell to select it (red outline).
- Selected **givens** cannot be changed.

### 3×3 boxes

Thicker lines mark the nine 3×3 blocks (standard Sudoku regions).

### Pencil marks (candidates)

When **Candidates** is on, empty cells show small 1–9 marks where a digit is still possible given **current** placements (row, column, and box).

- Candidates **update automatically** as you fill cells.
- They are **not** saved separately; they are always recomputed from the grid.

Turn **Candidates** off for a cleaner view when you do not need marks.

---

## Modes: Fill vs Propose

### Fill (default)

Use this for normal solving.

1. Select an empty cell.
2. Tap a digit on the numpad.
3. The digit is written immediately (if the cell is not a given).

**Clear** removes **your** digit from the selected cell. Givens are unaffected.

Fill mode does **not** run consequence analysis; it only updates the grid and refreshes candidates.

### Propose

Use this to ask: *“If I put this digit here, what else must follow?”*

1. Turn on **Propose** (toggle highlights red when active).
2. Select an **empty** cell.
3. Tap a digit.

The app **does not** change the puzzle yet. It runs a **preview**:

- **Invalid** move (clash with givens/your entries, or cell already filled): an error appears in the chain panel.
- **Valid** move: the board shows a **preview grid** with cascading forced placements, and the **Consequence chain** lists every step.

#### Preview highlights

| Color / effect | Meaning |
|----------------|---------|
| Red tint + strong outline | **Proposed** placement |
| Yellow tint | **Elimination** — a candidate removed in a peer cell because of the proposal |
| Blue tint | **Forced** placement — naked or hidden single after propagation |
| Purple outline (when a chain step is selected) | **Related** cells for that step |

Tap a step in the chain list to focus that step on the board (outline on the step’s cell).

#### After preview

| Button | Action |
|--------|--------|
| **Apply chain** | Writes the **full preview result** (proposal + all forced singles from the analysis) onto the puzzle |
| **Dismiss preview** | Returns to the grid **before** the preview; nothing is saved from the proposal |

To try another digit or cell, dismiss preview or select another cell and tap a new digit in Propose mode.

---

## Consequence chain (what each step means)

Steps appear in order after a valid proposed move:

1. **Proposed** — the digit you hypothetically place.
2. **Eliminate** — candidates removed in cells that share a row, column, or box with the proposal (direct peer effect).
3. **Naked single** — a cell has only one candidate left, so that digit is forced.
4. **Hidden single** — within a row, column, or box, a digit can only go in one cell; that placement is forced.

The engine repeats naked/hidden single propagation until no more such steps are found **within these rules**. It does **not** yet apply advanced tactics (pairs, X-Wing, coloring chains, etc.)—see [Future development](#future-development).

---

## Importing puzzles

Tap **Import** in the header.

### Supported formats

1. **81-character string** (Sudoku Exchange / common `.sdk` style)  
   - Row 1 left → right, then row 2, … row 9.  
   - Digits `1`–`9` for givens.  
   - `0`, `.`, `-`, or `_` for empty cells.  
   - Spaces are ignored in a single-line string.

2. **Nine lines of nine symbols**  
   - One row per line.  
   - Extra spaces or `|` separators are stripped.  
   - Lines starting with `#` are treated as comments and skipped.

### Import actions

- **Sample** — fills the textarea with a valid demo puzzle.  
- **Import** — loads the puzzle; all non-zero cells become **givens**.  
- **Cancel** — closes without changing the board.

If parsing fails, a red banner under the header explains the problem.

---

## Install as an app (PWA)

On **Android (Chrome)** or **iOS (Safari)**:

- Use the browser menu → **Add to Home Screen** / **Install app**.

Benefits:

- Full-screen, app-like window  
- Offline use after the first visit (cached assets via service worker)

**Note:** Install and offline caching work best over **HTTPS**. See [Hosting on Apache (FTP only)](DEPLOYMENT.md).

---

## Tips for good UX

- **Phone:** Use portrait; scroll to the chain panel after proposing a move.  
- **Exploring:** Propose several digits in the same cell (dismiss between tries) to compare chains.  
- **Solving:** Use Fill for confident entries; switch to Propose when you want to see forced follow-ups.  
- **Candidates off** when the grid is crowded or you are doing mental pencil marks on paper.

---

## Limitations (current version)

- No undo/redo history.  
- No save/load of partial progress in the browser (refresh returns to last imported puzzle unless you re-import).  
- Consequence analysis uses **placement + candidate elimination + naked/hidden singles** only.  
- No difficulty rating or puzzle generator built in.

---

## Future development

Planned or natural extensions (not all implemented yet):

| Area | Direction |
|------|-----------|
| **Tactics** | Pointing pairs, box/line, naked/hidden subsets, fish, simple coloring |
| **Chains** | Forcing chains, ALS, nicer graph view of implications |
| **Progress** | LocalStorage save, undo stack, “bookmarks” on cells |
| **Puzzles** | Built-in generator, difficulty filter, `.sdm` / newspaper formats |
| **Import** | Paste from URL, QR, image OCR (longer term) |
| **Accessibility** | Keyboard navigation, high-contrast theme, screen reader labels |
| **Multi-user** | Not required for core app; any server sync would be optional and separate from static hosting |

If you host the static build yourself, “future execution” means: **build a new `dist/` when releases change, upload via FTP, hard-refresh or wait for the service worker to update.**

Technical deployment details: **[DEPLOYMENT.md](./DEPLOYMENT.md)**.
