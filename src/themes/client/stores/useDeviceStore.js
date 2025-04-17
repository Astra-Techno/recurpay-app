// stores/useDeviceStore.js or .ts
import { ref, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isLandscape = ref(false)

  const checkDevice = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const minDimension = Math.min(width, height)

    isMobile.value = isTouch && minDimension <= 768
    isTablet.value = isTouch && minDimension > 768 && minDimension <= 1024
    isDesktop.value = !isTouch || minDimension > 1024
    isLandscape.value = width > height
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
    window.removeEventListener('orientationchange', checkDevice)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLandscape
  }
})
