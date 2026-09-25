# Get a new version on your phone / server

**Start here for full setup:** **[GET-EVERYTHING.md](./GET-EVERYTHING.md)**

Do **not** post FTP passwords in chat.

---

## Option A — GitHub (best when import works)

1. Repo on **51monharr15/Sudoku** (after import or PC push).
2. Phone → GitHub app → **Code** → **Download ZIP**.
3. Unzip → **deploy/website** → FTP to your site.

---

## Option B — Cursor repo (no GitHub)

Ask an agent to run **deploy:zip** and give you a **download link** (temporary) or commit **deploy/sudoku-studio-upload.zip** on **main**.

Download zip on phone → unzip → FTP.

---

## Option C — Agent uploads for you (FTP)

Step-by-step: **docs/CURSOR-FTP-SECRETS.md**

Short version: Cursor **Dashboard → Cloud Agents → Secrets** → add `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR` → **start a new agent** → say “run ftp deploy”.

---

## After FTP

Open **https://your-domain/**  
Hard refresh if old version cached.
