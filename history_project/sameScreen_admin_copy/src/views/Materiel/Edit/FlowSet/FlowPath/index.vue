<template>
  <div class="flow-path">
    <div class="title">流程设置</div>
    <JumpDiscourseMarket />
    <div class="nodes">
      <!--节点列表-->
      <NodeList ref="NodeList" @change="onchange" />
      <!--节点内容-->
      <NodeContent ref="nodeContent" :form-data="formData" />
    </div>
  </div>
</template>

<script>
import JumpDiscourseMarket from '../../components/JumpDiscourseMarket/index'
import NodeContent from './NodeContent'
import NodeList from './NodeList'
export default {
  inject: ['tab', 'word'],
  components: {
    JumpDiscourseMarket,
    NodeContent,
    NodeList,
  },
  props: {},
  computed: {
    sections() {
      return this.word().sections
    },
  },
  watch: {
    // 分解之后的话术片段
    sections: {
      deep: true,
      immediate: true,
      handler(list) {
        // 生成列表和编辑区域需要的数据
      },
    },
  },
  data() {
    return {
      formData: {}, // 节点内容表单数据
    }
  },
  created() {},
  methods: {
    formCheck() {
      return this.$refs['nodeContent'].formCheck()
    },
    // 列表修改返回信息
    onchange(li) {
      this.formData = li
    },
    // 获取子组件的节点列表数据
    getNodeList() {
      return this.$refs['NodeList'].nodeList
    },
  },
}
</script>

<style scoped lang="scss">
.flow-path {
  .title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
  }
}
.nodes {
  display: flex;
  height: 600px;
}
</style>
