import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base keeps the build portable: it works at a GitHub Pages project
// URL (/repo/) and at a custom domain without changing any asset paths.
export default defineConfig({
  base: './',
  plugins: [react()],
})
