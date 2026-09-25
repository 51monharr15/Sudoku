# UI requirements — confirmed & pending

**Process:** Do not treat UI as final until user signs off here.

---

## Confirmed (user 2026-09-25)

1. **Digit highlight colours:** different colour **per digit** (1–9).
2. **Strong links:** show when **Strong** toggle is on (not gated on selected digits).
3. **Pointing / locked in chains:** **yes** — box↔line reductions (pointing pair/triple, claiming).
4. **Multi-digit logic:** **yes** — e.g. skyscraper-style, not single-digit only.

---

## Pending — need user answer

### Q5 — Digit highlights during Propose preview

When you **Propose** (temporary “what if” grid + chain):

- **A)** Keep digit highlights (tap 5, green cells stay) **on top of** preview colours.
- **B)** Hide digit highlights until you tap **Dismiss preview**.
- **C)** Dim digit highlights but keep them visible.

*Reply A, B, or C.*

### Q6 — What “Fill” is for + rule errors

Two different jobs:

| Mode | Purpose |
|------|---------|
| **Enter puzzle** | Building/importing **givens** (clues), or fixing setup |
| **Solve** | Playing: placing **your** answers in empty cells |

*Which should **Fill** mean by default?* Enter / Solve / both with a separate toggle?

**Rule break (your example):** placing a 2nd same digit in a row/col/box.

*Desired behaviour (pick or describe):*

- Block the digit (not placed)?
- Place but show error (banner + highlight conflicting cells)?
- Allow but mark cell red until fixed?

---

## Not yet implemented (waiting sign-off)

- Per-digit highlight colours (current build uses one green style).
- Strong links only when Strong on (partially there; refine per spec).
- Pointing / locked / skyscraper in solver + chain steps.
- Fill vs Enter + conflict UX.

---

## Current branch note

`cursor/ui-highlight-propose-a929` has exploratory UI. Treat as **draft** until this doc is approved and work is explicitly requested.
