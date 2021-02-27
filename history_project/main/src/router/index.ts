import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import(),
  // },
]

const router = createRouter({
  history: createWebHistory('/main'),
  routes,
})

export default router
