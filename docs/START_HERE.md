# Sudoku Studio — start here (no tech jargon)

This page is for **you** if you are on a **phone**, use **FTP** to upload a website, and do **not** use command-line tools day to day.

---

## Part 1 — Using the app on your Android phone

You do **not** need npm on your phone to **play** Sudoku.

1. Open **Chrome** (or another browser).
2. Go to your website address — the one that starts with **`https://`**
3. The Sudoku board should appear.

### Put it on your home screen (like an app)

1. In Chrome, tap the **menu** (three dots).
2. Tap **Add to Home screen** or **Install app**.
3. Confirm. An icon appears with your other apps.

After that, open Sudoku from that icon. It runs full screen.

### How to play (simple)

| What you see | What to do |
|--------------|------------|
| **Fill** (highlighted) | Normal solving: tap an empty square, then tap a number. |
| **Propose** | “What if?” mode: tap an empty square, tap a number — the app shows what would happen **without** saving until you tap **Apply chain**. |
| **Candidates** | Small numbers in empty squares — possible digits. Turn off if the grid looks busy. |
| **Import** | Paste a puzzle from elsewhere (long line of 81 characters, or 9 rows). |
| **Clear** | Removes **your** number from the selected square (not the original puzzle clues). |

**White numbers** = part of the puzzle you imported (fixed).  
**Blue numbers** = numbers you entered.

More detail (still readable): [USER_GUIDE.md](./USER_GUIDE.md)

---

## Part 2 — What is npm? (and do I need it on my phone?)

**Short answer: No. Not on your Android phone.**

**npm** is a tool that runs on a **computer** (Windows, Mac, or Linux). It is used by people who **develop** or **package** the app. It downloads helper files and runs a **build** step.

Think of it like this:

| Step | Where it happens | Who usually does it |
|------|------------------|---------------------|
| Write / update the app | Developer’s computer | You, a friend, or Cursor/cloud agent |
| **Build** (turn code into a website folder) | **Computer with npm** | Same — **not** your phone |
| **Upload** the website | Your phone or PC via **FTP** | You |
| **Visit** the site | Phone browser **`https://`** | You and anyone with the link |

So: **npm never needs to run on Android.** Your phone only needs a browser for playing, and an FTP app (or your host’s file manager) for uploading files.

---

## Part 3 — What is `dist`? Where is it “locally”?

People say **“dist folder”** (not “diet”). **dist** is just the **finished website** — the files Apache shows to visitors.

- **Locally** means **on whichever machine ran the build** — e.g. your laptop, or a cloud coding machine — **before** you upload anything.
- It is **not** on your phone until you copy those files there (you normally **upload** straight from the computer to your web host via FTP, not via the phone).

After a successful build, the folder is:

```
Sudoku/dist/
```

Inside you will see things like:

- `index.html` — main page  
- `assets/` — styles and program code  
- `sw.js`, icons, etc. — install/offline support  

**You upload everything inside `dist`** to your web space. You do **not** upload the whole project and you do **not** need PHP files for this app.

If you **only** have FTP and **no** computer to run npm, you need someone (or a service) to run the build once and send you a **zip of the `dist` contents** to upload. That is normal.

---

## Part 4 — Putting the app on your server (HTTPS + FTP)

Your setup: **Apache**, **HTTPS**, upload by **FTP**, no shell. That works.

### What you upload

1. Get a zip or folder of the **built** site (`dist` contents).
2. Log in with **FTP** (FileZilla, host app, etc.).
3. Open your site folder (often `public_html`, `www`, or `htdocs`).
4. Upload **all** files and folders from `dist` so that `index.html` sits in that site folder (or in a subfolder if you use e.g. `https://yoursite.com/sudoku/` — ask whoever built it to set that path).

### What you do **not** need

- PHP for Sudoku Studio (Apache can serve the files as-is).  
- npm on the server.  
- SSH/shell on the server.

### HTTPS

You already use **https://** — good. Install-to-home-screen and offline cache work much better with HTTPS.

### After an update

Whoever builds a new version sends you new `dist` files. Upload them again (overwrite old files). On your phone, close the app tab and open it again, or wait a day for the cached version to refresh.

Step-by-step for hosts: [DEPLOYMENT.md](./DEPLOYMENT.md) (slightly more technical).

---

## Part 5 — If you are stuck

| Problem | What to try |
|---------|-------------|
| Blank page after upload | Check that `index.html` is in the folder your domain points to. |
| Old version on phone | Close all tabs for the site; reopen from home screen icon. |
| “I have no computer for npm” | Download a **pre-built zip** from whoever maintains the repo, or use a cloud agent to build and download `dist`. |
| Puzzle import fails | Use 81 characters in a row, or 9 lines of 9 symbols; use `.` or `0` for empty cells. |

---

## Part 6 — What might come later

Future versions might add: save progress on the phone, undo, harder solving hints, more puzzle formats. Updates still arrive the same way: **new files in `dist` → FTP upload → refresh on phone.**

Technical roadmap: [USER_GUIDE.md — Future development](./USER_GUIDE.md#future-development)
