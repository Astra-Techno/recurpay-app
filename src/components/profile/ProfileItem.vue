<!-- components/profile/ProfileItem.vue -->
<template>
  <div class="bg-white px-4 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer" @click="$emit('click')">
    <div class="flex items-center gap-3">
      <span class="text-xl">{{ icon }}</span>
      <div>
        <p class="text-sm font-semibold text-gray-800">{{ label }}</p>
        <p class="text-xs text-gray-500">{{ sub }}</p>
      </div>
    </div>
    <div v-if="actionLabel" class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
      {{ actionLabel }}
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  sub: String,
  actionLabel: String
})
</script>
