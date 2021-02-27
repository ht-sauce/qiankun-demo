import vuex from '@/store'
import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const baseConfig = require('../../config/config.js')

const { publicPath } = baseConfig

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: '/login',
    component: () => import('@/pages/Login/index.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: '/',
    component: () => import('@/pages/Home/Manage.vue'), // home里面存放所有全局布局的组件
    children: [],
  },
]

const router = createRouter({
  history: createWebHashHistory(publicPath),
  routes,
})
router.beforeEach((to, form, next) => {
  document.title = (to.meta.title ? to.meta.title : '主框架') as string
  if (vuex.state.user.info) {
    if (to.name === '/login')
      next({
        name: '/',
      })
    else next()
  } else {
    if (to.name === '/login') next()
    else
      next({
        name: '/login',
      })
  }
})

export default router
