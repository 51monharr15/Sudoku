# Get everything (revised UI on your phone)

One-time setup, then updates are automatic or one tap.

---

## What “everything” means

| Piece | What it is |
|-------|------------|
| **Revised UI** | Signed-off Sudoku Studio (highlights, Propose, strong links, conflicts) |
| **Zip** | `deploy/sudoku-studio-upload.zip` — full site for manual FTP |
| **Live site** | Same files on your **https** host (FTP folder with `index.html`) |

---

## Recommended: GitHub + auto FTP (least grief after setup)

Do this **once** on a laptop or phone browser.

### 1. Copy the repo to your GitHub

Follow **[GITHUB-51monharr15.md](./GITHUB-51monharr15.md)** — import from:

`https://origin.cursor.com/git/51mon/Sudoku.git`

Use branch **`main`** (merge [PR #3](https://cursor.com/codebase/51mon/Sudoku/pull/3) on Origin first if `main` there is still old).

### 2. Turn on automatic build + FTP

In **github.com/51monharr15/Sudoku**:

1. **Settings → Secrets and variables → Actions → Secrets** (repository secrets):

   | Name | Your value |
   |------|------------|
   | `FTP_HOST` | e.g. `ftp.yoursite.com` |
   | `FTP_USER` | FTP login |
   | `FTP_PASS` | FTP password |
   | `FTP_REMOTE_DIR` | Folder where `index.html` lives, e.g. `/public_html` |

   Optional: `FTP_PORT` (default `21`).

2. **Settings → Secrets and variables → Actions → Variables**:

   | Name | Value |
   |------|--------|
   | `FTP_DEPLOY` | `true` |

3. **Actions** tab → enable workflows if GitHub asks.

After that, every push to **`main`** runs **Build and deliver**: tests, rebuilds the zip, uploads **`deploy/website`** to your host via FTP.

You can also run it manually: **Actions → Build and deliver → Run workflow**.

### 3. Download the zip anytime (no FTP)

**Actions →** latest **Build and deliver** run → **Artifacts → sudoku-studio-upload**.

Use that on your phone FTP app if you prefer manual upload.

### 4. See the new UI on the phone

Open **`https://your-domain/`** → refresh. If it looks old: Chrome → site settings → clear data for that site, or remove and re-add **Home screen** icon.

---

## Alternative: Cursor Cloud Agent (no GitHub)

1. **[Dashboard → Cloud Agents → Secrets](https://cursor.com/dashboard?tab=cloud-agents)** — add `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_REMOTE_DIR` (exact spelling).
2. **Start a new Cloud Agent** (secrets do not load into an old run).
3. Message: **`git checkout main && npm run deploy:zip && bash scripts/ftp-deploy.sh`**

Details: **[CURSOR-FTP-SECRETS.md](./CURSOR-FTP-SECRETS.md)**

---

## Alternative: Manual zip only (no secrets anywhere)

1. On **`main`**, download **`deploy/sudoku-studio-upload.zip`** from Origin or GitHub.
2. Unzip → upload **all files** to your FTP folder (overwrite old files).
3. Open your **https** URL and refresh.

Phone steps: **[UPDATE-ON-PHONE.md](./UPDATE-ON-PHONE.md)**

---

## Checklist

- [ ] Revised UI is on **`main`** (merge PR #3 if needed)
- [ ] GitHub import done **or** you use Origin zip / Cursor FTP
- [ ] If auto FTP: GitHub secrets + `FTP_DEPLOY=true`
- [ ] Site opened in browser and refreshed after upload

Never post FTP passwords in chat or in git — only in **GitHub Secrets** or **Cursor Secrets**.
