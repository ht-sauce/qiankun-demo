<template>
  <div class="contentView">
    <div class="label-item">物料名称: {{ rowData.name }}</div>
    <div class="label-item">所属用户: {{ rowData.username }}</div>
    <div class="label-item">更新时间: {{ rowData.updateTime }}</div>
    <el-tabs v-model="showTableValue" type="border-card" style="margin-top: 24px">
      <el-tab-pane
        :key="item.materialType"
        v-for="item in rowData.capabilityPatternDTOList"
        :label="materialNamesObj[item.materialType]"
        :name="item.materialType + ''"
      >
        <div class="tab-body-detail">
          <div>话术流程：</div>
          <div class="label-item padding-left-24 flex">
            <!-- nodeName节点名称  content音频文本 -->
            <div v-for="child in item.materialFlowList" :key="child.id">
              <el-popover placement="top" trigger="click">
                <div>
                  {{ child.content ? child.content : '没有文本数据' }}
                </div>
                <el-button slot="reference">{{ child.nodeName }}</el-button>
              </el-popover>
            </div>
          </div>
          <template v-if="item.buttonConfigInfo == null">
            <div>交互设置：</div>
            <div class="label-item padding-left-24" v-if="item.isInteract == 1">
              语音交互
            </div>
            <div class="label-item padding-left-24" v-if="item.isQA == 1">快捷问答</div>
            <div class="label-item padding-left-24" v-if="item.button == 1">
              按钮：
              <div class="label-item padding-left-24">文字内容: {{ item.content }}</div>
              <div class="label-item padding-left-24">
                购买链接:
                <a :href="item.buyLink">{{ item.buyLink }}</a>
              </div>
            </div>
          </template>
          <template v-else>
            <div>交互设置：</div>
            <div class="label-item padding-left-24" v-if="item.buttonConfigInfo.voiceButton.enable">
              语音交互
            </div>
            <!-- <div class="label-item padding-left-24" v-if="item.isQA == 1">快捷问答</div> -->
            <div class="label-item padding-left-24" v-if="item.buttonConfigInfo.jumpButton.enable">
              按钮：
              <div class="label-item padding-left-24">
                文字内容: {{ item.buttonConfigInfo.jumpButton.name }}
              </div>
              <div class="label-item padding-left-24">
                购买链接:
                <a :href="item.buyLink">{{ item.buttonConfigInfo.jumpButton.link }}</a>
              </div>
            </div>
          </template>
        </div>
        <div style="text-align: right">
          <el-button
            type="primary"
            size="mini"
            @click="edit"
            :disabled="userName !== rowData.username"
            >编辑</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Service from '@/servicesSauce'
import { Store } from './store'
export default {
  props: {
    tabs: Object,
  },
  data() {
    return {
      showTableValue: null,
      rowData: {},
      materialNamesObj: {
        1: '基础视频版',
        2: '3D视频版',
        3: '图文版',
        4: '2D真人版',
      },
    }
  },
  computed: {
    ...mapState('user', ['userName']),
    row() {
      return Store.materialCurrent
    },
  },
  created() {
    this.start()
  },
  mounted() {},
  methods: {
    // 初始函数
    async start() {
      const row = this.tabs.row
      const res = await Service.RS.materiel.queryOne({ id: row.id })
      res.data.capabilityPatternDTOList = res.data.capabilityPatternDTOList.map(item => {
        return {
          ...item,
          buttonConfigInfo: item.buttonConfigInfo ? JSON.parse(item.buttonConfigInfo) : null,
        }
      })
      this.rowData = res.data

      this.rowData.capabilityPatternDTOList &&
        this.rowData.capabilityPatternDTOList.length &&
        (this.showTableValue = this.rowData.capabilityPatternDTOList[0].materialType + '')
    },
    edit() {
      this.$emit(
        'edit',
        Object.assign({}, this.rowData, {
          materielId: this.rowData.id,
          currentObj: this.rowData,
        }),
      )
    },
  },
}
</script>
<style scoped>
.label-item {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  height: 22px;
  margin: 6px 0;
}
.padding-left-24 {
  padding-left: 24px;
}
.flex {
  display: flex;
  flex: 1;
  height: 40px;
  line-height: 40px;
}
.tab-body-detail {
  height: calc(100vh - 360px);
}
</style>
