<script setup>
import ErrorPageLayout from '@/components/ErrorPageLayout.vue'
</script>

<template>
  <ErrorPageLayout
    status="403"
    icon="mdi-shield-lock-outline"
    title="Bạn không có quyền truy cập"
    description="Khu vực này chỉ dành cho những thành viên được cấp quyền. Hãy quay về không gian chuyến đi của bạn."
    action-label="Về trang chủ"
    :action-to="{ name: 'dashboard' }"
  />
</template>
