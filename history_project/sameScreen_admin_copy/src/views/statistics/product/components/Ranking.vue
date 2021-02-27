<template>
  <div class="rank-body">
    <h3 class="rank-title">前十机型排名</h3>
    <div class="item" v-for="(item, index) in itemArr" :key="index">
      <span class="item-index" :class="{ active: index < 3 }">{{ index + 1 }}</span>
      <span class="item-name">{{ item.phoneType }}</span>
      <span class="item-num">{{ item.num }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // itemArr: [
      //   { name: "华为Mate 40", num: 32225 },
      //   { name: "IPHONE 12 max", num: 32225 },
      //   { name: "小米5", num: 32225 },
      //   { name: "Vivo X2", num: 32225 },
      //   { name: "华为P20", num: 32225 },
      //   { name: "华为P30", num: 32225 },
      //   { name: "IPHONE 11", num: 32225 },
      //   { name: "IPHONE 12 mini", num: 32225 },
      //   { name: "IPHONE X", num: 32225 },
      //   { name: "IPHONE 8", num: 32225 },
      // ],
    };
  },
};
</script>

<style lang="scss" scoped>
.rank-body {
  .rank-title {
    width: 98px;
    height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 40px;
  }
  .item {
    padding: 8px 0;
    .item-index {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      background: #f0f2f5;
      color: rgba(0, 0, 0, 0.65);
    }
    .active {
      background: #3080ff;
      color: #fff;
    }
    .item-name {
      display: inline-block;
      margin-left: 20px;
      height: 20px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.65);
      width: 260px;
    }
    .item-num {
      margin-left: 20px;
      height: 20px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
