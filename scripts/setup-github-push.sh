#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN is not set in this environment."
  echo "Add it in Cursor → Cloud Agents → Environments → Secrets (name: GITHUB_TOKEN), then start a new agent."
  exit 1
fi

git remote set-url github "https://x-access-token:${GITHUB_TOKEN}@github.com/51monharr15/Sudoku.git"

echo "Pushing to GitHub main..."
git push github HEAD:main
echo "Done."
