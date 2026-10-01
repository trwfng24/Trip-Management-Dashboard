<template>
  <button class="fixed left-4 top-4 z-20 grid size-10 place-items-center rounded-lg bg-[#174e5c] text-white shadow-lg lg:hidden" type="button" aria-label="Open menu" @click="isSidebarOpen = true">
    <v-icon icon="mdi-menu" size="24" />
  </button>
  <button v-if="isSidebarOpen" class="fixed inset-0 z-30 bg-[#102b34]/45 lg:hidden" aria-label="Close menu" @click="isSidebarOpen = false" />
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-[250px] -translate-x-full flex-col overflow-y-auto bg-[#174e5c] px-4 py-6 text-[#f4f8ec] shadow-2xl transition-transform duration-200 lg:static lg:z-0 lg:min-h-screen lg:translate-x-0 lg:overflow-visible lg:shadow-none"
    :class="{ 'translate-x-0': isSidebarOpen }"
  >
    <RouterLink class="mb-7 block" :to="{ name: 'dashboard' }" aria-label="DiDiEms - Overview">
      <img src="/images/logo.png" class="h-auto w-[176px]" alt="DiDiEms" />
    </RouterLink>
    <RouterLink class="trip-switcher" :to="{ name: 'dashboard' }" @click="isSidebarOpen = false">
      <span>Trip collection</span>
      <strong>Đà Nẵng cuối tuần</strong>
      <span>Manage all trips →</span>
    </RouterLink>
    <nav class="mt-7 grid gap-1" aria-label="Trip workspace">
      <span class="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#d7eee3]">Trip workspace</span>
      <RouterLink
        v-for="item in sidebarItems"
        :key="item.routeName"
        class="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#c3d9d0] transition hover:bg-[#dff46a]/14 hover:text-[#f4ffc2]"
        :class="{ 'bg-[#dff46a]/14 text-[#f4ffc2]': route.name === item.routeName }"
        :aria-current="route.name === item.routeName ? 'page' : undefined"
        :to="{ name: item.routeName }"
        @click="isSidebarOpen = false"
      >
        <v-icon :icon="item.icon" size="20" />
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto rounded-full bg-[#dff46a] px-2 py-0.5 text-xs font-bold text-[#174e5c]">{{ item.badge }}</span>
      </RouterLink>
    </nav>
    <div class="side-bottom">
      <button class="logout" type="button" @click="signOut"><v-icon icon="mdi-logout" size="20" /> Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '@/lib/auth'
import { signOutAndRedirect } from '@/lib/dashboardAuth'
import { messages } from '@/common/messages'
import { useToast } from '@/common/useToast'

const sidebarItems = [
  { label: 'Overview', routeName: 'dashboard', icon: 'mdi-view-dashboard-outline' },
  { label: 'Opinions', routeName: 'opinions', icon: 'mdi-message-text-outline', badge: '12' },
  { label: 'Plan', routeName: 'plan', icon: 'mdi-calendar-clock-outline' },
  { label: 'Checklist', routeName: 'checklist', icon: 'mdi-format-list-checks' },
  { label: 'Documents', routeName: 'documents', icon: 'mdi-folder-outline' },
  { label: 'Expenses', routeName: 'expenses', icon: 'mdi-wallet-outline' },
  { label: 'Export', routeName: 'export', icon: 'mdi-export-variant' },
]

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isSidebarOpen = ref(false)

async function signOut() {
  try {
    await signOutAndRedirect({ auth, router })
    toast.success(messages.auth.signOutSuccess)
  } catch {
    toast.error(messages.auth.signOutFailed)
  }
}
</script>

<style scoped>
.trip-switcher { width: 100%; min-height: 120px; display: flex; flex-direction: column; justify-content: flex-end; border: 2px solid rgba(255, 255, 255, 0.58); border-radius: 20px 20px 20px 6px; padding: 13px; color: #fff; text-align: left; background: linear-gradient(180deg, rgba(10, 47, 59, 0.05), rgba(10, 47, 59, 0.86)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80') center / cover; transition: border-color 0.2s ease; }
.trip-switcher:hover { border-color: #dff46a; }
.trip-switcher strong { padding-top: 5px; font-size: 15px; text-shadow: 0 1px 8px #10221d; }
.trip-switcher span:first-child { color: #d7eee3; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.trip-switcher span:last-child { margin-top: 4px; color: #e6f6ef; font-size: 11px; }
.side-bottom { margin-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.13); padding: 18px 8px 0; }
.logout { display: flex; width: 100%; align-items: center; gap: 11px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9px; background: transparent; padding: 9px; color: #d7eee3; text-align: left; font-size: 13px; font-weight: 800; }
.logout:hover { border-color: #ffb098; color: #fff; }
</style>
