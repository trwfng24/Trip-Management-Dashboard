<template>
  <ErrorPageLayout
    status="500"
    icon="mdi-alert-circle-outline"
    title="Đã có sự cố xảy ra"
    description="Chúng tôi chưa thể hoàn tất yêu cầu của bạn lúc này. Vui lòng quay lại trang chủ và thử lại sau."
    action-label="Về trang chủ"
    :action-to="{ name: 'dashboard' }"
  />
</template>

<script setup>
import ErrorPageLayout from '@/components/ErrorPageLayout.vue'
</script>
