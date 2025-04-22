<template>
  <div class="w-full">
    <!-- Sticky Header -->
    <div
      v-if="deviceStore.isMobile || deviceStore.isTablet || deviceStore.isLandscape"
      :class="[!deviceStore.isMobile ? 'overflow-y-auto' : '']"
      class="flex justify-between items-center px-2 py-2 text-white sticky top-0 z-50 w-full "
    >
      <!-- Left Section -->
      <div class="flex items-center space-x-2">
        <template v-if="isDashboard">
          <Icon name="IconMinimal" class="cursor-pointer w-7 h-7" :fill="'#FFF'" />
          <span class="font-black text-lg italic text-base">MyProps</span>
        </template>
        <template v-else>
          <button @click="goBack" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button> 
          <Icon name="IconMinimal" class="cursor-pointer w-7 h-7" :fill="'#FFF'" />
          <span class="font-black text-lg italic text-base">MyProps</span>
                  
        </template>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-2">
        <User class="w-6 h-6" />
        <RouterLink :to="`/logout`">
          <LogOut class="w-6 h-6" />
        </RouterLink>
      </div>
    </div>

    <!-- Second Section (Full width ensured) -->
    <div v-if="!isDashboard" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 pt-2 pb-12">
      <h1 class="font-bold text-white">{{title}}</h1>
      <p class="text-sm mt-1">{{subtitle}}</p>
    </div>
  </div>
</template>


<script setup>
import { inject,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../stores/useDeviceStore'
import { useCurrentTitle } from '@/composables/use-meta'
import { User, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

const { title, subtitle, icon } = inject('headerState')
const isDashboard = computed(() => route.path === '/dashboard')

const goBack = () => {
  router.back()
}

</script>
