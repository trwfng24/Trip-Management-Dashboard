<template>
  <div class="p-5 sm:p-7">
    <AppBreadcrumb :items="breadcrumbItems" class="mb-6" />

    <section aria-labelledby="workspace-title">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="workspace-title" class="mt-3 text-3xl font-bold tracking-tight text-[#183d4c] sm:text-4xl">Tất cả chuyến đi</h1>
          <p class="mt-2 text-sm text-[#166c74]">Tạo và mở workspace cho từng chuyến.</p>
        </div>
        <RouterLink :to="{ name: 'create-trip' }" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#166c74] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#12585f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c]">
          <v-icon icon="mdi-plus" size="20" />
          Tạo chuyến đi
        </RouterLink>
      </div>

      <div v-if="trips.length" class="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="trip in trips" :key="trip.id" class="group flex min-h-64 flex-col overflow-hidden rounded-2xl border border-[#d9e8e7] bg-white shadow-[0_10px_26px_rgba(24,61,76,0.1)] transition hover:-translate-y-1 hover:border-[#80adb3]">
          <div class="h-28 bg-[#183d4c] bg-cover bg-center" :style="{ backgroundImage: `linear-gradient(180deg, rgba(24,61,76,0.05), rgba(24,61,76,0.55)), url('${trip.coverUrl}')` }" />
          <div class="flex flex-1 flex-col p-5">
            <span class="w-fit rounded-full px-2.5 py-1 text-xs font-bold" :class="statusClass(trip.status)">{{ trip.status }}</span>
            <h2 class="mt-3 text-xl font-bold text-[#183d4c]">{{ trip.name }}</h2>
            <p class="mt-1 text-sm text-[#52717a]">{{ trip.destination }} · {{ formatDates(trip) }}</p>
            <footer class="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-bold text-[#166c74]">
              <span class="inline-flex items-center gap-1.5 text-[#52717a]"><v-icon icon="mdi-account-group-outline" size="18" />{{ trip.members.length }} người</span>
              <button class="rounded-md px-1 py-1 text-[#166c74] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c]" type="button" @click="openTrip">Mở workspace →</button>
            </footer>
          </div>
        </article>
      </div>

      <div v-else class="mt-7 rounded-2xl border border-dashed border-[#9ab6ba] bg-white p-10 text-center">
        <v-icon icon="mdi-bag-suitcase-outline" color="#166c74" size="42" />
        <h2 class="mt-3 text-lg font-bold text-[#183d4c]">Chưa có chuyến đi nào</h2>
        <p class="mt-1 text-sm text-[#52717a]">Tạo chuyến đi đầu tiên để bắt đầu lên kế hoạch.</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import { createWorkspaceBreadcrumbItems } from '@/lib/workspaceNavigation'

const route = useRoute()
const router = useRouter()
const trips = ref([
  { id: 'trip-da-nang', name: 'Đà Nẵng cuối tuần', destination: 'Đà Nẵng', startDate: '2026-10-19', endDate: '2026-10-22', status: 'Đang lên kế hoạch', budget: 12000000, members: ['Huy', 'Linh', 'Minh', 'An'], coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80' },
  { id: 'trip-da-lat', name: 'Đà Lạt mùa hoa', destination: 'Đà Lạt, Lâm Đồng', startDate: '2026-11-14', endDate: '2026-11-16', status: 'Đã chốt', budget: 8500000, members: ['Huy', 'Ngọc', 'Tú'], coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80' },
  { id: 'trip-phu-quoc', name: 'Trốn đông ở Phú Quốc', destination: 'Phú Quốc, Kiên Giang', startDate: '2026-12-21', endDate: '2026-12-25', status: 'Bản nháp', budget: 18000000, members: ['Huy', 'Vy'], coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80' },
])

const breadcrumbItems = computed(() => createWorkspaceBreadcrumbItems(route.name))


function openTrip() { router.push({ name: 'overview' }) }

function formatDates(trip) {
  const formatter = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${formatter.format(new Date(`${trip.startDate}T00:00:00`))} – ${formatter.format(new Date(`${trip.endDate}T00:00:00`))}`
}

function statusClass(status) {
  return { 'Bản nháp': 'bg-[#eef1f3] text-[#52616a]', 'Đang lên kế hoạch': 'bg-[#fff2d9] text-[#945c00]', 'Đã chốt': 'bg-[#e6f2fb] text-[#1e6391]', 'Đang diễn ra': 'bg-[#e4f5ec] text-[#15744e]', 'Đã hoàn tất': 'bg-[#f0eafa] text-[#7351a5]' }[status]
}
</script>
