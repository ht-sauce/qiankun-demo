import { ComponentInternalInstance } from 'vue'
import vuex from '@/store'
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

ComponentInternalInstance.$store = typeof vuex
