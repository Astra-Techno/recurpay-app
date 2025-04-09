<template>
    <div class="flex w-full text-white font-black italic">
      <template v-for="step in steps" :key="step.number">
        <!-- Step -->
        <div
          class="relative flex-1"
          :class="{
            'text-white': step.number <= currentStep,
            'text-gray-500': step.number > currentStep,
          }"
        >
          <!-- Step Label -->
          <div
            class="px-6 py-3 text-center"
            :class="[
              step.number === 1 ? 'rounded-l-full' : '',
              step.number === steps.length ? 'rounded-r-full' : '',
              step.number < currentStep
                ? 'bg-[var(--ui-background)]'
                : step.number === currentStep
                ? 'bg-[var(--ui-background)] font-bold'
                : 'bg-gray-200',
            ]"
          >
            {{ step.number }}. {{ step.label }}
          </div>
  
          <!-- Right arrow -->
          <div
            v-if="step.number !== steps.length"
            class="absolute top-0 right-0 w-4 h-full"
            :class="step.number <= currentStep ? 'bg-[var(--ui-background)]' : 'bg-gray-200'"
            style="clip-path: polygon(0 0, 100% 50%, 0 100%)"
          ></div>
  
          <!-- Left arrow (overlap fix) -->
          <div
            v-if="step.number !== 1"
            class="absolute top-0 left-0 w-4 h-full bg-white"
            style="clip-path: polygon(0 0, 100% 50%, 0 100%)"
          ></div>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    currentStep: {
      type: Number,
      default: 1,
    },
    steps: {
      type: Array,
      default: () => [
        { number: 1, label: 'Step 1' },
        { number: 2, label: 'Step 2' },
        { number: 3, label: 'Step 3' },
      ],
    },
  });
  </script>
  