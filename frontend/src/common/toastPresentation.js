const presentations = Object.freeze({
  success: Object.freeze({
    color: 'success',
    icon: 'mdi-check-circle-outline',
    role: 'status',
  }),
  warning: Object.freeze({
    color: 'warning',
    icon: 'mdi-alert-outline',
    role: 'status',
  }),
  error: Object.freeze({
    color: 'error',
    icon: 'mdi-alert-circle-outline',
    role: 'alert',
  }),
})

export function getToastPresentation(severity) {
  return presentations[severity]
}
