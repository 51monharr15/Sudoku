# UI requirements

**Status:** Signed off (2026-09-25).

**Process:** Spec first; implement; ship after sign-off.

---

## Confirmed (accepted design)

1. **Digit colours:** different per digit (1–9).
2. **Strong links:** when **Strong** toggle is on.
3. **Pointing / locked** in chains — yes (box↔line).
4. **Multi-digit** chains — yes (e.g. skyscraper).
5. **Propose preview:** **C** — dim digit highlights, still visible.
6. **Illegal placement:** **allow + show** conflict cells; clearing may remove **clash** cells, not necessarily the last entry.
7. **Fill:** **Solve** — use **Import** for new givens; Fill only empty/non-given cells.

---

## Shipped on `cursor/ui-highlight-propose-a929`

- Per-digit highlight colours in UI.
- Q5 C — dim digit matches during propose preview.
- Conflict banner + highlights + **Clear clash**.
- Multi-digit selection, number-first input, strong links n=2–4, chain prev/next.

---

## Follow-up (not blocking sign-off)

- Pointing / locked / skyscraper steps in the implication engine and chain panel.

---

## Branch

`cursor/ui-highlight-propose-a929` — signed off; merge to `main` when ready.
