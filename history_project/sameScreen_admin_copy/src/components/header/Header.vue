<style scoped>
.head {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-content: center;
}

.logout {
  display: inline-block;
  background: url(./images/icon-logout.png) center center no-repeat;
  background-size: contain;
  cursor: pointer;
  width: 15px;
  height: 17px;
  margin-right: 20px;
}

.downloads {
  margin-top: 4px;
}

.user-name {
  margin: 0 20px 0 20px;
  padding-left: 28px;
  line-height: 24px;
  background: url(./images/head.png) 0 0 no-repeat;
  background-size: contain;
  color: #2284E7;
  border-right: solid 1px rgba(0,0,0,0.09);
  padding-right:20px;
}

.orgName {
  line-height: 44px;
  margin-right: 15px;
}
</style>
<template>
  <div class="head">
    <div class="flex-center">
      <div class="user-name">{{userName}}</div>
      <i @click.stop="logout" class="logout"></i>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from "vuex";
export default {
  data() {
    return {
      organizationName: ""
    };
  },
  computed: {
    ...mapState("user", ["userName"])
  },
  methods: {
    logout() {
      this.$confirm("确定退出页面!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$storage.destory();
        this.$router.replace("/login");
      });
    }
  },
  created() {
    let _user = this.$storage.getUserInfo("user");
    this.organizationName = _user ? _user.organizationName : "";
  }
};
</script>