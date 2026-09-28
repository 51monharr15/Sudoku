# Agent brief — Simon / Sudoku on Android

## Hold this path

**Project directory (only):**
`~/storage/shared/!simon/obsidian/development/Sudoku`

User refreshes by either:
1. **Codebase download** into that folder (no `.git` — not `git pull`), then `npm install` + `npm run dev -- --host`, or
2. **Git clone once** into that path, then **`git pull origin main`** for updates after one-time Origin auth (`documentation/GIT-AUTH-TERMUX.txt`).

Do **not** introduce new roots, env files, or bash refresh scripts.
Do **not** default to Origin CLI in plain Termux or open new setup rabbit holes.

## Loop

Runtime (5173 dev or 4173 preview) → user feedback → agent changes on Origin repo → user refresh (download or pull) → repeat.

## UI

`docs/UI-UX-REQUIREMENTS.md`. Prototype = build for review, iterate on feedback.

## Repo URL

`https://origin.cursor.com/git/51mon/Sudoku.git`
