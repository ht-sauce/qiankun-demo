<template>
  <div class="firewall">
    <div class="title">兜底设置</div>
    <div class="nodes">
      <!--节点列表-->
      <NodeList ref="NodeList" @change="onchange" />
      <!--节点内容-->
      <NodeContent ref="nodeContent" :form-data="formData" />
    </div>
  </div>
</template>

<script>
import NodeList from './NodeList'
import NodeContent from './NodeContent'
export default {
  components: {
    NodeContent,
    NodeList,
  },
  props: {
    materialType: Number,
  },
  data() {
    return {
      formData: {}, // 节点内容表单数据
    }
  },
  methods: {
    formCheck() {
      return this.$refs['nodeContent'].formCheck()
    },
    getNodeListData() {
      return this.$refs['NodeList'].FlowList.NodeList
    },
    // 列表修改返回信息
    onchange(li) {
      this.formData = li
    },
    // 获取子组件的节点列表数据
    getNodeList() {
      return this.$refs['NodeList'].FlowList.nodeList
    },
  },
}
</script>

<style scoped lang="scss">
.firewall {
  padding-bottom: 50px;
  .title {
    margin: 10px 0;
    font-size: 14px;
    font-weight: 600;
  }
}
.nodes {
  display: flex;
  height: 600px;
}
</style>
