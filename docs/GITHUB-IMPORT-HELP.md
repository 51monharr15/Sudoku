# “I can’t find Import on GitHub” — read this

GitHub **hides Import on the phone app**. It is **not** in the normal “+” menu on Android/iPhone.

---

## Do this (Android Chrome)

1. Open **Chrome** (not the GitHub app).
2. Tap the address bar and type **exactly**:

   **https://github.com/new/import**

3. Log in as **51monharr15** if asked.
4. You should see a page titled **Import your project to GitHub**.
5. In **Your old repository’s URL**, paste:

   ```
   https://origin.cursor.com/git/51mon/Sudoku.git
   ```

6. Owner: **51monharr15**  
   Name: **Sudoku**
7. Tap **Begin import** (or **Create repository**).

If the page looks broken or tiny, tap Chrome **⋮** → **Desktop site**, then open the same link again.

---

## If that page says 404 or “not found”

Try the long form:

**https://github.com/new/import?name=Sudoku&owner=51monharr15**

---

## If Import still will not work (common on phone)

Skip Import. You only need the **website files**, not the whole developer project.

### Step A — Create an empty repo (easy on phone)

1. **https://github.com/new**
2. Repository name: **Sudoku**
3. Leave it **empty** (no README).
4. Tap **Create repository**.

### Step B — Get the site files onto your phone

You need the folder **`deploy/website`** from the Cursor project. Ways that work:

| Way | What to do |
|-----|------------|
| **Friend / library PC** | Open Cursor or git, download repo, copy **`deploy/website`** to USB / email / Google Drive, then on phone upload to GitHub. |
| **Cursor on a computer** | Project → **`deploy/website`** → zip the folder → email or Drive to your phone. |
| **FTP first (ironic but OK)** | If someone sends you the zip once, FTP to your live site; GitHub is optional. |

### Step C — Upload to GitHub (phone browser)

1. Open your new repo: **https://github.com/51monharr15/Sudoku**
2. Tap **Add file** → **Upload files**
3. Select **all files** from **`website`** (including **`assets`** folder).
4. Tap **Commit changes**.

---

## What Import is *not*

- Not in **GitHub mobile app** menus (usually).
- Not under **Settings** of an existing repo.
- Not the same as **Clone** or **Download ZIP**.

Import is only: **https://github.com/new/import** in a **browser**.

---

## What you do after GitHub has the files

GitHub is **storage**, not your live site (unless you turn on Pages).

1. Download ZIP from GitHub **or** upload the same files with **FTP** to your web host.
2. Open **https://your-domain/**

---

## One-line summary

**Import = open https://github.com/new/import in Chrome (desktop site), not the GitHub app.**

If that fails, create **Sudoku** empty repo and **Upload files** from **`deploy/website`**.
