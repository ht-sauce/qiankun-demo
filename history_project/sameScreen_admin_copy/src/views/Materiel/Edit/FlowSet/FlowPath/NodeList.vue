<template>
  <FlowList
    :list="nodeList"
    :done="flowDone"
    :node-template="nodeTemplate"
    @change="onchange"
    @customdrag="oncustomdrag"
    isdrag
    ref="FlowList"
  />
</template>

<script>
import FlowList from '../../components/FlowList'
import { getAllNode, getNodeResources } from '../../glTool'
const Template = {
  id: null,
  name: null,
  videoInfo: {
    url: null, // 回显数据
    videInfo: {
      audioUrl: null,
    },
  },
  productImg: '',
  longImage: '',
}
export default {
  inject: ['word'],
  components: {
    FlowList,
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
      handler(list) {
        this.dataEcho(list)
      },
    },
  },
  props: {
    materialType: Number,
  },
  data() {
    return {
      nodeTemplate: Template,
      flowDone: () => {
        return this.$parent.$refs['nodeContent']?.formCheck()
      },
      nodeList: [],
    }
  },
  methods: {
    onchange(li) {
      this.$emit('change', li)
    },
    // 数据回显
    dataEcho(list) {
      const nodelist = []
      list.forEach(item => {
        // 节点信息回显
        const nodes = getAllNode(item, this.word().nodeContentMap)
        const { id, nodeName, video, image, longImage, audioContent } = getNodeResources(nodes[0])
        const nodeTemp = {
          id,
          name: nodeName,
          videoInfo: {
            ...video._videoEcho,
            videInfo: {
              audioUrl: video._videoEcho.url,
              audioContent,
            },
          },
          productImg: image?.value,
          longImage: longImage?.value,
        }

        nodelist.push(nodeTemp)
      })
      this.nodeList = nodelist

      this.showItem(0)
    },
    // 控制展示哪一项
    showItem(index) {
      this.$nextTick(() => {
        this.$refs['FlowList'].onclick(this.nodeList[index], false)
      })
    },
    // 数据换位回调
    oncustomdrag({ start, end }) {
      // const one = this.NodeList[sindex]
      // const two = this.NodeList[index]
      //
      // this.NodeList.splice(sindex, 1, two)
      // this.NodeList.splice(index, 1, one)
      // this.$emit('customdrag', { sindex, index })
    },
  },
}
</script>

<style scoped lang="scss">
.node-list {
}
</style>
