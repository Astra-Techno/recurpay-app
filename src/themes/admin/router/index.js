import { createRouter, createWebHistory } from "vue-router"
import { useAppStore } from "@/stores/index"

import HomeView from "../views/index.vue"

const routes = [
  {
    path: "/",
    name: "login",
    component: HomeView
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
