import assert from 'node:assert/strict'
import test from 'node:test'

import { createToastStore } from '../src/common/useToast.js'

test('displays queued messages in FIFO order', () => {
  const callbacks = []
  const toast = createToastStore({
    setTimeoutFn: (callback) => {
      callbacks.push(callback)
      return callback
    },
    clearTimeoutFn() {},
  })

  toast.success('Đã lưu chuyến đi.')
  toast.error('Không thể tải dữ liệu.')

  assert.deepEqual(toast.active.value, {
    id: 1,
    severity: 'success',
    message: 'Đã lưu chuyến đi.',
  })

  callbacks[0]()

  assert.deepEqual(toast.active.value, {
    id: 2,
    severity: 'error',
    message: 'Không thể tải dữ liệu.',
  })
})

test('starts a four-second timer only for the active toast', () => {
  const timers = []
  const toast = createToastStore({
    setTimeoutFn: (callback, duration) => {
      timers.push({ callback, duration })
      return timers.length
    },
    clearTimeoutFn() {},
  })

  toast.warning('Dữ liệu chưa đầy đủ.')
  toast.success('Đã lưu thay đổi.')

  assert.equal(timers.length, 1)
  assert.equal(timers[0].duration, 4000)

  timers[0].callback()

  assert.equal(toast.active.value.message, 'Đã lưu thay đổi.')
  assert.equal(timers.length, 2)
  assert.equal(timers[1].duration, 4000)
})

test('dismisses manually and ignores blank messages', () => {
  const cleared = []
  const toast = createToastStore({
    setTimeoutFn: () => 99,
    clearTimeoutFn: (timerId) => cleared.push(timerId),
  })

  toast.warning('Kiểm tra lại thông tin.')
  toast.success('   ')
  toast.dismiss()

  assert.equal(toast.active.value, null)
  assert.deepEqual(cleared, [99])
})
