<template>
  <div class="space-y-4 animate-pulse" :class="wrapperClass">
    <div v-for="n in count" :key="n" class="bg-white p-4 rounded-xl shadow">
      <div class="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-2/4"></div>
      </div>
      <div class="flex gap-2 mt-3">
        <div class="h-6 w-20 bg-gray-300 rounded-full"></div>
        <div class="h-6 w-24 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  count: { type: Number, default: 2 },
  wrapperClass: { type: String, default: '' },
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
