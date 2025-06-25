import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores'
import routes from './routes'
import Signal from '@/composables/signal'

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: "active",
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  const isAuthenticated = appStore.user.token !== null
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    Signal.error('Please login to access this page')
    next('/')
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
