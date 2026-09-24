<script setup>
defineProps({
  actionLabel: { type: String, required: true },
  actionTo: { type: [Object, String], required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  status: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <v-app>
    <v-main
      class="flex min-h-screen items-center justify-center bg-[#f7f9f8] p-5 text-[#22384a] sm:p-10"
    >
      <section class="w-full max-w-3xl">
        <v-card class="w-full overflow-hidden !rounded-3xl" elevation="5">
          <div class="h-2 bg-[#e56845]" />
          <v-card-text class="px-6 py-12 text-center sm:px-14 sm:py-16">
            <v-avatar class="!bg-[#fff1df] !text-[#e56845]" size="72">
              <v-icon :icon="icon" size="36" />
            </v-avatar>
            <p class="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-[#e56845]">
              Lỗi {{ status }}
            </p>
            <h1 class="mt-3 text-3xl font-bold tracking-tight text-[#22384a] sm:text-4xl">
              {{ title }}
            </h1>
            <p class="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600">
              {{ description }}
            </p>
            <v-btn
              class="mt-9 !rounded-[10px] !bg-[#e56845] !font-extrabold !text-white"
              size="large"
              :to="actionTo"
            >
              {{ actionLabel }}
            </v-btn>
          </v-card-text>
        </v-card>
      </section>
    </v-main>
  </v-app>
</template>
