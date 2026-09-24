import assert from 'node:assert/strict'
import test from 'node:test'

import { messages } from '../src/common/messages.js'

test('auth messages expose reusable Vietnamese request feedback', () => {
  assert.equal(messages.auth.signInSuccess, 'Đăng nhập thành công.')
  assert.equal(messages.auth.signInFailed, 'Không thể đăng nhập. Vui lòng thử lại.')
  assert.equal(messages.auth.googleSignInFailed, 'Không thể kết nối với Google. Vui lòng thử lại.')
  assert.equal(messages.auth.signUpSuccess, 'Tạo tài khoản thành công.')
  assert.equal(messages.auth.signOutSuccess, 'Đã đăng xuất.')
  assert.equal(messages.auth.signOutFailed, 'Không thể đăng xuất. Vui lòng thử lại.')
})
