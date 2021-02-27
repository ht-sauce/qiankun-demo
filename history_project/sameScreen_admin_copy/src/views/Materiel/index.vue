<template>
  <div class="contentView main">
    <el-tabs
      v-model="currentTab.name"
      type="card"
      editable
      @tab-remove="tabRemove"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.key"
        :label="item.title"
        :name="item.name"
      >
        <!--列表页面-->
        <MaterialList
          v-if="item.type === 'list'"
          ref="materialList"
          @sendDetail="row => MaterialListEvent({ row, type: 'info' })"
          @edit="row => MaterialListEvent({ row, type: 'edit' })"
          @add="MaterialListEvent({ row: null, type: 'add' })"
        ></MaterialList>
        <!--详情页面-->
        <MaterialDetail v-if="item.type === 'info'" :tabs="item"></MaterialDetail>
        <!--物料编辑页面内容-->
        <Edit v-if="item.type === 'edit'" :tabs="item" />
        <!--新增，通过row传入空数据辨别-->
        <Edit v-if="item.type === 'add'" :tabs="item" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import MaterialList from './materialList'
import MaterialDetail from './MaterialDetail'
import Edit from './Edit/index'
export default {
  components: { MaterialList, MaterialDetail, Edit },
  provide() {
    return {
      MainTabRemove: this.tabRemove, // 关闭页面分享
    }
  },
  data() {
    return {
      // 当前tab对象值
      currentTab: {},
      // tab页数据
      editableTabs: [],
    }
  },
  created() {
    // tab页类型
    this.TabType = {
      info: 'info',
      edit: 'edit',
      list: 'list',
      add: 'add',
    }
    const listTab = { title: '列表页', name: '1', type: 'list', key: new Date().getTime() }
    this.setCurrentTab(listTab)
    this.editableTabs.push(listTab)
  },
  methods: {
    // 移除
    tabRemove(name) {
      const { index, upperRow } = this.getTabIndex(name)
      this.editableTabs.splice(index, 1)
      this.setCurrentTab(upperRow)
    },
    // 当前点击
    tabClick(com) {
      const { row } = this.getTabIndex(com.name)
      this.setCurrentTab(row)
      // 规则定义，每一个子页面都可能有一个start函数，默认会去调用start函数作为初始启动
      com.$children[0].start && com.$children[0].start()
    },
    // 列表新增，编辑，详情返回事件
    MaterialListEvent({ row, type }) {
      if (type === this.TabType.add) {
        this.addTab({ title: '新增', name: new Date().getTime(), row: null, type: type })
      } else {
        this.addTab({ title: row.name, name: row.id, row, type: type })
      }
    },
    // 获取tab index
    getTabIndex(name) {
      const index = this.editableTabs.findIndex(item => {
        return item.name == name
      })
      const upperIndex = index - 1 < 0 ? 0 : index - 1
      const maxIndex = this.editableTabs.length - 1
      const nextIndex = index + 1 > maxIndex ? maxIndex : index + 1
      return {
        index,
        upperIndex,
        upperRow: this.editableTabs[upperIndex],
        row: this.editableTabs[index],
        nextIndex,
        next: this.editableTabs[nextIndex],
      }
    },
    // 防止v-model修改数据,和全局修改统一
    setCurrentTab(tab) {
      // 实现再次点击同一行数据会让对应的内部页面数据更新，如果不需要请注释
      const { index } = this.getTabIndex(tab.name)
      if (index >= 0) this.editableTabs[index].key = new Date().getTime()
      // 设置到当前页面
      this.currentTab = JSON.parse(JSON.stringify(tab))
    },
    // 添加tab页
    addTab({ row, name, title, type }) {
      // 区分编辑和新增，不区分会导致同一个id无法再打开
      name = `${name}_${type}`
      switch (type) {
        case this.TabType.info:
          title = '详情：' + title
          break
        case this.TabType.edit:
          title = '编辑：' + title
          break
      }

      const item = { row, name, title, type, key: new Date().getTime() }
      this.setCurrentTab(item) // 设置当前页
      // 已存在不新增新页面
      const { index } = this.getTabIndex(name)
      if (index >= 0) return
      this.editableTabs.push(item)
    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  margin: 10px;
  background: #fff;
  ::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    .el-icon-close {
      display: none;
    }
  }
  ::v-deep .el-tabs__new-tab {
    display: none;
  }
}
</style>
