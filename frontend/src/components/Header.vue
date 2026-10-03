<template>
  <header
    class="sticky top-0 z-50 flex min-h-12 items-center gap-3 border-b border-[#166c74] bg-[#183d4c] px-4 py-1 text-white sm:px-6"
  >
    <RouterLink :to="{ name: 'dashboard' }" aria-label="DiDiEms - Dashboard">
      <img src="/images/logo.png" class="h-auto w-28 sm:w-32" alt="DiDiEms" />
    </RouterLink>

    <div
      class="ml-auto flex min-w-0 shrink-0 items-center gap-2.5"
      aria-label="Thông tin tài khoản"
    >
      <span class="hidden max-w-32 text-right sm:grid sm:max-w-64">
        <span class="truncate text-sm font-bold text-white">{{ displayName }}</span>
        <span class="truncate text-xs text-[#c9dde0]">{{ user?.email }}</span>
      </span>

      <v-menu location="bottom end" offset="8">
        <template #activator="{ props: menuProps }">
          <button
            v-bind="menuProps"
            class="sm:hidden rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c]"
            type="button"
            aria-label="Hiển thị thông tin tài khoản"
          >
            <v-avatar color="#e8c47c" size="30"
              ><span class="text-sm font-bold text-[#183d4c]">{{ initials }}</span></v-avatar
            >
          </button>
        </template>

        <div class="account-menu">
          <span class="truncate text-sm font-bold text-[#183d4c]">{{ displayName }}</span>
          <span class="truncate text-xs text-[#52717a]">{{ user?.email }}</span>
          <button
            class="account-menu__logout"
            type="button"
            :disabled="isSigningOut"
            :aria-busy="isSigningOut"
            @click="signOut"
          >
            <v-icon icon="mdi-logout" size="18" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </v-menu>

      <span class="hidden sm:block">
        <v-avatar color="#e8c47c" size="30">
          <span class="text-sm font-bold text-[#183d4c]">{{ initials }}</span>
        </v-avatar>
      </span>

      <button
        class="desktop-logout hidden items-center gap-2 rounded-lg border border-[#e8c47c]/80 px-3 py-1.5 text-sm font-bold text-[#e8c47c] transition hover:bg-[#166c74] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c] sm:flex"
        type="button"
        :disabled="isSigningOut"
        :aria-busy="isSigningOut"
        @click="signOut"
      >
        <v-icon icon="mdi-logout" size="18" />
        <span>Đăng xuất</span>
      </button>
    </div>

    <button
      class="grid size-8 shrink-0 place-items-center rounded-lg text-white transition hover:bg-[#166c74] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c] lg:hidden"
      type="button"
      :aria-label="isSidebarOpen ? 'Đóng menu' : 'Mở menu'"
      :aria-expanded="isSidebarOpen"
      @click="emit('toggle-sidebar')"
    >
      <v-icon :icon="isSidebarOpen ? 'mdi-close' : 'mdi-menu'" size="22" />
    </button>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/lib/auth'
import { signOutAndRedirect } from '@/lib/dashboardAuth'
import { messages } from '@/common/messages'
import { useToast } from '@/common/useToast'

const props = defineProps({
  user: { type: Object, default: null },
  isSidebarOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-sidebar'])
const isSigningOut = ref(false)
const router = useRouter()
const toast = useToast()

const displayName = computed(
  () => props.user?.user_metadata?.display_name || props.user?.email || 'Tài khoản',
)
const initials = computed(() =>
  displayName.value
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase(),
)

async function signOut() {
  if (isSigningOut.value) return

  isSigningOut.value = true

  try {
    await signOutAndRedirect({ auth, router })
    toast.success(messages.auth.signOutSuccess)
  } catch {
    toast.error(messages.auth.signOutFailed)
  } finally {
    isSigningOut.value = false
  }
}
</script>

<style scoped>
.account-menu {
  display: grid;
  min-width: 220px;
  max-width: min(320px, calc(100vw - 24px));
  gap: 2px;
  border: 1px solid rgba(24, 61, 76, 0.14);
  border-radius: 10px;
  background: #fff;
  padding: 12px 14px;
  box-shadow: 0 12px 28px rgba(24, 61, 76, 0.18);
}

.account-menu__logout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 10px;
  border: 0;
  border-top: 1px solid rgba(24, 61, 76, 0.14);
  background: transparent;
  padding: 10px 0 0;
  color: #b42318;
  font-weight: 700;
  text-align: left;
}

.account-menu__logout:hover:not(:disabled) {
  color: #8f1d15;
}

.account-menu__logout:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
