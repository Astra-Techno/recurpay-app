<template>
  <div class="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 relative">
    <!-- Desktop Sidebar (hidden on mobile) -->
    <DesktopSidebar 
      v-if="!deviceStore.isMobile" 
      :is-mini="isMiniSidebar"
      @toggle-mini="toggleMiniSidebar"
    />

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1" :class="{ 'md:ml-64': !deviceStore.isMobile && !isMiniSidebar, 'md:ml-16': !deviceStore.isMobile && isMiniSidebar }">
      
      <!-- Top Navigation Bar -->
      <NavigationBar>
        <template #flex-items>
          <MobileHeader v-if="deviceStore.isMobile" />
          <DesktopHeader v-else />
        </template>
      </NavigationBar>

      <!-- Scrollable Content -->
      <transition name="fade-slide" mode="out-in">
        <div
          key="route-{{ $route.fullPath }}"
          class="scroll-container flex-1 overflow-y-auto"
          :class="[
            deviceStore.isMobile 
              ? 'px-4 pb-24' 
              : 'px-6 py-4',
            isDashboard && deviceStore.isMobile 
              ? 'mt-0 bg-white' 
              : 'bg-white rounded-t-2xl shadow-sm mx-2 mt-2'
          ]"
        >
          <NotificationPanel v-if="store.showPanel" />
          <template v-else>
            <slot />
          </template>
        </div>
      </transition>

      <!-- Fixed Bottom Navigation (Mobile Only) -->
      <transition name="blur-nav">
        <div v-if="deviceStore.isMobile" class="fixed bottom-0 left-0 right-0 w-full flex justify-center z-50">
          <BottomNav />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, computed, nextTick } from 'vue'
import { useAppStore } from '@/stores/index'
import { useExtendedStore } from '../stores/extendedStore'
import { storeToRefs } from 'pinia'
import { useUIPreferencesStore } from '../stores/uiPreferences'
import { useDeviceStore } from '../stores/useDeviceStore'
import NavigationBar from '../layouts/NavigationBar.vue'
import BottomNav from '../layouts/BottomNav.vue'
import DesktopSidebar from '../layouts/DesktopSidebar.vue'
import DesktopHeader from '../layouts/DesktopHeader.vue'
import { useRoute } from 'vue-router'
import { useCurrentTitle } from '@/composables/use-meta'
import MobileHeader from '../layouts/MobileHeader.vue'
import { useNotificationStore } from '@/stores/notifications'
import NotificationPanel from '@/components/elements/Notifications.vue'

const store = useNotificationStore()
const route = useRoute()
const appStore = useAppStore()
const extendedStore = useExtendedStore()
const { user } = storeToRefs(extendedStore)
const prefStore = useUIPreferencesStore()
const isMiniSidebar = ref(prefStore.isMiniSidebar)
const deviceStore = useDeviceStore()
const isDashboard = computed(() => route.path === '/dashboard')

const toggleMiniSidebar = () => {
  isMiniSidebar.value = !isMiniSidebar.value
  prefStore.toggleMiniSidebar()
}

onMounted(() => {
  appStore.toggleMainLoader()
})

// Close notification panel on route change
watch(() => route.fullPath, () => {
  if (store.showPanel) {
    store.showPanel = false
  }

  // Scroll to top on route change
  nextTick(() => {
    const container = document.querySelector('.scroll-container')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
})
</script>

<style scoped>
/* Smooth page transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* BottomNav transition */
.blur-nav-enter-active,
.blur-nav-leave-active {
  transition: opacity 0.3s ease;
}
.blur-nav-enter-from,
.blur-nav-leave-to {
  opacity: 0;
}

/* Hide default scrollbar */
.scroll-container {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scroll-container::-webkit-scrollbar {
  display: none;
}
</style>
