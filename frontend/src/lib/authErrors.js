const messages = {
  email_not_confirmed: 'Vui lòng xác thực email trước khi đăng nhập.',
  invalid_credentials: 'Email hoặc mật khẩu không đúng.',
  user_already_exists: 'Email này đã được đăng ký.',
}

export function getAuthErrorMessage(error, fallback) {
  return messages[error?.code] || fallback
}
