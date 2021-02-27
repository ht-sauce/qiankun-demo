<style>
.header {
  position: fixed;
  top: 0;
  padding-left: 180px;
  height: 45px;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
  box-sizing: border-box;
}

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: #2284e7;
  overflow-x: hidden;
  z-index: 20;
}

.MainBody {
  padding-left: 240px;
  padding-top: 45px;
  background: #f3f4f5;
}
</style>
<template>
  <div id="body">
    <div class="header">
      <Header />
    </div>
    <Navigation class="navigation" />
    <div class="MainBody">
      <keep-alive>
        <router-view class="page" v-if="$route.meta.keepAlive === true"></router-view>
      </keep-alive>
      <router-view class="page" v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Navigation from '@/components/nav/Navigation'
import Header from '@/components/header/Header'

export default {
  methods: {
    ...mapActions('user', ['initUser', 'setPermission']),
  },
  beforeDestroy() {
    this.$storage.destory()
  },
  mounted() {
    this.initUser(this.$storage.getUserInfo())
    console.log(1111)
    this.setPermission(this.$storage.getPermission())
  },
  components: {
    Header,
    Navigation,
  },
}
</script>
