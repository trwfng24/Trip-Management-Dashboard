<template>
  <v-app>
    <div class="min-h-screen bg-[#f7f9f8]">
      <Header
        :user="auth.user.value"
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />
      <div class="lg:flex">
        <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
        <main class="min-w-0 flex-1">
          <div class="p-5 sm:p-7">Chức năng đang được phát triển</div>
        </main>
      </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import Header from '@/components/Header.vue'
import { auth } from '@/lib/auth'

const isSidebarOpen = ref(false)
</script>
