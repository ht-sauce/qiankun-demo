<template>
  <div class="qa-set">
    <div class="title">QA设置</div>
    <div class="nodes">
      <!--节点列表-->
      <QaList ref="QaList" @change="onchange" />
      <!--节点内容-->
      <NodeContent ref="nodeContent" :item="currentli" :material-type="materialType" />
    </div>
  </div>
</template>

<script>
import NodeContent from './NodeContent'
import QaList from './QaList/index.vue'
export default {
  components: {
    NodeContent,
    QaList,
  },
  props: {
    materialType: Number,
  },
  data() {
    return {
      currentli: null,
    }
  },
  methods: {
    onchange(e) {
      this.currentli = e
    },
    formCheck() {
      return this.$refs['nodeContent'].formCheck()
    },
    getTreeData() {
      return this.$refs['QaList'].treeData
    },
  },
}
</script>

<style scoped lang="scss">
.qa-set {
  .title {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
  }
}
.nodes {
  display: flex;
  padding-bottom: 60px;
}
</style>
