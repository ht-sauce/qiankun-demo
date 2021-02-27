<template>
  <div class="guiji-layout">
    <!--顶部导航-->
    <TopNav class="top-nav" />
    <div class="right-conent">
      <!--侧边菜单导航-->
      <LeftNav class="left-nav" />
      <!--最终内容区域-->
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LeftNav from './LeftNav/index.vue'
import TopNav from './TopNav.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'GuijiLayout',
  components: {
    LeftNav,
    TopNav,
  },
})
</script>

<style scoped lang="scss">
.top-nav {
  width: 100%;
  height: 50px;
}
.right-conent {
  display: flex;
  .left-nav {
    width: 220px;
    flex: 1;
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
    width: calc(100% - 220px);
    min-height: calc(100vh - 50px);
  }
}
</style>
