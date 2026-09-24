<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import { useToast } from '@/composables/useToast'
import { auth } from '../../lib/auth.js'
import { getAuthErrorMessage } from '../../lib/authErrors.js'
import { validateLogin } from '../../lib/authValidation.js'
import { messages } from '@/lib/messages'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const form = reactive({ email: '', password: '' })
const errors = ref({})
const serverError = ref('')
const isSubmitting = ref(false)
const isPasswordVisible = ref(false)

async function submit() {
  errors.value = validateLogin(form)
  serverError.value = ''
  if (Object.keys(errors.value).length) return
  isSubmitting.value = true
  try {
    await auth.signIn(form)
    toast.success(messages.auth.signInSuccess)
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
    serverError.value = getAuthErrorMessage(
      error,
      'Không thể kết nối với Google. Vui lòng thử lại.',
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout
    banner-src="/images/banner1.jpg"
    banner-title="Mọi hành trình đều đáng nhớ."
    banner-description="Lên lịch trình, chia sẻ công việc và lưu lại những khoảnh khắc đẹp nhất cùng cả nhóm."
  >
    <h2 class="text-center text-[29px] font-bold tracking-tight text-[#ffd166] md:text-[#e56845]">
      Đăng nhập
    </h2>
    <v-form class="mt-8" @submit.prevent="submit">
      <v-text-field
        v-model="form.email"
        class="[&_.v-field__input]:!text-white [&_.v-label]:!text-[#f1fff8] [&_input::placeholder]:!text-[#d8f3e5] md:[&_.v-field__input]:!text-[#22384a] md:[&_.v-label]:!text-[#52636d] md:[&_input::placeholder]:!text-[#72808b] md:[&_.v-field__outline]:text-[#e56845] md:[&_.v-field__outline]:[--v-field-border-opacity:0.75]"
        base-color="#e56845"
        color="#e56845"
        label="Email"
        autocomplete="email"
        inputmode="email"
        type="email"
        placeholder="you@example.com"
        variant="underlined"
        :error-messages="errors.email"
      />
      <v-text-field
        v-model="form.password"
        class="[&_.v-field__input]:!text-white [&_.v-field__append-inner]:!text-[#94a3b8] [&_.v-label]:!text-[#f1fff8] [&_input::placeholder]:!text-[#d8f3e5] md:[&_.v-field__input]:!text-[#22384a] md:[&_.v-label]:!text-[#52636d] md:[&_input::placeholder]:!text-[#72808b] md:[&_.v-field__outline]:text-[#e56845] md:[&_.v-field__outline]:[--v-field-border-opacity:0.75]"
        base-color="#e56845"
        color="#e56845"
        label="Mật khẩu"
        autocomplete="current-password"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Nhập mật khẩu của bạn"
        variant="underlined"
        :error-messages="errors.password"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
      />
      <v-alert v-if="serverError" class="mb-4" type="error" variant="tonal" role="alert">{{
        serverError
      }}</v-alert>
      <v-btn
        block
        class="mt-2 !rounded-[10px] !bg-[#e56845] !font-extrabold !text-white"
        size="large"
        type="submit"
        :loading="isSubmitting"
        >Đăng nhập</v-btn
      >
    </v-form>
    <div class="my-6 flex items-center gap-3 text-xs font-medium text-[#f1fff8] md:text-[#52636d]">
      <v-divider color="#eadfce" /><span>hoặc</span><v-divider color="#eadfce" />
    </div>
    <v-btn
      block
      class="!rounded-[10px] !border-[#eadfce] !bg-white !font-extrabold !text-[#22384a]"
      size="large"
      variant="outlined"
      :loading="isSubmitting"
      @click="signInWithGoogle"
      ><template #prepend><span class="font-bold text-[#e56845]">G</span></template
      >Tiếp tục với Google</v-btn
    >
    <p class="mt-6 text-center text-xs font-medium text-[#f1fff8] md:text-[#52636d]">
      Chưa có tài khoản?
      <v-btn
        class="px-1 !font-extrabold !text-[#ffd166] md:!text-[#e56845]"
        size="small"
        variant="text"
        :to="{ name: 'register' }"
        >Đăng ký</v-btn
      >
    </p>
  </AuthLayout>
</template>
