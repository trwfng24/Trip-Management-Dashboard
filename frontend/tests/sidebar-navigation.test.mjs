import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { authRoutes } from '../src/router/routes.js'

async function readSidebarSource() {
  try {
    return await readFile(new URL('../src/components/AppSidebar.vue', import.meta.url), 'utf8')
  } catch {
    return ''
  }
}

test('workspace navigation routes expose all fake sidebar destinations', () => {
  assert.deepEqual(
    authRoutes.filter((route) => route.meta.requiresAuth).map((route) => route.name),
    ['dashboard', 'opinions', 'plan', 'checklist', 'documents', 'expenses', 'export'],
  )
})

test('workspace sidebar uses the dashboard route and mockup tab labels', async () => {
  const source = await readSidebarSource()

  assert.match(source, /routeName: 'dashboard'/)
  assert.match(source, /label: 'Overview'/)
  assert.match(source, /label: 'Opinions'/)
  assert.match(source, /label: 'Plan'/)
  assert.match(source, /label: 'Documents'/)
  assert.match(source, /label: 'Expenses'/)
  assert.match(source, /label: 'Export'/)
})

test('trip collection switcher keeps the mockup image-card treatment', async () => {
  const source = await readSidebarSource()

  assert.match(source, /class="trip-switcher"/)
  assert.match(source, /min-height: 120px/)
  assert.match(source, /border-radius: 20px 20px 20px 6px/)
  assert.match(source, /photo-1507525428034-b723cf961d3e/)
})

test('logout sits in a separated bottom section of the sidebar', async () => {
  const source = await readSidebarSource()

  assert.match(source, /class="side-bottom"/)
  assert.match(source, /class="logout"/)
  assert.match(source, /border-top: 1px solid rgba\(255, 255, 255, 0.13\)/)
  assert.match(source, /border-radius: 9px/)
  assert.match(source, /margin-top: 24px/)
})

test('desktop sidebar stays in document flow so the page scrolls as one', async () => {
  const source = await readSidebarSource()

  assert.match(source, /overflow-y-auto/)
  assert.match(source, /lg:static/)
  assert.match(source, /lg:overflow-visible/)
  assert.doesNotMatch(source, /lg:h-screen/)
})
