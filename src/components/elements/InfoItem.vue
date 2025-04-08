<template>
  <div class="flex items-center justify-between bg-white rounded-xl p-4 shadow">
    <div class="flex items-center gap-3">
      <div class="relative bg-gray-100 p-2 rounded-lg">
        <Icon :icon="icon" class="w-5 h-5 text-gray-600" />
        <span
          v-if="showDot"
          class="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"
        ></span>
      </div>
      <div>
        <p class="text-sm text-gray-800 font-medium">{{ title }}</p>
        <p class="text-xs text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    <button
      v-if="buttonText"
      :class="[
        'text-sm font-semibold px-3 py-1 rounded-lg',
        buttonColor || 'text-blue-600 bg-blue-50',
      ]"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  subtitle: String,
  buttonText: String,
  buttonColor: String,
  showDot: Boolean,
})
</script>