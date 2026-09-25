# Sudoku Studio

Mobile-first **Progressive Web App** for Sudoku with automatic pencil marks, standard puzzle import, and **proposed-move implication chains**.

## Features

- **9×9 touch-friendly grid** with given vs. user digits
- **Auto candidates** (pencil marks) from current placements
- **Import** 81-character Sudoku Exchange / `.sdk` strings, or 9-line grids (`0`, `.`, `-`, `_` for empty)
- **Propose mode**: pick a cell and digit to preview eliminations and cascades of naked/hidden singles
- **Consequence chain** panel with step-by-step highlights on the board

## Develop

```bash
npm install
npm run dev
```

## Test & build

```bash
npm test
npm run build
npm run preview
```

Install to home screen from the browser for standalone mobile use (service worker enabled via `vite-plugin-pwa`).

## Documentation

- **[GitHub for 51monharr15](docs/GITHUB-51monharr15.md)** — copy the repo to **github.com/51monharr15/Sudoku**
- **[Start here (plain language)](docs/START_HERE.md)** — Android use, what npm/dist are, HTTPS + FTP upload without jargon
- **[User guide](docs/USER_GUIDE.md)** — UI, Fill vs Propose, import formats, consequence chains
- **[Deployment](docs/DEPLOYMENT.md)** — Apache + FTP hosting (no shell on server)
