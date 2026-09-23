import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import test from 'node:test'
import { loadConfigFromFile } from 'vite'

const run = promisify(execFile)

test('build creates the DiDiEms dashboard shell', async () => {
  await run('npm', ['run', 'build'], {
    cwd: new URL('..', import.meta.url),
  })

  const indexPath = new URL('../dist/index.html', import.meta.url)
  await access(indexPath)
  const output = await readFile(indexPath, 'utf8')

  assert.match(output, /DiDiEms/)
})

test('development config does not load the Vue DevTools overlay', async () => {
  const config = await loadConfigFromFile(
    { command: 'serve', mode: 'development', isSsrBuild: false, isPreview: false },
    new URL('../vite.config.js', import.meta.url).pathname,
  )

  assert.ok(config)
  assert.doesNotMatch(
    config.config.plugins.flat(Infinity).map((plugin) => plugin.name).join(','),
    /vite-plugin-vue-devtools/,
  )
})
