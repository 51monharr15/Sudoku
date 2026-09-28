#!/data/data/com.termux/files/usr/bin/bash
# Install/update Sudoku from a Codebase Download archive into Android shared storage.
set -euo pipefail

ENV="${SUDOKU_TEST_ENV:-$HOME/storage/shared/sudoku-test.env}"
if [[ -f "$ENV" ]]; then
  # shellcheck disable=SC1090
  source "$ENV"
fi
ROOT="${SUDOKU_ROOT:-$HOME/storage/shared/Sudoku-Studio}"

if [[ $# -lt 1 ]]; then
  echo "Usage: android-refresh.sh /path/to/codebase-download.tar.gz" >&2
  exit 1
fi
ARCHIVE="$1"
if [[ ! -f "$ARCHIVE" ]]; then
  echo "Not found: $ARCHIVE" >&2
  exit 1
fi

case "$ARCHIVE" in
*.tar.gz | *.tgz) ;;
*)
  echo "Expected .tar.gz from Codebase Download." >&2
  exit 1
  ;;
esac

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

tar -xzf "$ARCHIVE" -C "$TMP"
PROJ="$(find "$TMP" -maxdepth 3 -name package.json -print -quit | sed 's|/package.json||')"
if [[ -z "$PROJ" || ! -f "$PROJ/package.json" ]]; then
  echo "No package.json in archive." >&2
  exit 1
fi

mkdir -p "$(dirname "$ROOT")"
STAGE="${ROOT}.staging.$$"
rm -rf "$STAGE"
cp -a "$PROJ" "$STAGE"
rm -rf "$ROOT"
mv "$STAGE" "$ROOT"

cd "$ROOT"
if command -v npm >/dev/null 2>&1; then
  npm install
else
  echo "Install Node: pkg install nodejs-lts -y" >&2
  exit 1
fi

echo "Ready at: $ROOT"
echo "Run: bash $ROOT/scripts/android-dev.sh"
