<template>
  <v-app>
    <div class="min-h-screen bg-[#f7f9f8] lg:flex">
      <AppSidebar />
      <main class="min-w-0 flex-1 p-5 pt-20 sm:p-8 sm:pt-20 lg:pt-8">
        <section class="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.14em] text-[#176b50]">Chuyến đi đang chọn</p>
        <h2 class="mt-2 text-3xl font-bold tracking-tight text-[#22384a] sm:text-4xl">Đà Nẵng cuối tuần</h2>
        <p class="mt-3 text-[#72808b]">20–22 tháng 9, 2026 · 6 người tham gia</p>
      </div>
      <span class="rounded-full bg-[#e6f7d0] px-3 py-1.5 text-sm font-bold text-[#176b50]">Đang lên kế hoạch</span>
        </section>

        <section class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-sm">
            <p class="text-sm font-medium text-[#72808b]">{{ stat.label }}</p>
            <p class="mt-3 text-3xl font-bold text-[#22384a]">{{ stat.value }}</p>
            <p class="mt-1 text-sm text-[#176b50]">{{ stat.detail }}</p>
          </article>
        </section>
      </main>
    </div>
  </v-app>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'

const stats = [
  { label: 'Ý kiến mới', value: '12', detail: 'Cần leader xem xét' },
  { label: 'Hoạt động đã chốt', value: '8', detail: 'Trong 3 ngày' },
  { label: 'Checklist', value: '14/20', detail: 'Đã hoàn thành' },
  { label: 'Tổng chi phí', value: '8,4tr', detail: 'Dữ liệu fake' },
]
</script>
