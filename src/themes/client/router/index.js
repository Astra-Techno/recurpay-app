import { createRouter, createWebHistory } from "vue-router"
import { useAppStore } from "@/stores/index"

import HomeView from "../views/index.vue"
import Signal from '@/composables/signal'

const routes = [
  {
    path: "/",
    name: "login",
    component: HomeView
  },
  {
	path: '/logout',
	name: 'Logout',
	beforeEnter: (to, from, next) => {
		useAppStore().setUser(null);
		useAppStore().setToken(null);
		Signal.success('Logged out successfully')
		next('/') // Redirect to the login page
	},
  },
  {
    path: '/properties/:id',
    name: 'PropertyView',
    component: () => import('../views/property/index.vue'),
    props: true
  },
  {
    path: '/properties/:id',
    name: 'PropertyDetail',
    component: () => import('../views/property/Detail.vue'),
    props: true
  },
  {
    path: '/payment/add/:property_id',
    name: 'AddPayment',
    component: () => import('../views/payment/add.vue'),
    props: true
  },

  {
    path: '/tenants/',
    name: 'TenantsList',
    component: () => import('../views/Tenant/List.vue'),
    props: true
  },
  {
    path: '/tenants/:id',
    name: 'TenantDetail',
    component: () => import('../views/Tenant/Detail.vue'),
    props: true
  },
  {
    path: '/properties/:id/tenants',
    name: 'TenantsListByProperty',
    component: () => import('../views/Tenant/List.vue'),
    props: true
  },
  {
    path: '/properties/:property_id/add-tenant',
    name: 'AddTenant',
    component: () => import('../views/Tenant/add.vue'),
    props: true
  },

  {
    path: "/:pageName(.*)",
    name: "page",
    component: HomeView
  },
]

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

router.beforeEach((to, from, next) => {
  const store = useAppStore()
  if (to?.query?.fullview == '1')
    store.toggleFullView(1);
  else
    store.setMainLayout("app")

  /*if (to?.meta?.layout == "auth") {
    store.setMainLayout("auth")
  } else {
    store.setMainLayout("app")
  }*/

  next(true)
})

router.afterEach((to, from, next) => {
  const store = useAppStore()
  store.toggleComponent(false);
})
export default router
