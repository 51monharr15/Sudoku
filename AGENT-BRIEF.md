# Agent brief — Simon / Sudoku

## Phone project path (only)

`~/storage/shared/!simon/obsidian/development/Sudoku`

If `pwd` is already there, **do not** tell user to run `termux-setup-storage` or mkdir again.

## Roles

| Where | Job |
|-------|-----|
| **Windows 10** | `git clone` / `git pull`, `origin auth login`, edit, `npm run dev`, push to Origin |
| **Phone Termux** | `npm run dev -- --host` for UX testing; refresh via **Codebase download** into Sudoku path (or copy from PC) |

**Do not** route phone git through Termux Origin CLI or proot unless user explicitly retries `documentation/GIT-AUTH-TERMUX.txt`.

## Phone cleanup (if user uses PC for git)

`proot-distro remove ubuntu`; remove `~/.local/bin/origin`, `~/origin.tar.gz`. See `documentation/PHONE-STATE-AND-CLEANUP.txt`.

## Loop

Runtime → feedback → agent changes on Origin → user refreshes phone folder → repeat.

## Docs

- `documentation/W10-DEV-PHONE-TEST.txt` — full narrative PC + phone
- `TEST-ON-PHONE.txt` — phone commands only
- UI: `docs/UI-UX-REQUIREMENTS.md`

Repo: `https://origin.cursor.com/git/51mon/Sudoku.git`
