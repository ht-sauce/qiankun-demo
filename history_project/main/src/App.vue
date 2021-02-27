<template>
  <div>主应用框架</div>
  <button @click="jumppage('/dm')">进入物料管理平台</button>
  <button @click="jumppage('/samescreen')">进入物料产品平台</button>
  <div id="samescreen"></div>
  <!--<router-view></router-view>-->
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import {
  initGlobalState,
  MicroAppStateActions,
  registerMicroApps,
  start,
  addGlobalUncaughtErrorHandler,
} from 'qiankun'
export default defineComponent({
  setup(props, ctx) {
    /*addGlobalUncaughtErrorHandler((event) => {
      console.log(1111, event)
    })*/

    let state = {
      a: 111,
    }
    // 初始化 state
    const actions: MicroAppStateActions = initGlobalState(state)
    actions.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      //console.log(state, prev)
    })
    actions.setGlobalState(state)
    actions.offGlobalStateChange()

    const production = process.env.NODE_ENV === 'production'

    const config = [
      {
        name: 'samescreen',
        entry: production ? '/samescreen' : '//localhost:8001/samescreen',
        container: '#samescreen',
        activeRule: '/samescreen',
      },
      {
        name: 'dm',
        entry: production ? '/dm' : '//localhost:8002/dm',
        container: '#samescreen',
        activeRule: '/dm',
      },
    ]
    console.log(config)
    registerMicroApps(config)

    onMounted(() => {
      // 启动 qiankun
      start()
    })

    function jumppage(url: string) {
      window.location.href = url
    }
    return {
      jumppage,
    }
  },
})
</script>
<style lang="scss"></style>
