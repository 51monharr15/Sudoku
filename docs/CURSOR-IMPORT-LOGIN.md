# GitHub Import — log in to the Cursor repo

GitHub Import asks for a **username** and **password** because the Cursor copy of Sudoku is **private**.

The password is **not** your GitHub password.

---

## On the Import page

URL: https://github.com/new/import

Old repository URL:

```
https://origin.cursor.com/git/51mon/Sudoku.git
```

When GitHub asks for credentials for that URL:

| Field | What to enter |
|-------|----------------|
| Username | Your **Cursor / Origin git username** (often your Cursor login name, e.g. `51mon`) |
| Password | A **personal access token** from Cursor — **not** your normal password |

---

## Get a Cursor git token (phone or PC)

1. Log in at **https://cursor.com** (same account that owns the Sudoku project).
2. Open **Settings** (profile menu).
3. Look for **Integrations**, **Git**, or **Access tokens** / **API keys**.
4. Create a token that allows **read** access to git / repositories.
5. Copy the token once (you may not see it again).
6. Paste it into GitHub Import as the **password**.

If the menu names differ, search Cursor docs for “git token” or “Origin git”.

---

## If you cannot get a token this week

Import will keep failing. That is expected.

**Next week on a PC:** open the project in Cursor and push to GitHub (see docs/GITHUB-51monharr15.md Method 3).

**This week for your live site only:** use the fixed zip from `deploy/` (see docs/FTP-FIX-BLANK-PAGE.md) — no GitHub required.

---

## After import succeeds

GitHub → **51monharr15/Sudoku** → Code → Download ZIP.

Unzip → **deploy/website** → FTP to your server.
