import assert from 'node:assert/strict'
import test from 'node:test'

import { signOutAndRedirect } from '../src/lib/dashboardAuth.js'

test('sign out clears the auth session before returning to login', async () => {
  const events = []

  await signOutAndRedirect({
    auth: { async signOut() { events.push('signOut') } },
    router: { async replace(route) { events.push(route) } },
  })

  assert.deepEqual(events, ['signOut', { name: 'login' }])
})

test('sign out does not navigate when Supabase rejects the request', async () => {
  const error = new Error('Network unavailable')
  let navigationAttempted = false

  await assert.rejects(
    signOutAndRedirect({
      auth: { async signOut() { throw error } },
      router: { async replace() { navigationAttempted = true } },
    }),
    error,
  )

  assert.equal(navigationAttempted, false)
})
