# UI / UX requirements (next version)

**Status:** Draft — **not signed off**. No UI implementation until you approve this doc and open questions are answered.

**Previous shipped UI:** Rejected (Fill/Propose, Apply chain, scrolling layout, highlight scheme).

**Process:** Agree spec → reply **UX GO** → then code.

---

## Terminology (confirm with user)

| Term | Intended meaning in this doc |
|------|------------------------------|
| **Pane** | A major screen region the user can **cycle to** (like a tab or full-screen slice). |
| **Window** | A view **inside** a pane (e.g. grid view is one window in pane 1). |
*User question: Is pane vs window used in an understood way?* → **Answered Q0 (swipe).**

---

## Principles (guide all design)

1. **Panes:** Screen divided into panes/windows; user **cycles** as needed.
2. **Colour semantics:** Colours apply to **numbers, backgrounds, borders** with consistent meaning.
3. **Space:** Screen space is scarce — no wasted chrome (see change 1).
4. **Help:** User guide **from the UI**, opening at the **section relevant to current context**.
5. **Pane 1:** Holds a **window of current grid state** only (no other windows in this pane yet).
---

~~Secret pane~~ — **removed** (not a agreed requirement; drop unless you reintroduce it).

---

## Changes

### 1. Header / menu

- Remove wasted space: **“Sudoku Studio”**, **version #**, **Import** from the main grid pane.
- **Version** and **Getting started / user guide** live on a **menu** (guide opens at contextual section).

### 2. Sudoku operations — number first

- Always **select digit 1–9 first**, then **tap cell(s)** to apply.
- Each user edit is a **manual change event (MCE)**.

### 3. Consequence navigation

- After an MCE, button(s) to **advance / backtrack** through **consequences** from analysis of that move (adding a solution # or removing an eliminated candidate).

### 4. Analysis on MCE

On each MCE, assess grid for:

- **Singles** — digit valid in only one cell in a region.
- **Doubles / triples / quads** — 2/3/4 digits valid in exactly 2/3/4 cells of a region (**naked or hidden**).
- **Region** = row | column | 3×3 box.

**4.1 — Open:** Step through singles → doubles → triples → quads **one highlight at a time**, vs **toggle** each type on/off, vs **both**? *(User asked — do not assume.)*

**4.2 — Naked singles (NS):** When MCE occurs and **consequence list (CL)** is active, show NS with option to **set NS as solution**; **CL updates**.

**4.3 — CL patterns:** Include **X-Wings, skyscrapers, 2-string kites**, and other known patterns. **Pane:** list **techniques active** for current state with **occurrence count**; option to highlight **each / all** occurrences **in turn** by type.

**4.4 — Strong / weak bi-value chains:** When combinations imply **new eliminations**, **CL updates**.

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
| **Q2** | **CL pane:** Separate pane from grid (swipe to), or strip under grid within pane 1? |
| **Q3** | **Apply all:** One button always visible, or only when pending candidate updates exist? |
| **Q4** | **Pencil marks:** User-only, auto-synced from logic, or merge both? |
| **Q5** | **Multi-cell tap:** After picking digit, one cell per tap only, or drag/select multiple? |
| **Q6** | **Menu:** Hamburger top-right OK for Import, guide, version? |
| **Q7** | **MCE + CL:** Auto-open CL on every MCE, or only when user taps “Analyse”? |

---

## Sign-off

Edit this file or answer open **Q** items in chat → when correct, reply **UX GO**.
