const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}

  if (!emailPattern.test(email.trim())) {
    errors.email = 'Email không hợp lệ.'
  }
  if (!password) {
    errors.password = 'Vui lòng nhập mật khẩu.'
  }

  return errors
}

export function validateRegistration({
  displayName,
  email,
  password,
  confirmation,
}) {
  const errors = validateLogin({ email, password })

  if (!displayName.trim()) {
    errors.displayName = 'Vui lòng nhập tên hiển thị.'
  }
  if (password && password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự.'
  }
  if (confirmation !== password) {
    errors.confirmation = 'Mật khẩu xác nhận không khớp.'
  }

  return errors
}
