<template>
  <div class="flex flex-col h-screen w-full md:w-[390px] md:mx-auto bg-white dark:bg-gray-900 relative">
    <!-- Navigation Bar -->
    <NavigationBar>
      <template #flex-items>
        <MobileHeader />
      </template>
    </NavigationBar>

    <!-- Scrollable Content -->
    <transition name="fade-slide" mode="out-in">
      <div
        key="route-{{ $route.fullPath }}"
        class="scroll-container flex-1 overflow-y-scroll hide-scrollbar px-2 pb-24 w-[92%] mx-auto transition-all duration-300 ease-out"
        :class="[isDashboard ? 'mt-0 bg-white' : 'z-20 bg-white rounded-t-2xl shadow-xl']"
      >
        <NotificationPanel v-if="store.showPanel" />
        <template v-else>
          <slot />
        </template>
      </div>
    </transition>

    <!-- Fixed Bottom Navigation -->
    <transition name="blur-nav">
      <div v-if="deviceStore.isMobile" class="fixed bottom-0 left-0 right-0 w-full flex justify-center z-50">
        <BottomNav />
      </div>
    </transition>
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
const drawerOpen = ref(false)
const showBackButton = computed(() => route.path !== "/dashboard")

const title = useCurrentTitle()
const deviceStore = useDeviceStore()
const isDashboard = computed(() => route.path === '/dashboard')
const currentAccount = ref(extendedStore.currentAccount)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleMiniSidebar = () => {
  isMiniSidebar.value = !isMiniSidebar.value
  prefStore.toggleMiniSidebar()
}

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  appStore.toggleMainLoader()
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
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

watch(() => deviceStore.isMobile, (newValue) => {
  if (!newValue) drawerOpen.value = false
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
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
