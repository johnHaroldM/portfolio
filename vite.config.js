import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { profile, fullName, initials } from './src/content.js'

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// Fills {{tokens}} in index.html from src/content.js so the page title,
// social preview and favicon always match your details.
function profileMeta() {
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#EA5A3C"/><text x="32" y="41.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="25" fill="#191B22">${initials}</text></svg>`
  const tokens = {
    title: `${fullName} — ${profile.shortRole}`,
    description: profile.metaDescription,
    url: profile.website,
    name: fullName,
    favicon: `data:image/svg+xml,${encodeURIComponent(favicon)}`,
  }
  return {
    name: 'profile-meta',
    transformIndexHtml(html) {
      return html.replace(/\{\{(\w+)\}\}/g, (match, key) =>
        key in tokens ? escapeHtml(tokens[key]) : match,
      )
    },
  }
}

export default defineConfig({
  // Relative paths: the built site works from any host or sub-folder.
  base: './',
  plugins: [react(), tailwindcss(), profileMeta()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
