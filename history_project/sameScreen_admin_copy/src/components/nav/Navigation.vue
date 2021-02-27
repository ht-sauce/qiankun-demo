<style scoped>
.nav-icon {
  display: inline-block;
  padding-right: 10px;
  color: #fff;
}

.nav-logo {
  height: 64px;
  width: 100%;
  background: url(./images/logo.png) center center no-repeat;
  background-size: 60%;
}

.nav-badge {
  margin-left: 5px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
}
</style>
<template>
  <div>
    <div class="nav-logo"></div>
    <el-menu
      :router="true"
      :default-openeds="openMenus"
      :unique-opened="true"
      background-color="#2284e7"
      text-color="#fff"
      :default-active="routeActive"
    >
      <el-menu-item index="/data/overview" v-if="menus.indexOf('/data/overview') != -1">
        <template slot="title">
          <i class="nav-icon iconfont icondashboard"></i>
          <span slot="title">首页</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/material-management" v-if="menus.indexOf('/material-management') != -1">
        <template slot="title">
          <i class="nav-icon iconfont iconchanpinguanli"></i>
          <span slot="title">物料管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/product/management" v-if="menus.indexOf('/product/management') != -1">
        <template slot="title">
          <i class="nav-icon iconfont iconchanpinguanli"></i>
          <span slot="title">产品管理</span>
        </template>
      </el-menu-item>
      <el-submenu index="statistics" v-if="menus.indexOf('statistics') != -1">
        <template slot="title">
          <i class="nav-icon iconfont iconchanpinguanli"></i>
          <span slot="title">统计</span>
        </template>
        <el-menu-item index="/statistics/product" v-if="menus.indexOf('/statistics/product') != -1"
          >产品统计</el-menu-item
        >
      </el-submenu>
      <el-submenu index="bot" v-if="menus.indexOf('system') != -1">
        <template slot="title">
          <i class="nav-icon iconfont iconyonghuguanli"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item
          index="/system/organization"
          v-if="menus.indexOf('/system/organization') != -1"
          >组织管理</el-menu-item
        >
        <el-menu-item index="/system/account" v-if="menus.indexOf('/system/account') != -1"
          >账号管理</el-menu-item
        >
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import storage from '../../api/storage.js'
export default {
  name: 'navigation',
  data: function() {
    return {
      openMenus: ['speech'],
    }
  },
  computed: {
    ...mapState('user', ['permission']),
    menus() {
      return this.permission ? this.permission.menu : []
    },
    routeActive() {
      return this.$route.path
    },
  },
  methods: {
    groupJumpFn() {
      const token = storage.getToken('token')
      const corpid = storage.getCorpId()
      //http://192.168.6.66:8081
      window.open('/ccc/#/session?corpid=' + corpid + '&token=' + token)
    },
  },
}
</script>
