import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the build works under the GitHub Pages sub-path (the app uses HashRouter).
  base: './',
  plugins: [react(), tailwindcss()],
})
