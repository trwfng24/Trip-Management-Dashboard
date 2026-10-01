import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { parse } from '@vue/compiler-sfc'

test('every Vue SFC has one top-level template and script setup block', async () => {
  const sourceDirectory = fileURLToPath(new URL('../src', import.meta.url))
  const entries = await readdir(sourceDirectory, { recursive: true })
  const files = entries.filter((entry) => entry.endsWith('.vue'))
  const invalidFiles = []

  for (const file of files) {
    const path = join(sourceDirectory, file)
    const source = await readFile(path, 'utf8')
    const { descriptor, errors } = parse(source, { filename: file })

    if (!descriptor.template || !descriptor.scriptSetup || errors.length) invalidFiles.push(file)
  }

  assert.deepEqual(invalidFiles, [])
})
