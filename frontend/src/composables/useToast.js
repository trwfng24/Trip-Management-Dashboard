import { ref } from 'vue'

export function createToastStore({
  duration = 4000,
  setTimeoutFn = setTimeout,
  clearTimeoutFn = clearTimeout,
} = {}) {
  const active = ref(null)
  const queue = []
  let nextId = 1
  let timeoutId

  function showNext() {
    active.value = queue.shift() ?? null
    if (active.value) {
      timeoutId = setTimeoutFn(dismiss, duration)
    }
  }

  function enqueue(severity, message) {
    if (typeof message !== 'string' || !message.trim()) return

    queue.push({ id: nextId++, severity, message })
    if (!active.value) showNext()
  }

  function dismiss() {
    if (timeoutId !== undefined) clearTimeoutFn(timeoutId)
    timeoutId = undefined
    active.value = null
    showNext()
  }

  return {
    active,
    success: (message) => enqueue('success', message),
    warning: (message) => enqueue('warning', message),
    error: (message) => enqueue('error', message),
    dismiss,
  }
}

const sharedToast = createToastStore()

export const useToast = () => sharedToast
