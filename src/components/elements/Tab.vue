<template>
  <div class="w-full pt-4">
    <div class="flex border-b">
      <span
        v-for="(tab, index) in tabs"
        :key="index"
        @click="activeTab = index"
        class="relative px-4 py-2 text-md cursor-pointer transition-all duration-300 ease-in-out"
        :class="{
          'text-green-600': activeTab === index,
          'transform scale-105': activeTab === index,  // Optional: Slight scaling effect on active tab
        }"
      >
        {{ tab.label }}
        <div
          v-if="activeTab === index"
          class="absolute bottom-0 left-0 w-full h-1 bg-green-600 transition-all duration-300 ease-in-out"
        ></div>
      </span>
    </div>
    <div class="p-4 rounded-b-lg flex justify-center items-center min-h-[300px]">
      <transition name="fade" mode="out-in">
        <component :is="tabs[activeTab].component" :key="activeTab"></component>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  tabs: Array
});

const activeTab = ref(0);
</script>

<style scoped>
/* Tab content fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
