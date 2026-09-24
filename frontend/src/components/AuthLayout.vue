<template>
  <v-app>
    <v-main class="min-h-screen bg-[#f7f9f8] text-[#22384a]">
      <div class="relative grid min-h-screen md:grid-cols-[1.1fr_0.9fr]">
          <div class="absolute inset-0 md:hidden" aria-hidden="true">
            <img :src="bannerSrc" class="h-full w-full object-cover" alt="" />
            <div class="absolute inset-0 bg-[#0a3427]/75" />
          </div>
          <section class="relative hidden min-h-screen overflow-hidden text-white md:flex md:flex-col md:justify-between" aria-hidden="true">
            <img :src="bannerSrc" class="absolute inset-0 h-full w-full object-cover" alt="" />
            <div class="absolute inset-0 bg-gradient-to-br from-[#0a3427]/85 via-[#126046]/65 to-[#0a3427]/45" />
            <div class="relative flex items-center gap-3 p-8 text-xl font-extrabold tracking-tight sm:p-12">
              <v-avatar size="34" color="#ffd166" class="text-[#174e5c]"><span class="text-lg">✦</span></v-avatar>
              DiDiEms
            </div>
            <div class="relative max-w-xl px-8 pb-16 sm:px-12">
              <p class="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#dcf1e8]">Trip workspace</p>
              <h1 class="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{{ bannerTitle }}</h1>
              <p class="mt-6 max-w-md text-base leading-7 text-[#dcf1e8]">{{ bannerDescription }}</p>
            </div>
          </section>

          <section class="relative flex min-h-screen items-center justify-center bg-transparent p-5 sm:p-10 md:bg-[#fffdf9]">
            <section class="w-full max-w-[410px]" aria-label="Xác thực tài khoản">
              <slot />
            </section>
          </section>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
defineProps({
  bannerSrc: { type: String, required: true },
  bannerTitle: { type: String, required: true },
  bannerDescription: { type: String, required: true },
})
</script>
