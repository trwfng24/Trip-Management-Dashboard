<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { auth } from '../lib/auth'
import { getAuthErrorMessage } from '../lib/authErrors'
import { validateRegistration } from '../lib/authValidation'

const router = useRouter()
const form = reactive({ displayName: '', email: '', password: '', confirmation: '' })
const errors = ref({})
const serverError = ref('')
const confirmationSent = ref(false)
const isSubmitting = ref(false)

async function submit() {
  errors.value = validateRegistration(form)
  serverError.value = ''
  if (Object.keys(errors.value).length) return
  isSubmitting.value = true
  try {
    const result = await auth.signUp(form)
    if (result.session) await router.replace('/')
    else confirmationSent.value = true
  } catch (error) {
    serverError.value = getAuthErrorMessage(error, 'Không thể tạo tài khoản. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}

async function signInWithGoogle() {
  serverError.value = ''
  isSubmitting.value = true
  try { await auth.signInWithGoogle() }
  catch (error) { serverError.value = getAuthErrorMessage(error, 'Không thể kết nối với Google. Vui lòng thử lại.') }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <AuthLayout>
    <p class="auth-card__eyebrow">Bắt đầu thật dễ dàng</p><h2>Tạo tài khoản</h2>
    <p class="auth-card__intro">Tạo workspace đầu tiên và bắt đầu lên kế hoạch cùng nhóm của bạn.</p>
    <div v-if="confirmationSent" class="auth-success" role="status"><strong>Kiểm tra hộp thư của bạn.</strong><p>Chúng tôi đã gửi link xác thực đến {{ form.email }}.</p><RouterLink class="auth-button auth-button--primary" to="/login">Đến trang đăng nhập</RouterLink></div>
    <template v-else>
      <form class="auth-form" @submit.prevent="submit">
        <label for="register-name">Tên hiển thị</label><input id="register-name" v-model="form.displayName" autocomplete="name" type="text" placeholder="Ví dụ: Huy Nguyen" :aria-invalid="Boolean(errors.displayName)" /><p v-if="errors.displayName" class="field-error">{{ errors.displayName }}</p>
        <label for="register-email">Email</label><input id="register-email" v-model="form.email" autocomplete="email" inputmode="email" type="email" placeholder="you@example.com" :aria-invalid="Boolean(errors.email)" /><p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        <label for="register-password">Mật khẩu</label><input id="register-password" v-model="form.password" autocomplete="new-password" type="password" minlength="8" placeholder="Ít nhất 8 ký tự" :aria-invalid="Boolean(errors.password)" /><p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        <label for="register-confirmation">Nhập lại mật khẩu</label><input id="register-confirmation" v-model="form.confirmation" autocomplete="new-password" type="password" placeholder="Nhập lại mật khẩu" :aria-invalid="Boolean(errors.confirmation)" /><p v-if="errors.confirmation" class="field-error">{{ errors.confirmation }}</p>
        <p v-if="serverError" class="auth-error" role="alert">{{ serverError }}</p>
        <button class="auth-button auth-button--primary" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Đang tạo tài khoản…' : 'Tạo tài khoản' }}</button>
      </form>
      <div class="auth-divider"><span>hoặc</span></div>
      <button class="auth-button auth-button--google" type="button" :disabled="isSubmitting" @click="signInWithGoogle"><span aria-hidden="true">G</span> Đăng ký với Google</button>
      <p class="auth-switch">Đã có tài khoản? <RouterLink to="/login">Đăng nhập</RouterLink></p>
    </template>
  </AuthLayout>
</template>
