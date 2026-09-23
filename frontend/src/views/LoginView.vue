<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthLayout from '../components/AuthLayout.vue'
import { auth } from '../lib/auth'
import { getAuthErrorMessage } from '../lib/authErrors'
import { validateLogin } from '../lib/authValidation'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const errors = ref({})
const serverError = ref('')
const isSubmitting = ref(false)

async function submit() {
  errors.value = validateLogin(form)
  serverError.value = ''
  if (Object.keys(errors.value).length) return
  isSubmitting.value = true
  try {
    await auth.signIn(form)
    await router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (error) {
    serverError.value = getAuthErrorMessage(error, 'Không thể đăng nhập. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}

async function signInWithGoogle() {
  serverError.value = ''
  isSubmitting.value = true
  try {
    await auth.signInWithGoogle()
  } catch (error) {
    serverError.value = getAuthErrorMessage(error, 'Không thể kết nối với Google. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <p class="auth-card__eyebrow">Chào mừng trở lại</p><h2>Đăng nhập</h2>
    <p class="auth-card__intro">Đăng nhập để tiếp tục quản lý các chuyến đi của bạn.</p>
    <form class="auth-form" @submit.prevent="submit">
      <label for="login-email">Email</label>
      <input id="login-email" v-model="form.email" autocomplete="email" inputmode="email" type="email" placeholder="you@example.com" :aria-invalid="Boolean(errors.email)" />
      <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
      <label for="login-password">Mật khẩu</label>
      <input id="login-password" v-model="form.password" autocomplete="current-password" type="password" placeholder="Nhập mật khẩu của bạn" :aria-invalid="Boolean(errors.password)" />
      <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
      <p v-if="serverError" class="auth-error" role="alert">{{ serverError }}</p>
      <button class="auth-button auth-button--primary" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập' }}</button>
    </form>
    <div class="auth-divider"><span>hoặc</span></div>
    <button class="auth-button auth-button--google" type="button" :disabled="isSubmitting" @click="signInWithGoogle"><span aria-hidden="true">G</span> Tiếp tục với Google</button>
    <p class="auth-switch">Chưa có tài khoản? <RouterLink to="/register">Đăng ký</RouterLink></p>
  </AuthLayout>
</template>
