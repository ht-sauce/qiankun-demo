<template>
  <div v-loading="loading" class="flow-set">
    <div class="button-opt">
      <el-button type="primary" size="small" @click="UpperOrNext('upper')">上一步</el-button>
      <el-button type="primary" size="small" @click="UpperOrNext('next')">下一步</el-button>
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
      <!--按钮设置部分-->
      <ButtonSet ref="ButtonSet" :material-info="tab.currentData" />
      <!--背景设置, 待机节点生成-->
      <GlobalWord ref="GlobalWord" />
      <!--流程设置-->
      <FlowPath ref="FlowPath" />
    </div>
  </div>
</template>

<script>
import FlowPath from './FlowPath/index'
import { speechcraftsSort } from '../glTool'
import Service from '@/servicesSauce'
import GlobalWord from './GlobalWord/index'
import ButtonSet from '../components/ButtonSet'
import { nodecToMap } from '../glTool'
import { makeStandbyNode, MakeRoutineNode, analysisToNode } from './FlowSet'
import { GenerateDraft } from '../glApi'
export default {
  components: {
    GlobalWord,
    FlowPath,
    ButtonSet,
  },
  inject: ['EditUpperOrNext', 'getTabData', 'setTabData'],
  data() {
    return {
      loading: false,
      tab: {
        activeName: '1',
        currentData: {},
        currentIndex: 0,
      },
      speechcraftsType: {
        1: '基础版',
        2: '3D视频版',
        3: '图文版',
        4: '2D真人版',
      },
      // 话术页
      speechcrafts: [],
      // 解构之后的话术信息
      word: {
        id: null, // 话术id
        ChildId: null, // 子话术id
        ischange: false, // 是否改动
        materialType: null, // 话术类型
        sections: [], // 主流程拆分
        StandbyNode: {}, // 待机节点信息
        nodeContentMap: new Map(), // node的map结构
      },
    }
  },
  computed: {
    corpid() {
      return this.$store.state.userInfo.corpid
    },
  },
  provide() {
    return {
      word: () => this.word, // 共享话术信息
      tab: () => this.tab, // 共享tab信息
    }
  },
  created() {
    //console.log(this.getTabData)
    this.Start()
  },
  methods: {
    // 当前页面校验
    async currentCheck() {
      try {
        const buttonset = this.$refs['ButtonSet']
        const globalword = this.$refs['GlobalWord']
        const flowpath = this.$refs['FlowPath']
        await buttonset.formCheck()
        await globalword.formCheck()
        return Promise.resolve({ buttonset, globalword, flowpath })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 保存按钮
    async SaveButton() {
      await this.Save()
      this.Start(this.tab.currentIndex)
    },
    // 保存
    async Save() {
      // console.log(this.word.sections)
      try {
        this.loading = true
        const { buttonset, globalword, flowpath } = await this.currentCheck()

        await buttonset.Save() // 保存按钮设置
        // 生成待机节点
        const StandbyNode = makeStandbyNode({
          buttonset,
          globalword,
          materialType: this.tab.currentData.materialType,
          word: this.word,
        })
        //console.log('新待机节点内容', StandbyNode)
        await flowpath.formCheck() // 最后流程检测
        const nodeList = flowpath.getNodeList() // 当前最新的修改数据列表
        const { newTree, newNode } = new MakeRoutineNode({
          word: this.word,
          realTimeNode: nodeList,
          StandbyNode,
        })
        // console.log('新的节点和树', newTree, newNode)
        // 保存到话术市场
        await Service.Sc.updateSpeechSkillDraft({
          data: {
            corpId: this.corpid,
            nodeContent: newNode,
            speechSkillId: this.word.id,
            treeContent: newTree,
          },
          success: '保存成功',
        })

        this.loading = false
        return Promise.resolve()
      } catch (e) {
        this.loading = false
        console.log('FlowSet', e)
        return Promise.reject(e)
      }
    },
    // 开始
    async Start(i = 0) {
      try {
        this.loading = true
        const list = this.getTabData().row?.capabilityPatternDTOList
        this.speechcrafts = speechcraftsSort(list)
        const curr = this.speechcrafts[i]
        this.tab = {
          activeName: curr.materialType.toString(),
          currentData: curr,
        }

        const data = await this.getKill()
        this.analysisData(data)
        this.loading = false
        return Promise.resolve(true)
      } catch (e) {
        this.loading = false
        return Promise.reject(e)
      }
    },
    // 上下翻动
    async UpperOrNext(type) {
      try {
        await this.Save()
        this.EditUpperOrNext(type)
      } catch (e) {
        console.log(e)
      }
    },
    // 点击当前页
    async handleClick() {
      try {
        this.loading = true
        let i = 0
        const item = this.speechcrafts.filter((li, index) => {
          i = index
          return li.materialType.toString() === this.tab.activeName
        })
        this.tab.currentData = item[0]
        this.tab.currentIndex = i
        const data = await this.getKill()
        this.analysisData(data)

        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 查询话术信息
    async getKill() {
      try {
        const { draftSpeechSkillId, _ChildId } = await GenerateDraft(this.tab.currentData)

        // 再查一次，需要用草稿id去得到当前需要编辑的话术内容
        const dartres = await Service.Sc.mainInfo({
          data: { speechSkillId: draftSpeechSkillId },
        })
        const darti = dartres.result.rows[0] // 这是最终需要的话术信息
        if (!darti) return Promise.reject(dartres)

        darti.draftSpeechSkillId = draftSpeechSkillId // 给当前草稿话术赋值草稿id

        darti.treeContent = JSON.parse(darti.treeContent)
        darti.nodeContent = JSON.parse(darti.nodeContent)

        darti.ChildId = _ChildId
        return Promise.resolve(darti)
      } catch (e) {
        console.log(e)
        return Promise.reject(e)
      }
    },
    // 分析解构数据
    analysisData(data) {
      if (!data) return

      const treeContent = data.treeContent
      const nodeContent = data.nodeContent

      const { ischange, sections, StandbyNode } = analysisToNode(treeContent)
      const nodeContentMap = nodecToMap(nodeContent)

      // console.log('待机节点', JSON.stringify(StandbyNode))
      // console.log('主流程', sections)
      const { speechSkillId, materialType } = this.tab.currentData
      const { draftSpeechSkillId, ChildId } = data
      //console.log(ChildId)
      this.word = {
        ischange,
        sections,
        StandbyNode,
        nodeContentMap,
        materialType,
        id: draftSpeechSkillId, // 注意是拿草稿id去修改话术
        mainId: speechSkillId,
        ChildId: ChildId, // 转话术组需要子话术
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import '../edit.scss';
.flow-set {
  .button-opt {
    @extend .button-opt;
  }
  .tabs-style {
    @extend .tabs-style;
  }
  .content {
    @extend .tabs-style;
  }
}
</style>
