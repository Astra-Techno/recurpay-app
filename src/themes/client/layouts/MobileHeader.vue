<template>
  <div v-if="deviceStore.isMobile"
    class="sm:hidden flex justify-between items-center px-2 py-2 text-white sticky top-0 z-50 w-full">
    <!-- Left Section -->
    <div class="flex items-center space-x-2">
      <template v-if="isDashboard">
        <!-- Logo for Dashboard -->
        <Icon name="IconMinimal" class="cursor-pointer w-7 h-7" :fill="'#FFF'" />
        <span class="font-black text-lg italic text-base">MyProps</span>
      </template>

      <template v-else>
        <!-- Back Button and Title for Other Pages -->
        <button @click="goBack" class="focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span class=" text-xl font-semibold truncate">{{ title }}</span>
      </template>
    </div>

    <!-- Right Section (Profile Icon on Dashboard only) -->
    <div  class="flex items-center space-x-2">
      <User class="w-6 h-6" />
      <!-- Uncomment this if you want the logout icon too -->
      <LogOut class="w-6 h-6" />
    </div>
  </div>



</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../stores/useDeviceStore'
import { useCurrentTitle } from '@/composables/use-meta'
import { User, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const title = useCurrentTitle()

const isDashboard = computed(() => route.path === '/dashboard')

const goBack = () => {
  router.back()
}
</script>
