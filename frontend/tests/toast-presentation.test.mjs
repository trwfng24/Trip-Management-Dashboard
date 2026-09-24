import assert from 'node:assert/strict'
import test from 'node:test'

import { getToastPresentation } from '../src/common/toastPresentation.js'

test('toast presentation maps every supported severity accessibly', () => {
  assert.deepEqual(getToastPresentation('success'), {
    color: 'success',
    icon: 'mdi-check-circle-outline',
    role: 'status',
  })
  assert.deepEqual(getToastPresentation('warning'), {
    color: 'warning',
    icon: 'mdi-alert-outline',
    role: 'status',
  })
  assert.deepEqual(getToastPresentation('error'), {
    color: 'error',
    icon: 'mdi-alert-circle-outline',
    role: 'alert',
  })
})

test('toast presentation rejects unsupported severities', () => {
  assert.equal(getToastPresentation('info'), undefined)
})
