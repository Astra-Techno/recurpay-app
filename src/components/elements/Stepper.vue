<!-- Stepper.vue -->
<template>
    <div class="flex overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600 shadow-sm">
      <template v-for="(step, index) in steps" :key="index">
        <div
          class="relative flex-1 flex items-center justify-center py-2 px-4 transition-colors duration-200"
          :class="{
            'bg-blue-600 text-white': currentStep === index,
            'bg-gray-200 text-gray-600': currentStep !== index
          }"
        >
          <span class="z-10 whitespace-nowrap">{{ index + 1 }}. {{ step }}</span>
  
          <!-- Right arrow shape -->
          <div
            v-if="index < steps.length - 1"
            class="absolute right-0 top-0 h-full w-4 overflow-hidden"
          >
            <div
              class="absolute left-0 top-0 h-full w-4 transform skew-x-[-30deg]"
              :class="{
                'bg-blue-600': currentStep === index,
                'bg-gray-200': currentStep !== index
              }"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    currentStep: Number,
    steps: Array
  })
  </script>
  