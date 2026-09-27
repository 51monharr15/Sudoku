# UI / UX requirements (next version)

**Status:** **UX GO** — visual/engine prototype on `main` (2026.09.27.1). Refine after testing.

**Previous shipped UI:** Rejected (Fill/Propose, Apply chain, scrolling layout, highlight scheme).

**Process:** Agree spec → reply **UX GO** → then code.

---

## Terminology (confirm with user)

| Term | Meaning |
|------|---------|
| **Pane** | Fixed **area of the screen**. |
| **Window** | The **info set shown** in a pane **right now**. **Swipe left/right** changes window. |

*“Secret” = speech-to-text for **separate** (another pane), not hidden.*

---

## Principles (guide all design)

1. **Panes:** Screen divided into panes/windows; user **cycles** as needed.
2. **Colour semantics:** Colours apply to **numbers, backgrounds, borders** with consistent meaning.

**Colour semantics (Q5b — in progress):**

- **Rejected:** 9 text colours for digits 1–9 (candidates are read by **position** in the 9-slot cell).
- **User direction:** **Background shade** by **candidate count in the cell** (singleton / doubleton / tripleton / quad = 1/2/3/4 pencils left in that cell) may work as visual grammar.
- **Pad digit selected:** still **whole cell** if solution/given matches; **1/9 slice** if that digit is still a candidate (§5b). Shade by count is **orthogonal** (can combine).

**Cell contents (no “empty” cells):** each cell is **given**, **entered/worked solution**, or a **candidate set** (pencils). Highlights apply when **rules + context** warrant (pad digit selected, CL step, etc.).

**Q5b — visual grammar:** Count-based **background shade** (singleton / doubleton / tripleton / quad **member**) is a **draft**; **will change after a visual prototype**. Do not lock nine text colours. Candidate identity = **position in 9-slot cell**, not hue per digit.
3. **Space:** Screen space is scarce — no wasted chrome (see change 1).
4. **Help:** User guide **from the UI**, opening at the **section relevant to current context**.
5. **Pane 1:** Holds **current grid state** (main play pane).
6. **Separate pane(s):** Swipe to other panes for **different** UI (e.g. technique list / CL) or **duplicate** controls if we agree that later — not hidden; just another swipe target.

---

## Changes

### 1. Header / menu

- Remove wasted space: **“Sudoku Studio”**, **version #**, **Import** from the main grid pane.
- **Version**, **Import**, **Getting started / user guide** (context section) on top-right **☰**; room on that **row/column** for other compact actions — assign in prototype.

### 2. Sudoku operations — number first

- Always **select digit 1–9 first**, then **tap cell(s)** to apply.
- Each user edit is a **manual change event (MCE)**.

### 3. Consequence list (CL) — navigation (Q2 held in spec)

- **Every MCE** recalculates the CL from the new grid state.
- **Main grid window:** show **current step** in the chain **on the board** (highlights) + **Forward / Back** (no scroll-off controls).
- **Q2 (user undecided):** *Held for build:* stepping stays on **grid pane**; swipe to another **window** only for optional **technique index** (name + count), not required for fwd/back.

### 4. CL step order (after MCE)

Fixed start:

1. **Naked singles**
2. **Hidden singles**

Then (in this order; each step is one find in the list — **Q1: toggles + step through**):

3. Naked pairs  
4. Hidden pairs  
5. Naked triples  
6. Hidden triples  
7. Naked / hidden quads  
8. Pointing pairs / triples (box ↔ line)  
9. X-Wing, Swordfish (etc. when present)  
10. XY-Wing, XYZ-Wing  
11. Skyscraper, 2-string kite  
12. Strong / weak link eliminations  

When **naked singles** appear in CL: offer **set as solution** → new MCE → **CL rebuilds**.

Region = row | column | 3×3 box.

### 4b. Candidates (Q4)

- **At display / after givens:** candidates = digits **not already placed** in that cell’s row, column, or box (standard exclusion).
- **Only an MCE** changes a **solution #** and/or a **candidate #** on the grid.
- **CL does not silently edit** the grid; it **highlights** findings (naked/hidden single, bi-values, chains, eliminations, etc.).
- **Apply** (when CL has eliminations but no singles to place): user confirms **candidate eliminations** CL proposes (e.g. bi-value in a box ruling out old pencils). Ties to **Q3** — Apply control visible when there is something to apply.

### 5. Compact numpad

- **Mode toggle:** **solution #** vs **candidate / pencil**.
- **Digit selected (1–9):** stays selected until user clears it or picks another digit; **highlights** matching cells on the grid (see **Q5a**).
- **While digit selected:** each **cell tap** set/toggles **solution** or **candidate** (per mode) → **MCE**; user may tap **many cells** in sequence without re-tapping the digit.
- **Last selected digit** = active for those taps.

### 5b. Digit highlight (**Q5a = C**)

Pad digit selected:

- **Solution / given:** highlight **whole cell** if that digit is the cell value (given or entered).
- **Candidate:** highlight **that digit’s 1/9 slice** where the digit is still a valid candidate.

**Q5b — visual grammar (pick one):** nine fill colours is noisy; grouped hues (1/4/7, 2/5/8…) still confusing. Options in § Colour semantics below.
- **Colour (constant semantics):**
  - **Set #** → highlight **whole cell**.
  - **Candidate** → highlight **that digit’s 1/9 slice** of the cell.

### 6. Remove redundant mode buttons

- Remove **Fill**, **Propose**, and similar mode buttons whose job is covered by **digit + pencil/solution toggle + MCE + CL stepping** (space + UX simplification).

### 7. MCE — borders, rules, stepped apply

**7.1 — Candidate effects:** On MCE, mark cells whose candidates are affected (e.g. no longer valid after a solution # elsewhere) — **do not auto-refresh display** until user steps or **Apply all**.

**7.2 — Rule clash:** If solution # breaks rules (duplicate in region), **red borders** on **existing** and **new** cell; clear red when # removed/changed. *(Example pattern for other behaviours.)*

**7.3 — Do not assume interaction details; ask clarifying questions before coding.**

### 8. Development environment (user)

- Repo on **Android via Termux**; run with **npm** and **localhost** dev server on Termux Linux filesystem. (Same web app; layout must fit phone viewport.)

---

## Layout constraint (carried forward)

- **Everything visible without scrolling** on a typical phone where possible (grid + compact numpad + CL controls).
- **Version** small at **bottom**; duplicate **VERSION** file (not read by app at runtime).

---

## Open questions (need answers before UX GO)

| ID | Question |
|----|----------|
| **Q0** | **Pane vs window:** Is the table above what you mean? Should “cycle panes” be bottom tabs, swipe, or menu? → **Answer: B — swipe left/right** |
| **Q1** | **4.1:** Highlight technique types — **step through**, **toggles**, or **both**? → **Answer: C — both** |
| **Q2** | CL layout → **Recommendation Q2-R** (§ below); confirm or edit before build. |
| **Q3** | **Apply all:** Show only when there are pending updates to apply (hide when it would do nothing). → **Answer: B** |
| **Q4** | Candidates + MCE + CL + Apply → **Answered:** see §4b (auto baseline; MCE only edits; CL highlights; Apply for eliminations). |
| **Q5** | Digit selected → highlight grid; tap many cells (set/toggle) until digit deselected or another digit chosen → **Answered:** §5b. |
| **Q5a** | Highlight value cells + candidate slices → **C** |
| **Q5b** | Visual grammar → **Recommendation Q5b-R** (§ below); tune in prototype. |
| **Q6** | Top-right **☰**: Import, guide (context section), version → **Yes.** Same header row/column may hold **other compact controls** — use space wisely (TBD in prototype). |
| **Q7** | After MCE + CL rebuild → **Answer: J-R** — clear CL step until **Forward**; optional “N steps found”. |

### Q7 — CL after MCE (analysis)

**Inconsistency:** Yes — old CL steps describe **old** candidate/solution state. After an MCE (or **Apply** eliminations), that CL is **invalid**; only the **new** CL matches the grid.

| Option | Behaviour | Pros | Cons |
|--------|-----------|------|------|
| **J-A** | Auto show **step 1** of new CL | Immediate feedback | May surprise if user wasn’t done reviewing |
| **J-B** | Keep old highlight until **Forward** | — | **Stale/wrong** highlights (reject) |
| **J-C** | Auto step 1 only if old CL finished | Middle ground | Hard to define “finished” |
| **J-R** *(recommended)* | Rebuild CL; **clear step** (no CL highlight) until user taps **Forward**; optional one-line “N steps found” | Grid always truthful; user enters chain deliberately | One extra tap |

**Chosen:** **J-R** (Q7).

---

## Q2-R — CL layout (recommendation)

**Problem:** CL text list + grid + numpad must fit **without scroll**; fwd/back belongs with the grid (Q7 J-R).

| Option | Layout | Verdict |
|--------|--------|---------|
| **2-A** | CL list strip under grid on same window | Eats vertical space; fights numpad |
| **2-B** | Separate full pane only for CL | Swipe away from grid while stepping — awkward |
| **2-C** | **Two swipe windows** in play area | **Recommend** |

**Q2-R (use for prototype):**

- **Fixed thin top row:** ☰ + optional icons (same row, use wisely).
- **Fixed bottom:** vn + compact numpad + pencil/solution toggle.
- **Middle (swipe left/right):**
  - **Window A (default):** Grid + one line **`[◀] Hidden single · 3/12 [▶]`** + **Apply** when pending + faint **`12 steps`** (tap = nothing or opens Window B — optional).
  - **Window B:** **Technique index** — each technique, **count**, **toggle** show on grid, **step** through occurrences (Q1 both). No grid on B (grid stays on A when you swipe back).

CL **highlights always draw on grid in Window A**; Window B is control surface only.

---

## Q5b-R — Visual grammar (recommendation)

**Goals:** Read candidates by **position**; no nine hue families; readable at a glance; amend after prototype.

| Layer | Rule |
|-------|------|
| **Given** | Bold light digit; **no** count shade |
| **User solution** | Agreed “user” colour (e.g. blue); **no** count shade |
| **Candidate cell** | Always show **9 fixed slots**; digit in slot = still candidate |
| **Count shade** | Same hue (neutral grey); **4 luminance steps** for 1 / 2 / 3 / 4 candidates in cell (singleton → quad) |
| **Pad digit selected** | **Value match:** accent **ring** on whole cell. **Candidate match:** accent **fill ~35%** on **that slot only** (not nine colours) |
| **CL step active** | **Amber outline** on cells in current finding; **dashed outline** on elimination targets |
| **Rule clash** | **Red outline** on conflicting cells (MCE example pattern) |

Reject: nine text colours; yellow/green digit families. Prototype may adjust grey steps and accent hex only.

---

## Sign-off

Edit this file or answer open **Q** items in chat → when correct, reply **UX GO**.
