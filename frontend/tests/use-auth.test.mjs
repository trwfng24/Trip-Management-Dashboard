import assert from 'node:assert/strict'
import test from 'node:test'

import { createAuthStore } from '../src/composables/useAuth.js'

function createClient(session = null) {
  let listener

  return {
    signUpInput: null,
    auth: {
      async getSession() {
        return { data: { session }, error: null }
      },
      onAuthStateChange(callback) {
        listener = callback
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async signUp(input) {
        this.signUpInput = input
        return { data: { user: { id: 'leader-1' }, session: null }, error: null }
      },
      async signInWithPassword() {
        return { data: { session }, error: null }
      },
      async signInWithOAuth() {
        return { data: {}, error: null }
      },
      async signOut() {
        return { data: {}, error: null }
      },
    },
    emit(nextSession) {
      listener('TOKEN_CHANGED', nextSession)
    },
  }
}

test('initialize restores a Supabase session and observes auth changes', async () => {
  const client = createClient({ user: { email: 'huy@example.com' } })
  const auth = createAuthStore(client)

  await auth.initialize()
  assert.equal(auth.user.value.email, 'huy@example.com')

  client.emit(null)
  assert.equal(auth.session.value, null)
})

test('sign up stores the display name in Supabase user metadata', async () => {
  const client = createClient()
  const auth = createAuthStore(client)

  await auth.signUp({
    displayName: 'Huy Nguyen',
    email: 'huy@example.com',
    password: 'password1',
  })

  assert.deepEqual(client.auth.signUpInput, {
    email: 'huy@example.com',
    password: 'password1',
    options: { data: { display_name: 'Huy Nguyen' } },
  })
})
