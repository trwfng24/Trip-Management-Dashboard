<template>
  <AuthLayout
    banner-src="/images/banner2.jpg"
    banner-title="Cùng nhau, đi xa hơn."
    banner-description="Tạo một không gian chung để biến mọi kế hoạch thành những hành trình đáng nhớ."
  >
    <h2 class="text-center text-[29px] font-bold tracking-tight text-[#ffd166] md:text-[#e56845]">
      Tạo tài khoản
    </h2>
    <v-alert
      v-if="confirmationSent"
      class="mt-8"
      type="success"
      variant="tonal"
      role="status"
      title="Kiểm tra hộp thư của bạn."
    >
      Chúng tôi đã gửi link xác thực đến {{ form.email }}.
      <template #append
        ><v-btn color="success" variant="text" :to="{ name: 'login' }">Đăng nhập</v-btn></template
      >
    </v-alert>
    <template v-else>
      <v-form class="mt-8" @submit.prevent="submit">
        <v-text-field
          v-model="form.displayName"
          class="[&_.v-field__input]:!text-white [&_.v-label]:!text-[#f1fff8] [&_input::placeholder]:!text-[#d8f3e5] md:[&_.v-field__input]:!text-[#22384a] md:[&_.v-label]:!text-[#52636d] md:[&_input::placeholder]:!text-[#72808b] md:[&_.v-field__outline]:text-[#e56845] md:[&_.v-field__outline]:[--v-field-border-opacity:0.75]"
          base-color="#e56845"
          color="#e56845"
          label="Tên hiển thị"
          autocomplete="name"
          placeholder="Ví dụ: Huy Nguyen"
          variant="underlined"
          :error-messages="errors.displayName"
        />
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
          autocomplete="new-password"
          :type="isPasswordVisible ? 'text' : 'password'"
          minlength="8"
          placeholder="Ít nhất 8 ký tự"
          variant="underlined"
          :error-messages="errors.password"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />
        <v-text-field
          v-model="form.confirmation"
          class="[&_.v-field__input]:!text-white [&_.v-field__append-inner]:!text-[#94a3b8] [&_.v-label]:!text-[#f1fff8] [&_input::placeholder]:!text-[#d8f3e5] md:[&_.v-field__input]:!text-[#22384a] md:[&_.v-label]:!text-[#52636d] md:[&_input::placeholder]:!text-[#72808b] md:[&_.v-field__outline]:text-[#e56845] md:[&_.v-field__outline]:[--v-field-border-opacity:0.75]"
          base-color="#e56845"
          color="#e56845"
          label="Nhập lại mật khẩu"
          autocomplete="new-password"
          :type="isConfirmationVisible ? 'text' : 'password'"
          placeholder="Nhập lại mật khẩu"
          variant="underlined"
          :error-messages="errors.confirmation"
          :append-inner-icon="isConfirmationVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isConfirmationVisible = !isConfirmationVisible"
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
          >Tạo tài khoản</v-btn
        >
      </v-form>
      <div
        class="my-6 flex items-center gap-3 text-xs font-medium text-[#f1fff8] md:text-[#52636d]"
      >
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
        >Đăng ký với Google</v-btn
      >
      <p class="mt-6 text-center text-xs font-medium text-[#f1fff8] md:text-[#52636d]">
        Đã có tài khoản?
        <v-btn
          class="px-1 !font-extrabold !text-[#ffd166] md:!text-[#e56845]"
          size="small"
          variant="text"
          :to="{ name: 'login' }"
          >Đăng nhập</v-btn
        >
      </p>
    </template>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import { useToast } from '@/common/useToast'
import { auth } from '../../lib/auth.js'
import { getAuthErrorMessage } from '../../lib/authErrors.js'
import { validateRegistration } from '../../lib/authValidation.js'
import { messages } from '@/common/messages'

const router = useRouter()
const toast = useToast()
const form = reactive({ displayName: '', email: '', password: '', confirmation: '' })
const errors = ref({})
const serverError = ref('')
const confirmationSent = ref(false)
const isSubmitting = ref(false)
const isPasswordVisible = ref(false)
const isConfirmationVisible = ref(false)

async function submit() {
  errors.value = validateRegistration(form)
  serverError.value = ''
  if (Object.keys(errors.value).length) return
  isSubmitting.value = true
  try {
    const result = await auth.signUp(form)
    if (result.session) {
      toast.success(messages.auth.signUpSuccess)
      await router.replace('/')
    } else confirmationSent.value = true
  } catch (error) {
    serverError.value = getAuthErrorMessage(error, 'Không thể tạo tài khoản. Vui lòng thử lại.')
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
