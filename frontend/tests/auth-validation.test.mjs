import assert from 'node:assert/strict'
import test from 'node:test'

import { validateLogin, validateRegistration } from '../src/lib/authValidation.js'

test('registration rejects a short password and mismatched confirmation', () => {
  assert.deepEqual(
    validateRegistration({
      displayName: 'Huy',
      email: 'huy@example.com',
      password: '1234567',
      confirmation: '123456',
    }),
    {
      password: 'Mật khẩu phải có ít nhất 8 ký tự.',
      confirmation: 'Mật khẩu xác nhận không khớp.',
    },
  )
})

test('login rejects an invalid email before calling Supabase', () => {
  assert.deepEqual(
    validateLogin({ email: 'not-an-email', password: 'password1' }),
    { email: 'Email không hợp lệ.' },
  )
})
