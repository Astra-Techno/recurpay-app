<!-- Loader.vue -->
<template>
  <div class="loader-container z-[19]" v-if="finalLoading">
    <div class="loader-background"></div>
    <div class="loader">
      <img src="/assets/images/loader.gif"/>
    </div>
  </div>
</template>

<script setup>
import { isLoading } from '@/composables/axios';
import { computed } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: null // Use null to detect when it's explicitly set
  }
});

// Determine which loading state to use
const finalLoading = computed(() => props.loading !== null ? props.loading : isLoading);
</script>


<style scoped>
.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(2px); /* Adjust the blur amount as needed */
  background-color: rgba(255, 255, 255, 0); /* Adjust the background color and opacity */
}

.loader {
  position: relative;
}

.loader-inner {
  width: 30px;
  height: 30px;
  border: 4px solid #ccc;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
