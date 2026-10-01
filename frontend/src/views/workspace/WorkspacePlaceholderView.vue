<template>
  <v-app>
    <div class="min-h-screen bg-[#f7f9f8] lg:flex">
      <AppSidebar />
      Chức năng đang được phát triển
    </div>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'

const route = useRoute()
const title = computed(() => route.meta.title ?? 'Tổng quan')
</script>
