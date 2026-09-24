<script setup>
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { getToastPresentation } from '@/lib/toastPresentation'

const toast = useToast()
const active = computed(() => toast.active.value)
const presentation = computed(() => getToastPresentation(active.value?.severity))

function dismissWhenClosed(isVisible) {
  if (!isVisible && active.value) toast.dismiss()
}
</script>

<template>
  <v-snackbar
    :model-value="Boolean(active)"
    location="top right"
    :timeout="-1"
    :color="presentation?.color"
    @update:model-value="dismissWhenClosed"
  >
    <span :role="presentation?.role" class="flex items-center gap-3">
      <v-icon :icon="presentation?.icon" />
      {{ active?.message }}
    </span>
    <template #actions>
      <v-btn icon="mdi-close" aria-label="Đóng thông báo" @click="toast.dismiss()" />
    </template>
  </v-snackbar>
</template>
