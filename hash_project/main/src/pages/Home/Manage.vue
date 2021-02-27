<template>
  <!--管理端全局页面-->
  <guiji-layout>
    <router-view />
    <!--微前端展示内容-->
    <div id="app-qiankun"></div>
  </guiji-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import GuijiLayout from '@/finiteComponents/Layout/index.vue'
import startQiankun from '@/qiankun'
export default defineComponent({
  components: { GuijiLayout },
  setup() {
    onMounted(() => {
      startQiankun()
    })
  },
})
</script>

<style scoped lang="scss">
#app-qiankun {
  position: relative;
}
</style>
