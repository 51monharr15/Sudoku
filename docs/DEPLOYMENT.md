# Hosting Sudoku Studio on Apache (FTP only)

**New to npm and builds?** Read **[START_HERE.md](./START_HERE.md)** first (plain language, Android-friendly).

## Is Apache + PHP suitable?

**Yes for Apache. PHP is optional and not used by this app.**

Sudoku Studio is a **static site** after you run `npm run build`:

- HTML, CSS, JavaScript, icons, and a service worker live in the `dist/` folder.
- **Apache** serves those files like any other website.
- **PHP** is not required. If your host only offers “Apache + PHP,” you can still upload the static files; PHP can sit unused in another directory.

You **do** need a machine (your PC, a friend’s, or CI) where you can run **Node.js once** to produce `dist/`. Your live server only needs **FTP** (or file manager) to upload the result.

---

## One-time build (off the server)

On a computer with Node 18+:

```bash
git clone <your-repo-url>
cd Sudoku
npm install
npm run build
```

Upload **everything inside** `dist/` to your web space—not the whole repo.

Typical FTP layout:

```
public_html/          (or www/, htdocs/)
  index.html
  manifest.webmanifest
  registerSW.js
  sw.js
  workbox-*.js
  favicon.svg
  pwa-192.png
  pwa-512.png
  assets/
    index-*.js
    index-*.css
```

---

## FTP upload checklist

1. Build locally → open `dist/`.  
2. FTP to site root (or subfolder—see below).  
3. Upload all files; preserve `assets/` folder.  
4. Visit `https://yourdomain.com/` (or subpath).  
5. Hard refresh (Ctrl+F5) after updates so the new service worker can install.

### Subfolder (e.g. `https://example.com/sudoku/`)

Before building, set the base path in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/sudoku/',
  // ...
})
```

Then rebuild and upload `dist/` contents into the `sudoku/` directory on the server.

---

## Apache settings (via FTP)

If you can upload `.htaccess` next to `index.html`, use the sample in `public/.htaccess` (copied into `dist/` on build). It helps with:

- Correct MIME types for the web manifest  
- Long cache for hashed assets in `assets/`  
- Optional fallback to `index.html` if you add client routes later  

You do **not** need `mod_php` enabled for this app.

---

## HTTPS and PWA

| Topic | Recommendation |
|-------|----------------|
| **HTTPS** | Strongly recommended. Install prompts and service workers behave reliably on HTTPS. Many hosts provide free Let’s Encrypt in the control panel—no shell needed. |
| **HTTP only** | The app may still **run**, but “Add to Home Screen” and offline cache may be limited or blocked by the browser. |
| **PHP** | Ignore for this project unless you later add a PHP API (not in current design). |

---

## Updating the live site

1. Pull latest code on your build machine.  
2. `npm install` (if dependencies changed).  
3. `npm run build`.  
4. FTP upload **overwrite** files in `dist/` (especially `assets/*` and `sw.js`).  
5. On your phone, close the tab or wait for the PWA auto-update; reopen the app.

No shell access on the server is required for updates—only FTP and a local (or CI) build.

---

## What will *not* work with FTP-only hosting

- Running `npm run dev` on the server (needs Node + shell).  
- Server-side puzzle generation or user accounts without adding a backend (PHP, etc.) separately.  
- Custom Apache modules unless your host enables them in a panel.

For the **current** Sudoku Studio feature set, static FTP deploy to Apache is **appropriate and sufficient**.
