# UI design — open decisions

Implemented defaults are marked **(default)**. Tell us what you prefer.

---

## Number selection vs Fill

**(default)** Tap a numpad digit toggles highlight on/off.  
Fill: pick digit(s), then tap cell (uses **last** selected digit).  
Propose: pick digit, then tap cell.

**Open:** Should tap digit **without** highlight mode still work as “cell first, then digit” only?

---

## Colours for multiple digits

**(default)** One highlight style; cells match if **any** selected digit fits.

**Open:** Different colour per selected digit (1=red, 2=blue, …)?

---

## Strong links — definition

**(default)** For n=2|3|4:

- **Hidden:** digit X as candidate in exactly n cells in a row/col/box.  
- **Naked:** n cells whose union of candidates is exactly n digits.

**Open:** Include **bivalue strong edges** (X candidate in exactly two cells in unit) as separate from hidden pair?

**Open:** Show strong links only when at least one selected digit is involved, or always when n toggle on?

---

## Chain steps — taxonomy

**(default)** Engine still emits: proposed, eliminate, naked_single, hidden_single.  
UI adds **Prev / Next** stepping. Labels “pointing / locked” reserved for a later solver pass.

**Open:** Should “locked candidate” mean pointing pair + line/box reduction in your vocabulary?

**Open:** “If not A must be B” — binary chain on one digit only, or grouped implications?

---

## Pencil highlight

**(default)** Non-selected pencil marks stay visible but dimmed; selected digits bright.

**Open:** Hide all other pencil marks entirely when filtering?

---

## Preview vs highlights

**(default)** Propose preview dims digit highlights until dismissed.

**Open:** Keep digit highlights visible during preview?

---

## Phone layout

**(default)** Strong n (2/3/4) on a second row under mode bar.

**Open:** Move numpad above grid?
