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
    path: '/properties/list/:mode?',
    name: 'PropertiesList',
    component: () => import('../views/property/list.vue'),
    props: true
  },
  {
    path: '/properties/add/',
    name: 'AddProperty',
    component: () => import('../views/property/add/index.vue'),
    props: true
  },
  {
    path: '/properties/edit/:id',
    name: 'editProperty',
    component: () => import('../views/property/edit.vue'),
    props: true
  },
  {
    path: '/properties/photos/:id',
    name: 'PropertyPhotos',
    component: () => import('../views/property/photo.vue'),
    props: true
  },
  {
    path: '/payment/add/:property_id',
    name: 'AddPayment',
    component: () => import('../views/payment/add.vue'),
    props: true
  },
  {
    path: '/payments/:property_id?/:status?',
    name: 'PaymentsList',
    component: () => import('../views/payment/list.vue'),
    props: true
  },
  {
    path: '/payment/:id',
    name: 'PaymentDetail',
    component: () => import('../views/payment/view.vue'),
    props: true
  },
  {
    path: '/transactions/:property_id?/:status?',
    name: 'Transactions',
    component: () => import('../views/Transaction/List.vue'),
    props: true
  },
  {
    path: '/transaction/:id',
    name: 'TransactionDetail',
    component: () => import('../views/Transaction/index.vue'),
    props: true
  },
  {
    path: '/tenants/',
    name: 'TenantsList',
    component: () => import('../views/tenant/List.vue'),
    props: true
  },
  {
    path: '/tenants/:id',
    name: 'TenantDetail',
    component: () => import('../views/tenant/Detail.vue'),
    props: true
  },
  {
    path: '/properties/:id/tenants',
    name: 'TenantsListByProperty',
    component: () => import('../views/tenant/List.vue'),
    props: true
  },
  {
    path: '/properties/:property_id/add-tenant',
    name: 'AddTenant',
    component: () => import('../views/tenant/add.vue'),
    props: true
  },
  {
    path: '/payment/:payment_id/send-reminder',
    name: 'SendReminder',   
    component: () => import('../views/Payment/reminder.vue'),
    props: true
  },
  {
    path: '/settings',
    name: 'Profile',   
    component: () => import('../views/user/profile.vue'),
    props: true
  },
  {
    path: '/settings',
    name: 'EditProfile',   
    component: () => import('../views/user/profile.vue'),
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

/*
// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
	const appStore = useAppStore()
	// Redirect logged-in users from the login page to the dashboard
	if (to.meta.guest && appStore.user.token) {
		next('/dashboard')
	} else if (
		(to.meta.requiresAuth || !to.meta.guest) &&
		!appStore.user.token
	) {
		// If the route requires authentication and the user is not logged in
		next({ name: 'Login', query: { redirect: to.fullPath } }) // Redirect to the login page
	} else {
		next() // Proceed to the route
	}
})
*/

router.beforeEach((to, from, next) => {
  const store = useAppStore()
  if (to?.query?.fullview == '1')
    store.toggleFullView(1);
  else
    store.setMainLayout("app")

  if (to?.name != 'page' && !to?.meta?.guestView && !store.user.token) {
    next('/login') // Redirect to the login page
  }

  next(true)
})

router.afterEach((to, from, next) => {
  const store = useAppStore()
  store.toggleComponent(false);
})
export default router
