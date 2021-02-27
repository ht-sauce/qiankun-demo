<template>
  <FlowList
    :node-template="FlowList.temp"
    :done="FlowList.flowDone"
    :list="FlowList.NodeList"
    @change="onchange"
    ref="FlowList"
  />
</template>

<script>
import FlowList from '../../components/FlowList'
import { getManyNodeResources } from '../../glTool'
export default {
  components: {
    FlowList,
  },
  inject: ['word'],
  props: {
    materialType: Number,
  },
  computed: {
    bottomTree() {
      return this.word().bottomTree
    },
  },
  watch: {
    bottomTree: {
      deep: true,
      immediate: true,
      handler(bottom) {
        this.listEcho(bottom)
      },
    },
  },
  data() {
    return {
      FlowList: {
        temp: {
          name: null,
          videoInfo: null, // 回显数据
          image: '',
        },
        NodeList: [],
        flowDone: () => {
          return this.$parent.$refs['nodeContent'].formCheck()
        },
      },
    }
  },
  methods: {
    listEcho(tree = {}) {
      if (!tree) {
        this.FlowList.NodeList = []
        this.showItem(0)
        return null
      }
      const { nodeContentMap } = this.word()
      const bottom = nodeContentMap.get(tree?.next?.id)
      const Resources = getManyNodeResources(bottom)
      const nodeList = []
      Resources.forEach((item, index) => {
        const { text, image, video, audioContent } = item
        const temp = {
          id: index + 1,
          name: text?.value,
          videoInfo: {
            ...video._videoEcho,
            videInfo: {
              audioUrl: video._videoEcho.url, // 避免数据丢失
              audioContent,
            },
          }, // 回显数据
          image: image?.value,
        }
        nodeList.push(temp)
      })

      this.FlowList.NodeList = nodeList
      this.showItem(0)
    },
    onchange(li) {
      this.$emit('change', li)
    },
    // 控制展示哪一项
    showItem(index) {
      this.$nextTick(() => {
        this.$refs['FlowList'].onclick(this.FlowList.NodeList[index], false)
      })
    },
  },
}
</script>

<style scoped lang="scss">
.node-list {
}
</style>
