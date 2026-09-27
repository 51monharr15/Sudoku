# UI / UX requirements (next version)

**Status:** Draft — **not signed off**. No UI implementation until you approve this doc and open questions are answered.

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
3. **Space:** Screen space is scarce — no wasted chrome (see change 1).
4. **Help:** User guide **from the UI**, opening at the **section relevant to current context**.
5. **Pane 1:** Holds **current grid state** (main play pane).
6. **Separate pane(s):** Swipe to other panes for **different** UI (e.g. technique list / CL) or **duplicate** controls if we agree that later — not hidden; just another swipe target.

---

## Changes

### 1. Header / menu

- Remove wasted space: **“Sudoku Studio”**, **version #**, **Import** from the main grid pane.
- **Version** and **Getting started / user guide** live on a **menu** (guide opens at contextual section).

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
- **Highlight digits** stay on until turned off; **last selected** = current digit for grid updates.
- **Cell tap:** toggles **set #** or **candidate** → triggers **MCE**.
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
| **Q2** | CL layout separate vs strip → **user undecided; spec holds:** fwd/back + step on **grid window**; technique index optional swipe window. |
| **Q3** | **Apply all:** Show only when there are pending updates to apply (hide when it would do nothing). → **Answer: B** |
| **Q4** | Candidates + MCE + CL + Apply → **Answered:** see §4b (auto baseline; MCE only edits; CL highlights; Apply for eliminations). |
| **Q5** | **Multi-cell tap:** After picking digit, one cell per tap only, or drag/select multiple? |
| **Q6** | **Menu:** Hamburger top-right OK for Import, guide, version? |
| **Q7** | **MCE + CL:** Auto-open CL on every MCE, or only when user taps “Analyse”? |

---

## Sign-off

Edit this file or answer open **Q** items in chat → when correct, reply **UX GO**.
