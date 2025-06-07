<template>
  <div class="w-full relative">
    <!-- Overlay for dropdown -->


    <!-- Global Sticky Header for All Pages -->
    <div v-if="deviceStore.isMobile || deviceStore.isTablet || deviceStore.isLandscape"
      class="flex justify-between items-center px-4 py-1 sticky top-0 z-50 w-full backdrop-blur-md bg-white/90  border-gray-200">

      <!-- Left Section -->
      <div class="flex items-center space-x-2 relative">
        <button v-if="!isDashboard" @click="goBack" class="focus:outline-none">

         <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>-->
          <ArrowLeft/>
        </button>

        <div class="relative user-avatar z-50" v-if="isDashboard">
          <img :src="user?.avatar || avatarFallback" @click="toggleUserMenu"
            class="w-10 h-10 rounded-full  cursor-pointer" alt="Avatar" />

          <transition name="dropdown-fade">
            <div v-if="showUserMenu"
              class="absolute left-0 mt-2 w-36 hidden bg-white rounded-lg shadow-md py-2 border text-sm z-50">
              <!-- Arrow -->
              <div class="absolute -top-2 left-4 w-3 h-3 rotate-45 bg-white border-l border-t border-gray-200"></div>

              <RouterLink to="/profile" class="block px-4 py-2 hover:bg-gray-100" @click="closeUserMenu">Profile
              </RouterLink>
              <RouterLink to="/settings" class="block px-4 py-2 hover:bg-gray-100" @click="closeUserMenu">Settings
              </RouterLink>
              <RouterLink to="/logout" class="block px-4 py-2 hover:bg-gray-100 text-red-500" @click="closeUserMenu">
                Logout</RouterLink>
            </div>
          </transition>
        </div>


      </div>
      <div class="flex items-center leading-tight" v-if="isDashboard">
        <h1 class="text-lg font-semibold">Hello, Alex 👋</h1>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <button @click="togglePanel" class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="store.unreadCount"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {{ store.unreadCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Optional Banner Section Below Header -->
    <div v-if="!isDashboard" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 pt-2 pb-4">
      <h1 class="font-bold text-white text-lg">{{ title }}</h1>
      <p class="text-sm mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../stores/useDeviceStore'
import { useNotificationStore } from '@/stores/notifications'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import avatarFallback from '@/assets/images/avatar.png'
import {
 ArrowLeft 
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const store = useNotificationStore()
const extendedStore = useExtendedStore()
const { user } = storeToRefs(extendedStore)

const { title, subtitle } = inject('headerState')
const isDashboard = computed(() => route.path === '/dashboard')

const goBack = () => {
  router.back()
}

const togglePanel = () => {
  store.togglePanel()
}

const showUserMenu = ref(false)
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}
const closeUserMenu = () => {
  showUserMenu.value = false
}
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}
</style>
