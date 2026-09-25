# UI requirements

**Process:** Spec first; implement after user says **go ahead**.

---

## Confirmed

1. **Digit colours:** different per digit (1–9).
2. **Strong links:** when **Strong** toggle is on.
3. **Pointing / locked** in chains — yes (box↔line).
4. **Multi-digit** chains — yes (e.g. skyscraper).
5. **Propose preview:** **C** — dim digit highlights, still visible.
6. **Illegal placement:** **allow + show** conflict cells; clearing may remove **clash** cells, not necessarily the last entry.
7. **Fill:** user unsure Enter vs Solve. **(default for now)** **Solve** — use **Import** for new givens; Fill only empty/non-given cells.

---

## Still to build (after go ahead)

- Per-digit highlight colours in UI.
- Q5 C dim during preview.
- Conflict banner + highlights + “Clear clash”.
- Pointing / locked / skyscraper in engine + chain.

---

## Branch

`cursor/ui-highlight-propose-a929` = draft until signed off.
