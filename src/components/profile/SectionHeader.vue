// ProfileSection.vue
<template>
  <div v-if="expanded" class="bg-white rounded-xl p-4 shadow animate-fade-in space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-base font-bold text-gray-800">{{ title }}</h2>
      <button @click="onBack" class="text-xs text-blue-500">Back</button>
    </div>

    <slot />

    <div class="text-right">
      <button @click="onEdit" class="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
        Edit
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  expanded: Boolean
})
const emit = defineEmits(['back', 'edit'])
const onBack = () => emit('back')
const onEdit = () => emit('edit')
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
