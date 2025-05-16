<template>
  <div class="w-full">
    <!-- Sticky Header -->
    <div v-if="deviceStore.isMobile || deviceStore.isTablet || deviceStore.isLandscape"
      :class="[!deviceStore.isMobile ? 'overflow-y-auto' : '']"
      class="flex justify-between items-center px-2 py-2 text-white sticky top-0 z-50 w-full ">
      <!-- Left Section -->
      <div class="flex items-center space-x-2">
        <template v-if="isDashboard">
          <Icon name="IconMinimal" class="cursor-pointer w-7 h-7" :fill="'#FFF'" />
          <span class="font-black text-lg italic text-base">MyProps</span>
        </template>
        <template v-else>
          <button @click="goBack" class="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Icon name="IconMinimal" class="cursor-pointer w-7 h-7" :fill="'#FFF'" />
          <span class="font-black text-lg italic text-base">MyProps</span>

        </template>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-2">
        <button @click="store.togglePanel" class="relative p-2 bg-transparent focus:outline-none hover:!bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="store.unreadCount"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            {{ store.unreadCount }}
          </span>
        </button>
        <RouterLink :to="`/settings`">
          <User class="w-6 h-6" />
        </RouterLink>
        <RouterLink :to="`/logout`">
          <LogOut class="w-6 h-6" />
        </RouterLink>
      </div>
    </div>

    <!-- Second Section (Full width ensured) -->
    <div v-if="!isDashboard" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 pt-2 pb-4">
      <h1 class="font-bold text-white">{{ title }}</h1>
      <p class="text-sm mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>


<script setup>
import { inject, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../stores/useDeviceStore'
import { User, LogOut } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
import { useNotificationStore } from '@/stores/notifications'

const store = useNotificationStore()
const { title, subtitle, icon } = inject('headerState')
const isDashboard = computed(() => route.path === '/dashboard')

const goBack = () => {
  router.back()
}

</script>
