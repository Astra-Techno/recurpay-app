<template>
  <div class="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-50 transition">
    <div class="flex items-center gap-3">
      <span class="text-xl">{{ icon }}</span>
      <div class="leading-tight">
        <p class="text-sm font-semibold text-gray-800">{{ label }}</p>
        <p v-if="sub" class="text-xs text-gray-500">{{ sub }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span
        v-if="actionLabel"
        class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full"
      >
        {{ actionLabel }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  sub: String,
  actionLabel: String,
})
</script>
