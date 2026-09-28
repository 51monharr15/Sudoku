# Agent brief — Simon / Sudoku on Android

## User goal

**Runtime → feedback → agent changes → refresh → feedback.** No lectures about git, Origin, or proot unless the user explicitly asks.

## Phone test loop (only supported path)

1. User downloads repo tarball from **Codebase → Settings → Advanced → Download**.
2. User runs `scripts/android-refresh.sh` → installs to **`~/storage/shared/Sudoku-Studio`** (Android-visible storage; configurable via `~/storage/shared/sudoku-test.env`).
3. **Dev:** `scripts/android-dev.sh` → `http://127.0.0.1:5173/`
4. **Staged:** `scripts/android-staged.sh` → `http://127.0.0.1:4173/` (production build)

See **`TEST-ON-PHONE.txt`** (short).

## Do not

- Push Termux **Origin CLI**, **proot**, or **git pull** as the default update path.
- Multi-step auth journeys unless user requests git.
- Long docs when `TEST-ON-PHONE.txt` suffices.

## UI work

Spec: `docs/UI-UX-REQUIREMENTS.md`. “Prototype” = implement for **visual review**, iterate on feedback (especially Q5b highlights).

## Repo

Origin: `https://origin.cursor.com/git/51mon/Sudoku.git` (user may only use Codebase download on phone).
