<template>
  <button v-if="isOpen" class="fixed inset-x-0 bottom-0 top-12 z-30 bg-[#183d4c]/45 lg:hidden" aria-label="Close menu" @click="emit('close')" />
  <aside
    class="fixed bottom-0 left-0 top-12 z-40 flex w-[250px] -translate-x-full flex-col overflow-y-auto bg-[#183d4c] px-4 py-6 text-[#f4f8ec] shadow-2xl transition-transform duration-200 lg:static lg:z-0 lg:min-h-[calc(100vh-3rem)] lg:translate-x-0 lg:overflow-visible lg:shadow-none"
    :class="{ 'translate-x-0': isOpen }"
  >
    <RouterLink class="trip-switcher" :to="{ name: 'dashboard' }" @click="emit('close')">
      <span>Trip collection</span>
      <strong>Đà Nẵng cuối tuần</strong>
      <span>Manage all trips →</span>
    </RouterLink>
    <nav class="mt-7 grid gap-1" aria-label="Trip workspace">
      <span class="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#d7eee3]">Trip workspace</span>
      <RouterLink
        v-for="item in sidebarItems"
        :key="item.routeName"
        class="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#d9e8e7] transition hover:bg-[#166c74] hover:text-white"
        :class="{ 'bg-[#166c74] text-white ring-1 ring-inset ring-[#3f7d58]': route.name === item.routeName }"
        :aria-current="route.name === item.routeName ? 'page' : undefined"
        :to="{ name: item.routeName }"
        @click="emit('close')"
      >
        <v-icon :icon="item.icon" size="20" />
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto rounded-full bg-[#e8c47c] px-2 py-0.5 text-xs font-bold text-[#183d4c]">{{ item.badge }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const sidebarItems = [
  { label: 'Overview', routeName: 'overview', icon: 'mdi-view-dashboard-outline' },
  { label: 'Opinions', routeName: 'opinions', icon: 'mdi-message-text-outline', badge: '12' },
  { label: 'Plan', routeName: 'plan', icon: 'mdi-calendar-clock-outline' },
  { label: 'Checklist', routeName: 'checklist', icon: 'mdi-format-list-checks' },
  { label: 'Documents', routeName: 'documents', icon: 'mdi-folder-outline' },
  { label: 'Expenses', routeName: 'expenses', icon: 'mdi-wallet-outline' },
  { label: 'Export', routeName: 'export', icon: 'mdi-export-variant' },
]

defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
const route = useRoute()
</script>

<style scoped>
.trip-switcher { width: 100%; min-height: 120px; display: flex; flex-direction: column; justify-content: flex-end; border: 2px solid rgba(255, 255, 255, 0.58); border-radius: 20px 20px 20px 6px; padding: 13px; color: #fff; text-align: left; background: linear-gradient(180deg, rgba(10, 47, 59, 0.05), rgba(10, 47, 59, 0.86)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80') center / cover; transition: border-color 0.2s ease; }
.trip-switcher:hover { border-color: #e8c47c; }
.trip-switcher strong { padding-top: 5px; font-size: 15px; text-shadow: 0 1px 8px #10221d; }
.trip-switcher span:first-child { color: #d7eee3; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.trip-switcher span:last-child { margin-top: 4px; color: #e6f6ef; font-size: 11px; }
</style>
