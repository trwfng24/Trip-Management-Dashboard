<template>
  <nav aria-label="Điều hướng vị trí">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-[#52717a]">
      <li v-for="(item, index) in items" :key="item.label" class="flex items-center gap-2">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="font-semibold text-[#166c74] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8c47c]"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else :aria-current="isLastItem(index) ? 'page' : undefined">
          {{ item.label }}
        </span>
        <span v-if="!isLastItem(index)" aria-hidden="true" class="text-[#82949a]">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

function isLastItem(index) {
  return index === props.items.length - 1
}
</script>
