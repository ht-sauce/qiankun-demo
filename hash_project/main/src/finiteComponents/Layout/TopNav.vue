<template>
  <div class="top-nav">
    <div class="logo">主框架</div>
    <div class="fuc">
      <div class="title">{{ title }}</div>
      <div class="user-info">
        <span>{{ username }}</span>
        <i @click.stop="logout" class="logout"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { loginOut } from '@/Tool/LoginSet'
import { defineComponent } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElMessageBoxOptions } from 'element-plus/packages/message-box/src/message-box.type'
import vuex from '@/store'
export default defineComponent({
  computed: {
    title() {
      return this.$route.meta.title
    },
    username() {
      return vuex.state.user && vuex.state.user.info?.username
    },
  },
  methods: {
    async logout() {
      try {
        await ElMessageBox.confirm('确定退出页面!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        } as ElMessageBoxOptions)
        await loginOut(vuex.state.user.orgid as number)
      } catch (e) {
        console.log(e)
      }
    },
  },
})
</script>

<style scoped lang="scss">
.top-nav {
  display: flex;
  height: 100%;
  box-shadow: var(--box-shadow);
}
.logo {
  width: 220px;
  height: 100%;
  background: var(--primary-color);
  font-size: 30px;
  text-align: center;
  line-height: 50px;
  color: var(--main-color);
}

.fuc {
  flex: 1;
  display: flex;
}
.title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: var(--h4-16);
  font-weight: 600;
  color: var(--font-color-second);
  // letter-spacing: 2px;
}
.user-info {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-left: auto;
  height: 100%;
  > span {
    margin-right: 10px;
  }
  .logout {
    display: inline-block;
    background: url(~@/assets/images/icon-logout.png) center center no-repeat;
    background-size: contain;
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: auto;
  }
}
</style>
