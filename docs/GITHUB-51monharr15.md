# Put Sudoku on **your** GitHub (`51monharr15`)

Your project today lives on **Cursor / Origin** (`51mon/Sudoku`).  
It is **not** automatically on GitHub until you copy it once.

Your GitHub username: **51monharr15**  
Suggested repo name: **Sudoku**  
After setup: **https://github.com/51monharr15/Sudoku**

---

## What you want on GitHub

For FTP from your phone, the important part is:

```
deploy/website/     ← the live site files
deploy/             ← zip + instructions
docs/               ← guides
```

---

## Method 1 — Import (good if you use a laptop once)

1. On a computer, log in to **GitHub.com** as **51monharr15**.
2. Open: **https://github.com/new/import**
3. **Old repository URL** (paste exactly):

   ```
   https://origin.cursor.com/git/51mon/Sudoku.git
   ```

4. Owner: **51monharr15**, name: **Sudoku**, create import.
5. If it asks for a password: use a **Cursor / Origin personal access token**, not your normal password (same as for git).

When import finishes, on your phone open the **GitHub app** → **51monharr15/Sudoku** → browse **deploy/website** or download the repo as zip (GitHub app / browser usually **does** offer “Download ZIP” on a repo).

---

## Method 2 — New empty repo + upload **only the website** (phone browser)

If import is too awkward, you only need the built site on GitHub to copy to FTP:

1. **https://github.com/new** → name **Sudoku** → Create (empty, no README).
2. Tap **Add file** → **Upload files**.
3. On your computer (or from files you got from Cursor), upload **everything inside** `deploy/website/`:
   - `index.html`
   - folder **`assets`** (both files inside)
   - `favicon.svg`, `icons.svg`, `pwa-192.png`, `pwa-512.png`
   - `manifest.webmanifest`, `registerSW.js`, `sw.js`, `workbox-9c191d2f.js`
   - `.htaccess` if your uploader shows it
4. Commit.

That repo is then a backup/copy of the site. You still **FTP** those same files to your **https** web host (GitHub is not your live server unless you turn on GitHub Pages — not required).

---

## Method 3 — Push from a computer (full project)

If you clone or open this project on a PC with git:

```bash
git remote add github https://github.com/51monharr15/Sudoku.git
git push -u github main
```

(Create the empty **Sudoku** repo on GitHub first.)

---

## After it is on GitHub

**Phone → FTP → your site**

1. GitHub app or browser: open **51monharr15/Sudoku**.
2. **Code** → **Download ZIP** (whole repo) **or** open **deploy/website** and download files.
3. Unzip if needed.
4. FTP upload to your web directory (same as **deploy/UPLOAD-FROM-PHONE.txt**).
5. Visit **https://your-domain/**

---

## Still stuck?

Reply with whether you have **any computer** (even briefly) or **only the phone**. The next step depends on that one thing.
