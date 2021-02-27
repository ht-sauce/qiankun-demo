import Vue from 'vue'
import Router from 'vue-router'
import storage from '@/api/storage.js'

import Login from '@/views/login/Login'
import Home from '@/views/Home'
import OverView from '@/views/data/OverView'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/mainFrameMicroservice/samescreen',
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/data/overview',
          component: OverView,
        },
        {
          path: '/product/management',
          component: () => import('@/views/product/management'),
        },
        {
          path: '/system/organization',
          component: () => import('@/views/system/organization'),
        },
        {
          path: '/system/account',
          component: () => import('@/views/system/account'),
        },
        {
          path: '/statistics/product',
          component: () => import('@/views/statistics/product'),
        },
        {
          path: '/statistics/productDetail/:prodId/:username',
          component: () => import('@/views/statistics/product/productDetail.vue'),
        },
        {
          path: '/material-management',
          component: () => import('@/views/Materiel/index.vue'),
        },
      ],
    },
  ],
})

// //路由白名单
// const WhiteList = ['/login']
// //权限校验
// router.beforeEach((to, from, next) => {
//   let p = storage.getPermission()
//   if (WhiteList.indexOf(to.fullPath) != -1) {
//     next()
//   } else if (!storage.getCorpId()) {
//     next('/login')
//   } else if (p && p.menu.length > 0 && p.menu.find(item => to.fullPath.startsWith(item)) == null) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
