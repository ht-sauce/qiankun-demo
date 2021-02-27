<template>
  <div v-loading="loading" class="interaction-set">
    <div class="button-opt">
      <el-button type="primary" size="small" @click="Upper">上一步</el-button>
      <el-button type="primary" size="small" @click="SaveButton">保存</el-button>
    </div>
    <el-tabs class="tabs-style" v-model="tab.activeName" @tab-click="handleClick">
      <template v-for="item in speechcrafts">
        <el-tab-pane
          :label="speechcraftsType[item.materialType]"
          :name="item.materialType.toString()"
          :key="item.materialType"
          :class="{ 'one-item': speechcrafts.length === 1 }"
        ></el-tab-pane>
      </template>
    </el-tabs>
    <div class="content" :key="tab.activeName">
      <!--按钮设置-->
      <ButtonSet @formData="ButtonSetChange" ref="ButtonSet" :material-info="tab.currentData" />
      <el-tabs v-model="contentTab.active">
        <el-tab-pane v-if="QaSetShow" label="QA问答" name="1">
          <QaSet ref="QaSet" :material-type="tab.currentData.materialType" />
        </el-tab-pane>
        <el-tab-pane label="兜底话术" name="2">
          <Firewall ref="Firewall" :material-type="tab.currentData.materialType" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { speechcraftsSort } from '../glTool'
import ButtonSet from '../components/ButtonSet'
import QaSet from './QaSet'
import Firewall from './Firewall'
import Service from '@/servicesSauce'
import { nodecToMap, copy } from '../glTool'
import { analysisQaTree, getNSM, BuildSpeechcraft, groupData } from './InteractionSet'
import { GenerateDraft } from '../glApi'
export default {
  components: {
    ButtonSet,
    QaSet,
    Firewall,
  },
  inject: ['EditUpperOrNext', 'getTabData'],
  computed: {
    speechcrafts() {
      // 话术页
      const list = this.getTabData().row?.capabilityPatternDTOList
      return speechcraftsSort(list)
    },
    corpid() {
      return this.$store.state.userInfo.corpid
    },
  },
  provide() {
    return {
      word: () => this.word, // 共享话术信息
    }
  },
  data() {
    return {
      loading: false,
      tab: {
        activeName: '1',
        cuttentData: {},
        currentIndex: 0,
      },
      speechcraftsType: {
        1: '基础版',
        2: '3D视频版',
        3: '图文版',
        4: '2D真人版',
      },
      // QA问题设置和兜底部分设置
      contentTab: {
        active: '1',
      },
      // qa组件是否展示
      QaSetShow: true,
      // 话术组内容
      word: {
        nodeContentMap: new Map(), // 所有的nodeContent数据map
        nodeSelectionsMap: new Map(), // 第一个nodeContent里面的sel部分数据，含有场景问法
        _ChildId: null, // 子话术id
        materialType: null, // 当前类型
        MainTree: null, // 最顶上的树
        sections: null, // qa问题树
        defaultTree: null, // 默认节点树
        bottomTree: null, // 兜底树
        defSel: null, //默认节点的sel
        bottomSel: null, // 兜底的sel
      },
    }
  },
  created() {
    this.Start()
  },
  methods: {
    // 校验当前页面
    async checkPage() {
      try {
        const QaSet = this.$refs['QaSet']
        const Firewall = this.$refs['Firewall']
        const ButtonSet = this.$refs['ButtonSet']
        // 校验当前页面
        this.QaSetShow && QaSet && (await QaSet.formCheck())
        !this.QaSetShow && (await Firewall.formCheck()) // 兜底校验
        return Promise.resolve({ QaSet, Firewall, ButtonSet })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 上一步
    async Upper() {
      try {
        this.loading = true
        await this.Save()
        this.loading = false
        this.EditUpperOrNext('upper')
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 保存按钮
    async SaveButton() {
      try {
        this.loading = true
        await this.Save()
        this.Start(this.tab.currentIndex)
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
    // 开始
    async Start(i = 0) {
      try {
        this.loading = true
        const curr = this.speechcrafts[i]
        this.tab = {
          activeName: curr.materialType.toString(),
          currentData: curr,
        }
        const data = await this.getWord()
        this.analysisData(data)
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 保存
    async Save() {
      try {
        const { QaSet, Firewall, ButtonSet } = await this.checkPage()
        await ButtonSet.Save() // 保存按钮设置信息
        const mainData = QaSet ? copy(QaSet.getTreeData()) : null
        const bottomData = copy(Firewall.getNodeListData()) // 兜底部分数据获取
        // console.log(mainData, bottomData)
        const { treeContent, nodeContent } = new BuildSpeechcraft(
          QaSet ? copy(mainData) : [],
          bottomData,
          this.word,
        ) // 兜底数据格式生成
        const groupDataList = groupData(copy(mainData), this.tab.currentData.materialId)
        Service.RS.QaGroup.updateOrAdd({ data: groupDataList })

        // // 保存到话术市场
        const { parentId, _ChildId } = this.word
        await Service.Sc.updateSpeechSkillDraft({
          data: {
            corpId: this.corpid,
            nodeContent,
            parentId,
            speechSkillId: _ChildId,
            treeContent,
          },
          success: '保存成功',
        })
        return Promise.resolve()
      } catch (e) {
        console.log(e)
        return Promise.reject(e)
      }
    },
    // 点击当前页
    async handleClick() {
      let i = 0
      const item = this.speechcrafts.filter((li, index) => {
        i = index
        return li.materialType.toString() === this.tab.activeName
      })
      this.tab.currentData = item[0]
      this.tab.currentIndex = i

      const data = await this.getWord()
      this.analysisData(data)
    },
    // 获取话术信息
    async getWord() {
      try {
        const { _ChildId, draftSpeechSkillId } = await GenerateDraft(this.tab.currentData)
        // 第一次查询线上话术
        if (!_ChildId) return Promise.reject('话术id不存在')
        const result = await Service.Sc.mainInfo({
          data: { speechSkillId: _ChildId },
        })
        const data = result.result.rows[0]
        data.treeContent = JSON.parse(data.treeContent)
        data.nodeContent = JSON.parse(data.nodeContent)
        data._ChildId = _ChildId
        data.draftSpeechSkillId = draftSpeechSkillId
        return Promise.resolve(data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 分析解构数据
    analysisData(data) {
      if (!data) return null
      const treeContent = data.treeContent
      const nodeContent = data.nodeContent
      const { MainTree, sections, defaultTree, bottomTree } = analysisQaTree(treeContent)
      const nodeContentMap = nodecToMap(nodeContent)
      const { nodeSelectionsMap, defSel, bottomSel } = getNSM(nodeContent[0]) // 获取第一个nodecontent里面的结构数据
      const { materialType } = this.tab.currentData
      const { _ChildId, draftSpeechSkillId } = data

      this.word = {
        nodeContentMap,
        nodeSelectionsMap,
        parentId: draftSpeechSkillId,
        _ChildId,
        materialType,
        MainTree,
        sections,
        defaultTree,
        defSel,
        bottomTree,
        bottomSel,
      }
    },
    // 按钮设置内部数据变化回调
    ButtonSetChange(data) {
      const { subject, voiceButton } = data
      if (subject === 'v1') {
        const vb = voiceButton.enable
        this.QaSetShow = vb
        if (!vb) this.contentTab.active = '2'
      } else this.QaSetShow = true
    },
  },
}
</script>

<style scoped lang="scss">
@import '../edit.scss';
.interaction-set {
  .one-item {
    display: block;
  }
  .button-opt {
    @extend .button-opt;
    left: 1110px;
  }
  .tabs-style {
    @extend .tabs-style;
  }
  .content {
    @extend .tabs-style;
  }
}
</style>
