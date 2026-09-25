# Blank page after FTP — fix

If **https** opens but the screen is **empty** or only plain HTML, the server usually is not loading the **assets** folder correctly.

---

## Cause (old zip)

Older builds used paths like `/assets/...` (leading slash). That only works if `index.html` is at the **domain root**.

If files are in a subfolder, or the host maps URLs differently, the app **does not render**.

**New builds use `./assets/...` (relative)** so any folder works.

---

## What must be on the server

Same folder on the server:

```
index.html
assets/
  index-....js
  index-....css
favicon.svg
manifest.webmanifest
registerSW.js
sw.js
workbox-....js
(icons, .htaccess optional)
```

**assets** must sit **next to** index.html, not missing, not renamed.

---

## Upload steps (phone FTP)

1. Delete old Sudoku files on the server (old index + old assets) to avoid a mix.
2. Unzip the **new** `sudoku-studio-upload.zip`.
3. Upload **contents** of the unzipped folder (not the zip itself).
4. Confirm in FTP: you see **assets** as a folder beside **index.html**.

---

## Quick test in Chrome

Replace YOUR-DOMAIN with yours.

Open:

```
https://YOUR-DOMAIN/assets/
```

You should **not** get 404. (Listing may be forbidden — that is OK if the JS file opens.)

Open the JS link from index.html (name in index.html, e.g. index-D0I1LU0p.js):

```
https://YOUR-DOMAIN/assets/index-D0I1LU0p.js
```

If that is **404**, the app will stay blank — fix upload path or use the **new relative-path zip**.

---

## Subfolder example

If the site lives at `https://example.com/games/sudoku/`:

Upload into the **games/sudoku** folder on the server.

With the **new** relative build, that should work.

With an **old** root-only build, it will not — use the new zip.
