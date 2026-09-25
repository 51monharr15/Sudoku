# UI / UX requirements (next version)

**Status:** Draft — **not signed off**. No further UI implementation until you approve this doc.

**Previous UI (2026-09-25 sign-off):** **Rejected** by user — Fill/Propose, Apply chain, highlights, scrolling layout.

**Process:** Agree this spec → then code.

---

## Layout

1. **Everything visible without scrolling** on a typical phone (grid + controls + step readout).
2. **Compact controls** — current large buttons waste space; reduce padding/size.
3. **Version number** at **bottom** of screen (small). Separate duplicate: repo `VERSION` file + hardcoded UI string.

---

## Grid and candidates

1. **Candidates auto-created at puzzle start** (and maintained after edits) — always on by default; not a confusing toggle unless we agree one later.
2. **Grid is the focus** — minimal chrome.

---

## Input model (replaces Fill / Propose)

User selects:

1. **A digit (1–9)** on the numpad.
2. **Mode toggle:** **pencil** (candidate mark) vs **set** (place solution in cell).

Then **tap a cell**:

| Mode | Cell action |
|------|-------------|
| **Pencil** | Add/remove that digit as pencil mark in the cell (where allowed). |
| **Set** | Set cell to selected digit (solution), subject to rules. |

**Remove** Fill / Propose labels and the current dual-mode bar unless renamed to match the above after agreement.

---

## Consequences (step-by-step)

After **either** pencil change **or** set placement:

1. Run an **automatic step-by-step consequence walk** from the simple **1–9 in each region** rule upward.
2. Steps must **identify and show** (as we implement engine support):
   - Singles / region completion
   - **Pairs / triples** (naked/hidden as agreed)
   - **Pointing** (box ↔ line)
   - **Strong links**
3. User can move **step X → step X+1** (prev/next); board highlights match **current step only** (highlight scheme **TBD** — current colours rejected as not useful).

---

## Explicitly not agreed / remove from UI until spec says otherwise

- **Apply chain** — remove from UI; was not agreed UX.
- **Dismiss preview** bar as currently implemented — replace with agreed step navigation only.
- Current **highlight / digit colour** scheme — redesign in spec before coding.

---

## Open for your answers (before sign-off)

1. Pencil marks: user-only notes, or always synced from auto-candidates, or both?
2. **Set** on conflict: allow + show clash, or block?
3. Step panel: one line at bottom vs thin strip under grid?
4. Import / Clear / Strong n=2–4: which stay on main screen vs overflow menu?

---

## Sign-off

When this doc is right, reply **UX GO** (or edits here first).
