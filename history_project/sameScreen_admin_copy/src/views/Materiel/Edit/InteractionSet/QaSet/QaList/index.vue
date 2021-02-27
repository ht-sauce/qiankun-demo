<template>
  <background v-loading="loading" class="qa-list">
    <div class="operation">
      <!--新增分类-->
      <AddGroup @save="onAddGroup" />
    </div>
    <el-tree
      draggable
      default-expand-all
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      class="qs-con"
      :data="treeData"
      @node-click="handleNodeClick"
    >
      <template slot-scope="{ node, data }">
        <div class="custom-tree-node" :style="{ cursor: data.leave === 2 ? 'move' : 'pointer' }">
          <div
            class="title"
            :class="{
              'two-tit': data.leave === 2,
              'show-item': (currentLi && currentLi.id) === data.id,
            }"
            :title="node.label"
          >
            {{ node.label || '请填写描述信息' }}
          </div>
          <span class="icon">
            <template v-if="data.leave === 1">
              <span
                title="新增QA问题"
                @click.stop="addChildItem(node)"
                class="el-icon-plus add"
              ></span>
              <!--删除分组-->
              <DelGropu v-if="node.label !== '未分类'" :item="data" @del="onDelGroup" />
            </template>
            <template v-else>
              <el-popconfirm title="确定删除该删除QA问题" @onConfirm="onDelItem(node, data)">
                <span slot="reference" title="删除QA问题" class="el-icon-minus del"></span>
              </el-popconfirm>
            </template>
          </span>
        </div>
      </template>
    </el-tree>
  </background>
</template>

<script>
import Background from '../../../components/Background'
import { getNodeResources, getOptUUID } from '../../../glTool'
import Service from '@/servicesSauce'
import AddGroup from './AddGroup'
import DelGropu from './DelGropu'
export default {
  inject: ['word', 'getTabData'],
  components: {
    Background,
    AddGroup,
    DelGropu,
  },
  computed: {
    sections() {
      return this.word().sections
    },
  },
  watch: {
    sections: {
      deep: true,
      immediate: true,
      handler(tree) {
        if (!tree) return null
        // 得到回显数据结构列表
        this.nodeList = this.listEcho(tree)
        this.start()
      },
    },
  },
  data() {
    return {
      loading: false,
      nodeList: [],
      treeData: [], // 树数据,最终数据取值处
      currentLi: null, // 当前节点
    }
  },
  created() {
    // 目前存在的emit：change
    // 节点列表数据, 未展示在页面上, 这个数据后面除了start使用之后不会再使用。
    this.nodeList = this.nodeList || []
  },
  methods: {
    // 开始函数，注意这里的主要目的是为了匹配数据和获取初始数据，后续数据操作和接口无关
    async start() {
      try {
        this.loading = true
        const treeData = await this.getGroupList() // 获取可用全部分类
        const groupMap = await this.getGroup()

        const nodelistMap = new Map() // 拷贝一份当前节点列表
        // 话术市场得到的数据结构
        this.nodeList.forEach(li => {
          li.nodeName && nodelistMap.set(li.nodeName, li)
        })
        // 先根据分类组情况匹配插入分组数据
        treeData.forEach(li => {
          if (!li.id) return // 排除未分类节点
          const qalist = groupMap.get(li.id)
          qalist.forEach(qa => {
            const name = qa?.qaDesc
            const wordItem = nodelistMap.get(name)
            // 匹配到了数据
            if (wordItem && name && name === wordItem.nodeName) {
              nodelistMap.delete(name)
              li.children.push({
                label: name,
                children: [],
                leave: 2,
                isVisual: qa.isVisual ? qa.isVisual : 1,
                ...wordItem,
              })
            }
          })
        })
        // 最后剩余的数据全部插入未分类里面
        nodelistMap.forEach(li => {
          // 未分类节点插入数据
          treeData[treeData.length - 1].children.push({
            label: li.nodeName,
            children: [],
            leave: 2,
            ...li,
          })
        })
        this.treeData = treeData
        this.showItem()
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    // 显示第一个有数据的节点
    showItem() {
      const list = this.treeData || []
      for (let i = 0; i < list.length; i++) {
        const child = list[i].children
        for (let j = 0; j < child.length; j++) {
          const item = child[j]
          if (item) {
            console.log(item)
            this.currentLi = item
            this.$emit('change', item)
            return null
          }
        }
      }
    },
    // 点击当前节点
    handleNodeClick(data, node) {
      if (data.leave !== 2) return null
      this.base(
        () => {
          this.$parent.$refs['nodeContent'].formCheck() // 点击当前节点的时候消除错误提示
          this.$emit('change', data)
        },
        data,
        node.parent.childNodes,
      )
    },
    // 基础操作封装
    async base(callback, currentLi, child = []) {
      // 是否点击当前节点
      const isCurrentNode = li => {
        if (!this.currentLi) return true
        return this.currentLi.id === li.id
      }
      try {
        if (currentLi && isCurrentNode(currentLi)) {
          callback()
          this.currentLi = currentLi
          return
        }
        if (child.length > 0) await this.$parent.$refs['nodeContent'].formCheck()
        callback()
      } catch (e) {
        console.log(e)
      }
    },
    // 列表回显数据结构
    listEcho(tree) {
      const { nodeContentMap, nodeSelectionsMap } = this.word()
      const list = []
      tree.forEach(item => {
        const nodeItem = nodeContentMap.get(item.next.id)
        const { id, nodeName, video, image, tag, audioContent } = getNodeResources(nodeItem)
        const { rule } = nodeSelectionsMap.get(item.id)
        const rules = rule.match(/\((.+?)\)/)[1]
        const li = {
          id,
          rules,
          nodeName,
          tag,
          videoInfo: {
            ...video._videoEcho,
            videInfo: {
              audioUrl: video._videoEcho.url, // 避免数据丢失
              audioContent,
            },
          },
          image: image?.value,
          isVisual: nodeItem.nodePayload?.isVisual || 1, // 1.可见 2.不可见，这个数据需要在后面再匹配一边
        }
        list.push(li)
      })

      return list
    },
    // 获取分组关系
    async getGroup() {
      try {
        const id = this.getTabData().row.id
        const result = await Service.RS.QaGroup.query({
          data: { materialId: id, materialType: this.word().materialType },
        })
        const group = new Map()
        result.object &&
          result.object.forEach(li => {
            //console.log(li)
            group.set(li.groupId, li.questionDTOList || [])
          })

        return Promise.resolve(group)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 获取分组列表
    async getGroupList() {
      const data = {
        materialType: this.word().materialType,
        materialId: this.getTabData().row.id,
      }
      const res = await Service.RS.QaGroup.list({ data })

      const list = res.object
      const treeData = []
      list.forEach(li => {
        treeData.push({
          label: li.groupName,
          children: [],
          leave: 1,
          ...li,
        })
      })
      // 手动插入未分类节点
      treeData.push({
        label: '未分类',
        children: [],
        leave: 1,
      })
      return treeData
    },
    // 添加分类回调
    onAddGroup(li) {
      this.treeData.unshift({
        label: li.groupName,
        children: [],
        leave: 1,
        ...li,
      })
    },
    // 删除分类
    onDelGroup(data) {
      const id = data.id
      const treeData = this.treeData
      let index = -1
      treeData.forEach((li, i) => {
        if (li.id === id) index = i
      })
      const childNode = data.children.length > 0 ? data.children : [] // 需要被移入未分类的数据
      this.treeData.forEach(li => {
        // 找到未分类节点
        if (!li.id) li.children.push(...childNode)
      })
      index !== -1 && treeData.splice(index, 1)
      this.treeData = treeData
    },
    // 添加子节点
    addChildItem(node) {
      const temp = {
        id: getOptUUID(),
        label: null,
        children: [],
        leave: 2,
        image: null,
        tag: null,
        rules: null,
        videoInfo: {},
        isVisual: 1,
      }
      node.data.children.push(temp)
      this.currentLi = temp
      this.$emit('change', temp)
    },
    // 节点能否被拖拽
    allowDrag(node) {
      return node.level === 2
    },
    // 节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      // 只能2级放入一级
      if (draggingNode.level === 2 && dropNode.level === 1 && type === 'inner') return true
      // 只能2级之间换位
      if (draggingNode.level === 2 && dropNode.level === 2 && type !== 'inner') return true
      return false
    },
    // 删除对应节点数据
    onDelItem(node, data) {
      let one = -1
      let two = -1
      let isCur = false // 是否本身
      this.treeData.forEach((item, index) => {
        item.children.forEach((li, i) => {
          if (li.id === data.id) {
            one = index
            two = i
            if (data.id === li.id) isCur = true
          }
        })
      })
      if (one !== -1 && two !== -1) {
        this.treeData[one].children.splice(two, 1)
      }
      isCur && this.$emit('change', {})
    },
  },
}
</script>

<style scoped lang="scss">
.qa-list {
  margin-top: 0;
  width: 260px;
  height: 100%;
  margin-right: 10px;
  overflow: auto;
  .operation {
    margin-bottom: 10px;
  }
  .qs-con {
    height: 512px;
    ::v-deep .el-tree-node__content {
      height: 34px;
    }
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  .show-item {
    color: #409eff;
  }
  .title {
    flex: 1;
  }
  .two-tit {
    width: 170px !important;
    overflow: hidden;
  }
  .icon {
    color: #409eff;
    > span {
      margin: 0 5px;
    }
    .add:hover {
      color: #2284e7;
      box-shadow: rgba(0, 0, 0, 0.5);
    }
    .del:hover {
      color: #f56c6c;
      box-shadow: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
