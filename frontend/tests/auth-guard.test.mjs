import assert from 'node:assert/strict'
import test from 'node:test'

import { createAuthGuard, createSignedOutRedirect } from '../src/router/authGuard.js'

test('unauthenticated visitor is redirected from dashboard to login', async () => {
  const guard = createAuthGuard({
    user: { value: null },
    async initialize() {},
  })

  assert.deepEqual(
    await guard({ meta: { requiresAuth: true }, fullPath: '/' }),
    { name: 'login', query: { redirect: '/' } },
  )
})

test('authenticated visitor is redirected away from login', async () => {
  const guard = createAuthGuard({
    user: { value: { id: 'leader-1' } },
    async initialize() {},
  })

  assert.deepEqual(
    await guard({ meta: { guestOnly: true }, fullPath: '/login' }),
    { name: 'dashboard' },
  )
})

test('a session loss redirects a visitor away from the protected dashboard', async () => {
  const redirects = []
  const redirect = createSignedOutRedirect(
    { user: { value: null } },
    {
      currentRoute: { value: { meta: { requiresAuth: true }, fullPath: '/' } },
      async replace(route) { redirects.push(route) },
    },
  )

  await redirect()

  assert.deepEqual(redirects, [{ name: 'login', query: { redirect: '/' } }])
})
