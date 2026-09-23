import assert from 'node:assert/strict'
import test from 'node:test'

import { authRoutes } from '../src/router/routes.js'

test('auth route definitions protect the dashboard and reserve login pages for guests', () => {
  const routesByName = Object.fromEntries(authRoutes.map((route) => [route.name, route]))

  assert.equal(routesByName.dashboard.path, '/')
  assert.equal(routesByName.dashboard.meta.requiresAuth, true)
  assert.equal(routesByName.login.path, '/login')
  assert.equal(routesByName.login.meta.guestOnly, true)
  assert.equal(routesByName.register.path, '/register')
  assert.equal(routesByName.register.meta.guestOnly, true)
})
