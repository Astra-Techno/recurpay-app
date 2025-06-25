const routes = [
  {
    path: "/",
    name: "login",
    component: () => import('../views/login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: "/register",
    name: "register", 
    component: () => import('../views/register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import('../views/forgot-password.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import('../views/dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/services",
    name: "services",
    component: () => import('../views/services.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/payments",
    name: "payments",
    component: () => import('../views/payments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/payment/:id",
    name: "payment-details",
    component: () => import('../views/payment-details.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/send-money",
    name: "send-money",
    component: () => import('../views/send-money.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/pay-bills",
    name: "pay-bills",
    component: () => import('../views/pay-bills.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/scan-qr",
    name: "scan-qr",
    component: () => import('../views/scan-qr.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import('../views/explore.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import('../views/profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import('../views/settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      const { useAppStore } = require('@/stores')
      const { useExtendedStore } = require('../stores/extendedStore')
      
      const appStore = useAppStore()
      const extendedStore = useExtendedStore()
      
      // Clear all authentication data
      appStore.setUser(null)
      appStore.setToken(null)
      extendedStore.logout()
      
      // Clear localStorage
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('currentAccount')
      
      Signal.success('Logged out successfully')
      next('/') // Redirect to login
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import('../views/404.vue')
  }
]

export default routes