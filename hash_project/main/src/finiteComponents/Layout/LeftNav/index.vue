<template>
  <el-menu :default-active="defaultActive" background-color="#409eff" text-color="#fff">
    <template v-for="(item, index) in menu" :key="index">
      <SubMenu :submenu="item" :index="index.toString()" />
    </template>
  </el-menu>
</template>

<script lang="ts">
import SubMenu from './SubMenu.vue'
import mockMenu from '../mock'
import Store from './store'
import { ElMenu } from 'element-plus'
import { defineComponent } from 'vue'
export default defineComponent({
  components: {
    SubMenu,
    ElMenu,
  },
  computed: {
    defaultActive() {
      return Store.store.defaultActive
    },
  },
  data() {
    return {
      menu: mockMenu,
    }
  },
  methods: {},
})
</script>
