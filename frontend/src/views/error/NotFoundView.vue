<template>
  <ErrorPageLayout
    status="404"
    icon="mdi-map-marker-question-outline"
    title="Không tìm thấy trang này"
    description="Có thể đường dẫn không còn tồn tại hoặc đã bị thay đổi. Hãy quay về trang chủ để tiếp tục lên kế hoạch cho chuyến đi."
    action-label="Về trang chủ"
    :action-to="{ name: 'dashboard' }"
  />
</template>

<script setup>
import ErrorPageLayout from '@/components/ErrorPageLayout.vue'
</script>
