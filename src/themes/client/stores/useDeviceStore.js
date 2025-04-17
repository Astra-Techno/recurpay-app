import { ref, onMounted, onUnmounted } from 'vue'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', () => {
  const isMobile = ref(false)

  const checkIsMobile = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Detect mobile or small tablet in both orientations
    isMobile.value = isTouch && Math.min(width, height) <= 768
  }

  onMounted(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    window.addEventListener('orientationchange', checkIsMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkIsMobile)
    window.removeEventListener('orientationchange', checkIsMobile)
  })

  return { isMobile }
})
