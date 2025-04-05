<template>
  <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
      <div class="p-3 rounded-full" :class="color">
        <component :is="icon" class="h-6 w-6" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  color: String
})
</script>