import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const here = path.dirname(fileURLToPath(import.meta.url))
const tools = path.join(here, '..', 'node_modules')
const toolsInstall = path.join(here, '..')
const root =
  process.env.SUDOKU_ROOT ??
  '/data/data/com.termux/files/home/storage/shared/!simon/obsidian/development/Sudoku'

export default defineConfig({
  root,
  cacheDir: path.join(toolsInstall, '.vite-cache'),
  base: './',
  server: { host: true, fs: { allow: [root, toolsInstall] } },
  resolve: {
    alias: {
      react: path.join(tools, 'react'),
      'react-dom': path.join(tools, 'react-dom'),
    },
  },
  plugins: [react()],
})
