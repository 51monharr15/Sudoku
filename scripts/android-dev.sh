#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ENV="${SUDOKU_TEST_ENV:-$HOME/storage/shared/sudoku-test.env}"
if [[ -f "$ENV" ]]; then
  # shellcheck disable=SC1090
  source "$ENV"
fi
ROOT="${SUDOKU_ROOT:-$HOME/storage/shared/Sudoku-Studio}"

if [[ ! -f "$ROOT/package.json" ]]; then
  echo "Missing project. Run android-refresh.sh first." >&2
  exit 1
fi

cd "$ROOT"
npm run dev -- --host
