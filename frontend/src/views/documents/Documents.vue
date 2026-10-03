<template>
  <div class="p-5 sm:p-7">
    <AppBreadcrumb :items="breadcrumbItems" class="mb-5" />
    Document
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import { createWorkspaceBreadcrumbItems } from '@/lib/workspaceNavigation'

const route = useRoute()
const breadcrumbItems = computed(() => createWorkspaceBreadcrumbItems(route.name))
</script>
