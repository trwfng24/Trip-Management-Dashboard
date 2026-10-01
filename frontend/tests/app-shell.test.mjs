import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import test from 'node:test'
import { loadConfigFromFile } from 'vite'

const run = promisify(execFile)
const frontendDirectory = fileURLToPath(new URL('..', import.meta.url))
const viteCliPath = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))

test('build creates the DiDiEms dashboard shell', async () => {
  await run(process.execPath, [viteCliPath, 'build'], {
    cwd: frontendDirectory,
  })

  const indexPath = new URL('../dist/index.html', import.meta.url)
  await access(indexPath)
  const output = await readFile(indexPath, 'utf8')

  assert.match(output, /DiDiEms/)
})

test('development config does not load the Vue DevTools overlay', async () => {
  const config = await loadConfigFromFile(
    { command: 'serve', mode: 'development', isSsrBuild: false, isPreview: false },
    fileURLToPath(new URL('../vite.config.js', import.meta.url)),
  )

  assert.ok(config)
  assert.doesNotMatch(
    config.config.plugins.flat(Infinity).map((plugin) => plugin.name).join(','),
    /vite-plugin-vue-devtools/,
  )
})
