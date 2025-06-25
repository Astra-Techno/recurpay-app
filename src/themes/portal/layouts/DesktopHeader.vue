<template>
  <div class="flex items-center justify-between w-full px-6 py-4">
    <!-- Page Title & Breadcrumb -->
    <div class="flex items-center space-x-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-500 mt-0.5">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">
      <!-- Search (if needed) -->
      <div class="relative hidden md:block">
        <input
          type="text"
          placeholder="Search..."
          class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Icon name="Search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="16" />
      </div>

      <!-- Notifications -->
      <button 
        @click="togglePanel" 
        class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Icon name="Bell" :size="20" />
        <span 
          v-if="store.unreadCount" 
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
        >
          {{ store.unreadCount }}
        </span>
      </button>

      <!-- User Menu -->
      <div class="relative" ref="userMenuRef">
        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img 
            :src="user?.avatar || avatarFallback" 
            alt="Profile" 
            class="w-8 h-8 rounded-full border border-gray-200"
          />
          <Icon name="ChevronDown" :size="16" class="text-gray-500" />
        </button>

        <!-- User Dropdown -->
        <transition name="dropdown-fade">
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ user?.name || 'User' }}</p>
              <p class="text-xs text-gray-500">{{ user?.email }}</p>
            </div>
            
            <router-link 
              to="/profile" 
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="closeUserMenu"
            >
              <Icon name="User" :size="16" class="mr-3" />
              Profile
            </router-link>
            
            <router-link 
              to="/settings" 
              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="closeUserMenu"
            >
              <Icon name="Settings" :size="16" class="mr-3" />
              Settings
            </router-link>
            
            <hr class="my-2 border-gray-100" />
            
            <button 
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Icon name="LogOut" :size="16" class="mr-3" />
              Sign Out
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import avatarFallback from '@/assets/images/avatar.png'
import Signal from '@/composables/signal'

const router = useRouter()
const store = useNotificationStore()
const extendedStore = useExtendedStore()
const { user } = storeToRefs(extendedStore)

const { title, subtitle } = inject('headerState')
const showUserMenu = ref(false)
const userMenuRef = ref(null)

const togglePanel = () => {
  store.togglePanel()
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  const result = await Signal.confirm(
    'Sign Out',
    'Are you sure you want to sign out?',
    'Sign Out'
  )
  
  if (result.isConfirmed) {
    closeUserMenu()
    extendedStore.logout()
    Signal.success('Signed out successfully')
    router.push('/')
  }
}

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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