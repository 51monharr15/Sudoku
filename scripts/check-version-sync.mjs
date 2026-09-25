#!/usr/bin/env node
/** Fail build if VERSION file and src/appVersion.ts disagree. */
import { readFileSync } from 'node:fs'

const fromFile = readFileSync('VERSION', 'utf8').trim()
const src = readFileSync('src/appVersion.ts', 'utf8')
const m = src.match(/APP_VERSION\s*=\s*'([^']+)'/)
if (!m) {
  console.error('check-version-sync: no APP_VERSION in src/appVersion.ts')
  process.exit(1)
}
if (m[1] !== fromFile) {
  console.error(`check-version-sync: VERSION file "${fromFile}" != appVersion.ts "${m[1]}"`)
  process.exit(1)
}
console.log('check-version-sync: ok', fromFile)
