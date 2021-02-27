<template>
  <div class="edit">
    <el-steps class="steps" :active="active">
      <el-step>
        <template #title>
          <span class="title">全局设置</span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span class="title">流程设置</span>
        </template>
      </el-step>
      <el-step>
        <template #title>
          <span class="title">互动设置</span>
        </template>
      </el-step>
    </el-steps>
    <!--实际内容区域-->
    <div class="main">
      <!--按钮操作区域,上一步，下一步不在这里操作-->
      <!--<div class="options">
      </div>-->
      <div class="main-content">
        <!--全局设置-->
        <GlobalSet v-if="active === 0" />
        <!--流程设置-->
        <FlowSet v-if="active === 1" />
        <!--互动设置-->
        <InteractionSet v-if="active === 2" />
      </div>
    </div>
  </div>
</template>

<script>
import GlobalSet from './GlobalSet/index.vue'
import FlowSet from './FlowSet/index.vue'
import InteractionSet from './InteractionSet/index.vue'
export default {
  components: { FlowSet, GlobalSet, InteractionSet },
  props: {
    tabs: Object,
  },
  provide() {
    return {
      // 全局tab数据
      getTabData: () => this.tabsData,
      setTabData: (data = {}) => {
        this.tabsData = { ...this.tabsData, ...data }
        this.updateSpeechcrafts()
      },
      EditUpperOrNext: this.upperOrNext, // 上一步下一步分享
      // 设置共享数据
      getStore: () => this.Store,
      setStore: store => {
        this.Store = store
      },
      // 共享active数据
      glActive: () => this.active, // 这种方式是可以使得后续的页面用动态计算得到监听数据
    }
  },
  data() {
    return {
      tabsData: this.tabs,
      // 当前页的共享数据
      Store: {
        // 话术列表
        Speechcrafts: [],
      },
      active: 0, // 0全局设置，1流程设置，2互动设置
    }
  },
  created() {
    // 话术列表数据初始化
    this.updateSpeechcrafts()
  },
  methods: {
    updateSpeechcrafts() {
      this.Store.Speechcrafts = this.tabsData?.row?.capabilityPatternDTOList
    },
    // 设置当前哪一步
    setSteps(active) {
      this.active = active
    },
    /*上一步和下一步*/
    upperOrNext(type) {
      let iactive = this.active
      const min = 0,
        max = 2
      switch (type) {
        case 'upper':
          iactive = iactive - 1 < min ? min : iactive - 1
          break
        case 'next':
          iactive = iactive + 1 > max ? max : iactive + 1
          break
      }
      this.setSteps(iactive)
    },
  },
}
</script>

<style scoped lang="scss">
.edit {
  min-height: 800px;
  padding-top: 10px;
  width: 1000px;
  //display: flex;
}
.steps {
  margin-left: 20px;
  .title {
    margin-left: -20px;
  }
}
.main {
  width: 100%;
  .options {
  }
}
.main-content {
  width: 100%;
  padding-top: 10px;
}
</style>
