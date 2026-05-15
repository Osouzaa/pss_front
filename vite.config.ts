import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version?: string }
const buildId = new Date().toISOString().replace(/[-:.TZ]/g, '')
const appVersion = `${packageJson.version ?? '0.0.0'}-${buildId}`

function appVersionPlugin(): Plugin {
  const payload = JSON.stringify({ version: appVersion }, null, 2)

  return {
    name: 'pss-app-version',
    configureServer(server) {
      server.middlewares.use('/version.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(payload)
      })
    },
    closeBundle() {
      const distDir = resolve(rootDir, 'dist')
      mkdirSync(distDir, { recursive: true })
      writeFileSync(resolve(distDir, 'version.json'), payload)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [react(), appVersionPlugin()],
})
