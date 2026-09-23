<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../lib/auth'
import { getAuthErrorMessage } from '../lib/authErrors'
import { signOutAndRedirect } from '../lib/dashboardAuth'

const router = useRouter()
const isSigningOut = ref(false)
const signOutError = ref('')

async function signOut() {
  signOutError.value = ''
  isSigningOut.value = true

  try {
    await signOutAndRedirect({ auth, router })
  } catch (error) {
    signOutError.value = getAuthErrorMessage(error, 'Không thể đăng xuất. Vui lòng thử lại.')
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <v-app>
    <v-main class="min-h-screen bg-slate-50 p-6 sm:p-10">
      <v-container class="flex min-h-[80vh] items-center justify-center">
        <v-card class="w-full max-w-2xl" elevation="3">
          <v-card-text class="p-8 sm:p-12">
            <p class="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">DiDiEms</p>
            <h1 id="page-title" class="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Trip Management Dashboard
            </h1>
            <p class="mt-5 text-lg leading-8 text-slate-600">
              Không gian quản lý chuyến đi đang được xây dựng.
            </p>
            <v-chip v-if="auth.user.value" class="mt-6" color="primary" variant="tonal"
              >Đăng nhập với {{ auth.user.value.email }}</v-chip
            >
            <v-alert v-if="signOutError" class="mt-6" type="error" variant="tonal" role="alert">{{
              signOutError
            }}</v-alert>
            <v-btn class="mt-8" color="primary" :loading="isSigningOut" @click="signOut"
              >Đăng xuất</v-btn
            >
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
