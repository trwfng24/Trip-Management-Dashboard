import assert from 'node:assert/strict'
import test from 'node:test'

import { bootstrap } from '../src/bootstrap.js'

test('bootstrap restores auth state before mounting the application', async () => {
  const events = []
  const app = {
    use(router) {
      events.push(`use:${router.name}`)
    },
    mount(target) {
      events.push(`mount:${target}`)
    },
    onUnmount() {},
  }

  await bootstrap({
    App: { name: 'RootApp' },
    auth: { async initialize() { events.push('initialize') } },
    router: { name: 'trip-router' },
    createApp(component) {
      events.push(`create:${component.name}`)
      return app
    },
  })

  assert.deepEqual(events, ['initialize', 'create:RootApp', 'use:trip-router', 'mount:#app'])
})

test('bootstrap disposes the auth subscription when Vue unmounts', async () => {
  let onUnmount
  let disposeCalls = 0

  await bootstrap({
    App: {},
    auth: {
      async initialize() {},
      dispose() { disposeCalls += 1 },
    },
    router: {},
    createApp() {
      return {
        use() {},
        mount() {},
        onUnmount(callback) { onUnmount = callback },
      }
    },
  })

  onUnmount()

  assert.equal(disposeCalls, 1)
})
