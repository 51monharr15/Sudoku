#!/usr/bin/env bash
# Upload deploy/website to FTP using env vars (set in Cursor Secrets).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/deploy/website"

for v in FTP_HOST FTP_USER FTP_PASS FTP_REMOTE_DIR; do
  if [[ -z "${!v:-}" ]]; then
    echo "Missing env $v — add it in Cursor Dashboard → Cloud Agents → Secrets, then start a NEW agent."
    exit 1
  fi
done

if [[ ! -f "${SRC}/index.html" ]]; then
  echo "Missing ${SRC}/index.html — run: npm run deploy:zip"
  exit 1
fi

PORT="${FTP_PORT:-21}"
REMOTE="${FTP_REMOTE_DIR}"

if ! command -v lftp >/dev/null 2>&1; then
  echo "Installing lftp..."
  sudo apt-get update -qq && sudo apt-get install -y -qq lftp
fi

# Credentials via env; do not echo FTP_PASS
lftp -u "${FTP_USER},${FTP_PASS}" -p "${PORT}" "${FTP_HOST}" <<EOF
set ssl:verify-certificate no
set ftp:passive-mode on
cd ${REMOTE}
mirror -R --delete --verbose "${SRC}" .
bye
EOF

echo "FTP upload finished to ${FTP_HOST}:${REMOTE}"
