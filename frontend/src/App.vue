<template>
  <v-app>
    <div v-if="isWorkspaceRoute" class="min-h-screen bg-[#f7f9f8]">
      <Header
        :user="auth.user.value"
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
      />
      <div class="lg:flex">
        <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />
        <main class="min-w-0 flex-1">
          <RouterView />
        </main>
      </div>
    </div>
    <RouterView v-else />
    <AppToast />
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppToast from '@/components/AppToast.vue'
import Header from '@/components/Header.vue'
import { auth } from '@/lib/auth'

const isSidebarOpen = ref(false)
const route = useRoute()
const isWorkspaceRoute = computed(() => route.meta.requiresAuth)
</script>
