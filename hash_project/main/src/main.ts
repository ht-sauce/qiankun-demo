import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import components from '@/components' // 组件库导入
import '@/theme/index.scss' // 主题样式导入

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store
    $ELEMENT: {
      size: string
      zIndex: number
    }
  }
}

const app = createApp(App)
// 组件库注册
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 2000 }
components(app) // 全局组件注册
app.config.globalProperties.$store = store

app.use(router)
app.use(store)
app.mount('#main-frame-microservice')
