import assert from 'node:assert/strict'
import test from 'node:test'

import { getAuthErrorMessage } from '../src/lib/authErrors.js'

test('auth errors expose a Vietnamese message for invalid credentials', () => {
  assert.equal(
    getAuthErrorMessage({ code: 'invalid_credentials', message: 'Invalid login credentials' }),
    'Email hoặc mật khẩu không đúng.',
  )
})

test('auth errors fall back to the action-specific Vietnamese message', () => {
  assert.equal(
    getAuthErrorMessage({ code: 'unexpected_error', message: 'Unexpected response' }, 'Không thể đăng nhập. Vui lòng thử lại.'),
    'Không thể đăng nhập. Vui lòng thử lại.',
  )
})
