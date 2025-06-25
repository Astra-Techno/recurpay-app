<template>
  <div 
    class="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-40 transition-all duration-300"
    :class="[isMini ? 'w-16' : 'w-64']"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-between p-4 border-b border-gray-100">
      <div v-if="!isMini" class="flex items-center space-x-3">
        <img src="@/assets/images/logo.png" alt="RecurPay" class="w-8 h-8 rounded-lg" />
        <span class="text-lg font-semibold text-gray-800">RecurPay</span>
      </div>
      <img v-else src="@/assets/images/logo.png" alt="RecurPay" class="w-8 h-8 rounded-lg mx-auto" />
      
      <button 
        @click="$emit('toggle-mini')"
        class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Icon :name="isMini ? 'ChevronRight' : 'ChevronLeft'" :size="16" />
      </button>
    </div>

    <!-- User Profile Section -->
    <div v-if="user" class="p-4 border-b border-gray-100">
      <div class="flex items-center" :class="{ 'justify-center': isMini }">
        <img 
          :src="user?.avatar || avatarFallback" 
          alt="Profile" 
          class="w-10 h-10 rounded-full border-2 border-gray-200"
        />
        <div v-if="!isMini" class="ml-3 flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name || 'User' }}</p>
          <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 p-4 space-y-2">
      <template v-for="item in navigationItems" :key="item.path">
        <router-link
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item-mini': isMini, 'nav-item-active': isActive(item.path) }"
        >
          <Icon :name="item.icon" :size="20" />
          <span v-if="!isMini" class="ml-3">{{ item.label }}</span>
          
          <!-- Tooltip for mini mode -->
          <div v-if="isMini" class="nav-tooltip">
            {{ item.label }}
          </div>
        </router-link>
      </template>
    </nav>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-gray-100">
      <router-link
        to="/settings"
        class="nav-item"
        :class="{ 'nav-item-mini': isMini }"
      >
        <Icon name="Settings" :size="20" />
        <span v-if="!isMini" class="ml-3">Settings</span>
        <div v-if="isMini" class="nav-tooltip">Settings</div>
      </router-link>
      
      <button
        @click="handleLogout"
        class="nav-item w-full text-left mt-2 text-red-600 hover:bg-red-50"
        :class="{ 'nav-item-mini': isMini }"
      >
        <Icon name="LogOut" :size="20" />
        <span v-if="!isMini" class="ml-3">Logout</span>
        <div v-if="isMini" class="nav-tooltip">Logout</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import avatarFallback from '@/assets/images/avatar.png'
import Signal from '@/composables/signal'

const props = defineProps({
  isMini: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-mini'])

const route = useRoute()
const router = useRouter()
const extendedStore = useExtendedStore()
const { user } = storeToRefs(extendedStore)

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'Home' },
  { path: '/services', label: 'Services', icon: 'Grid3X3' },
  { path: '/payments', label: 'Payments', icon: 'CreditCard' },
  { path: '/transactions', label: 'Transactions', icon: 'Receipt' },
  { path: '/explore', label: 'Explore', icon: 'Search' },
  { path: '/profile', label: 'Profile', icon: 'User' },
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  const result = await Signal.confirm(
    'Sign Out',
    'Are you sure you want to sign out?',
    'Sign Out'
  )
  
  if (result.isConfirmed) {
    extendedStore.logout()
    Signal.success('Signed out successfully')
    router.push('/')
  }
}
</script>

<style scoped>
.nav-item {
  @apply flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200;
  @apply text-gray-700 hover:bg-gray-100 hover:text-gray-900;
}

.nav-item-mini {
  @apply justify-center px-2 relative;
}

.nav-item-active {
  @apply bg-blue-50 text-blue-700 border border-blue-200;
}

.nav-tooltip {
  @apply absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded;
  @apply opacity-0 pointer-events-none transition-opacity duration-200;
  @apply whitespace-nowrap z-50;
}

.nav-item-mini:hover .nav-tooltip {
  @apply opacity-100;
}
</style>