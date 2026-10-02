import assert from 'node:assert/strict'
import test from 'node:test'

import { readFile } from 'node:fs/promises'

const routerIndexPath = new URL('../src/router/index.js', import.meta.url)

async function loadAuthRoutes() {
  const routerSource = await readFile(routerIndexPath, 'utf8')
  const routesMatch = routerSource.match(/export const authRoutes = (\[[\s\S]*?\n\])/)

  assert.ok(routesMatch, 'index.js must export authRoutes')

  return Function(`return (${routesMatch[1]})`)()
}

test('auth route definitions protect the dashboard and reserve login pages for guests', async () => {
  const authRoutes = await loadAuthRoutes()
  const routesByName = Object.fromEntries(authRoutes.map((route) => [route.name, route]))

  assert.equal(routesByName.dashboard.path, '/')
  assert.equal(routesByName.dashboard.meta.requiresAuth, true)
  assert.equal(routesByName.login.path, '/login')
  assert.equal(routesByName.login.meta.guestOnly, true)
  assert.equal(routesByName.register.path, '/register')
  assert.equal(routesByName.register.meta.guestOnly, true)
})

test('system error routes are public and include a catch-all not-found page', async () => {
  const authRoutes = await loadAuthRoutes()
  const routesByName = Object.fromEntries(authRoutes.map((route) => [route.name, route]))

  assert.equal(routesByName.forbidden.path, '/403')
  assert.deepEqual(routesByName.forbidden.meta, { public: true })
  assert.equal(routesByName.error.path, '/error')
  assert.deepEqual(routesByName.error.meta, { public: true })
  assert.equal(routesByName.notFound.path, '/:pathMatch(.*)*')
  assert.deepEqual(routesByName.notFound.meta, { public: true })
})
