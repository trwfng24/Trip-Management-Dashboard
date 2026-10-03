<template><div class="p-5 sm:p-7"><AppBreadcrumb :items="breadcrumbItems" class="mb-6" /><CreateTripForm @submit="saveTrip" @cancel="router.push({ name: 'dashboard' })" /></div></template>
<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import { createWorkspaceBreadcrumbItems } from '@/lib/workspaceNavigation'
import CreateTripForm from './components/CreateTripForm.vue'
const route = useRoute(); const router = useRouter(); const breadcrumbItems = computed(() => createWorkspaceBreadcrumbItems(route.name))
function saveTrip() { router.push({ name: 'dashboard' }) }
</script>
