<!--递归实现多级数据-->
<template>
  <template v-if="submenu?.child < 1">
    <el-menu-item :index="index" @click="openUrl(submenu)">
      <i :class="submenu.icon" class="guiji-menu-icon"></i>
      <template #title>
        <span>{{ submenu.title }}</span>
      </template>
    </el-menu-item>
  </template>
  <template v-else>
    <el-submenu :index="index" @click="openUrl(submenu)">
      <template #title>
        <i :class="submenu.icon" class="guiji-menu-icon"></i>
        <span>{{ submenu.title }}</span>
      </template>
      <template v-for="(item, id) in submenu.child" :key="id">
        <!--递归自身-->
        <SubMenu :submenu="item" :index="index + '-' + id" />
      </template>
    </el-submenu>
  </template>
</template>

<script lang="ts">
import { watch, defineComponent, PropType } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Store from './store'
import { ElMenuItem, ElSubmenu } from 'element-plus'
import { MenuItemType } from '../LayoutType'
export default defineComponent({
  components: { ElMenuItem, ElSubmenu },
  props: {
    submenu: {
      type: Object as PropType<MenuItemType>,
      default: () => {
        return {}
      },
    },
    index: String,
  },
  name: 'SubMenu',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    watch(
      () => props.index,
      (e) => {
        const submenu = props.submenu as MenuItemType
        if (route.fullPath === submenu.url) {
          Store.store.defaultActive = e as string
        }
      },
      {
        immediate: true,
      },
    )

    function openUrl(submenu: MenuItemType) {
      if (submenu?.url) {
        // 哈希模式
        router.push({ path: submenu.url })
        // history.pushState('', '', submenu.url)
      }
    }

    return {
      openUrl,
    }
  },
})
</script>

<style scoped lang="scss">
.el-menu-item {
  height: 56px;
  font-size: 14px;
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  box-sizing: border-box;
  white-space: nowrap;
  color: var(--white);
  line-height: 56px;
}
.guiji-menu-icon {
  color: var(--white);
  margin-top: -2px;
}
.el-icon-location {
  vertical-align: baseline;
  color: var(--white) !important;
}
.el-menu-item.is-active {
  background-color: var(--primary-5) !important;
  color: var(--white);
}
</style>
