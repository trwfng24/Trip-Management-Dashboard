<template>
  <RouterView />
  <AppToast />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppToast from '@/common/AppToast.vue'
</script>
