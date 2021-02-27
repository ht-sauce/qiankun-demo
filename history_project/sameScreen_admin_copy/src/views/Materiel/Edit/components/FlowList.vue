<template>
  <background class="flow-list">
    <div class="operation">
      <el-button size="small" type="primary" @click="addNode">新增节点</el-button>
    </div>
    <div class="lists">
      <template v-for="(item, index) in NodeList">
        <div
          class="node-li"
          :class="{ current: (currentLi && currentLi.id) === item.id }"
          :style="{ cursor: isdrag ? 'move' : 'pointer' }"
          :key="item.id"
          @click="onclick(item)"
          :draggable="isdrag"
          @drop="
            e => {
              ondrop(e, index)
            }
          "
          @dragover="
            e => {
              e.preventDefault()
            }
          "
          @dragstart="
            e => {
              ondragstart(e, index)
            }
          "
        >
          <span class="no">{{ index + 1 }}</span>
          <span class="title">{{ item.name ? item.name : '请修改名称' }}</span>
          <span style="margin-left: auto;">
            <el-popconfirm title="确定删除该话术节点吗" @onConfirm="onDel(item, index)">
              <span slot="reference" class="el-icon-delete-solid icon"></span>
            </el-popconfirm>
          </span>
        </div>
      </template>
    </div>
  </background>
</template>

<script>
import Background from '../components/Background'
import { getOptUUID, copy } from '../glTool'
// 这个页面自己去写拖动换位
export default {
  components: {
    Background,
  },
  props: {
    // 节点模板信息，新增节点除了必要字段外，其余字段以这个为模板新增
    nodeTemplate: {
      type: Object,
      default: () => {
        return {
          id: null,
          name: null,
          videoUrl: null,
          videoInfo: {},
          productImg: '',
        }
      },
    },
    done: Function, // 这个函数需要返回一个pormise结果，reslove则所有操作正常执行
    list: {
      type: Array,
      default: () => [],
    },
    isdrag: Boolean, // 是否拖拽换位
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(list) {
        this.NodeList = list
      },
    },
  },
  data() {
    return {
      NodeList: this.list,
      currentLi: {}, // 当前节点
    }
  },
  methods: {
    reemit(type, data) {
      switch (type) {
        case 'change': {
          this.$emit(type, data)
          break
        }
        case 'customdrag': {
          this.$emit(type, data)
          break
        }
        case 'add': {
          this.$emit(type, data)
          break
        }
      }
      this.currentLi = data
    },
    // 是否点击当前节点
    isCurrentNode(li) {
      if (!this.currentLi) return true
      return this.currentLi.id === li?.id
    },
    // 基础操作封装
    async base(callback, currentLi) {
      try {
        if (currentLi && this.isCurrentNode(currentLi)) {
          callback()
          return
        }
        if (this.done && this.NodeList.length > 0) await this.done()
        callback()
      } catch (e) {
        console.log(e)
      }
    },
    onclick(li, check = true) {
      if (check)
        this.base(() => {
          this.done()
          this.reemit('change', li)
        }, li)
      else this.reemit('change', li)
    },
    onDel(li, index) {
      this.NodeList.splice(index, 1)

      const key = index - 1 < 0 ? 0 : index - 1
      this.reemit('change', this.NodeList[key])
    },
    // 添加节点
    addNode() {
      this.base(() => {
        const item = JSON.parse(JSON.stringify(this.nodeTemplate))
        item.id = getOptUUID()
        this.NodeList.push(item)

        // console.log(item)

        this.reemit('change', item)
      })
    },
    // 拖拽功能集成
    ondragstart(e, index) {
      e.dataTransfer.setData('Text', index)
    },
    ondrop(e, index) {
      e.preventDefault()
      const sindex = e.dataTransfer.getData('Text')
      const one = this.NodeList[sindex]
      const two = this.NodeList[index]

      this.NodeList.splice(sindex, 1, two)
      this.NodeList.splice(index, 1, one)
      this.reemit('customdrag', { sindex, index })
    },
  },
}
</script>

<style scoped lang="scss">
.flow-list {
  margin-top: 0;
  width: 260px;
  height: 100%;
  margin-right: 10px;
  overflow: auto;
  .flip-list-move {
    transition: transform 0.3s;
  }
  .operation {
    margin-bottom: 10px;
  }
  .lists {
    min-height: 580px;
  }
  .node-base {
    width: 240px;
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  .node-li {
    @extend .node-base;
    background: #fff;
    border-bottom: #eaeaea 1px solid;
    .no {
      padding-right: 10px;
    }
    .title {
      font-weight: 500;
      padding-bottom: 0;
      width: 200px;
      overflow: hidden;
    }
    .icon {
      padding: 10px 0 10px 10px;
      color: #909399;
      &:hover {
        color: #f56c6c;
      }
    }
    &:hover {
      background: #409eff;
      color: #fff;
    }
  }
  .current {
    background: #409eff;
    color: #fff;
    .icon {
      color: #f2f2f2;
    }
  }
}
</style>
