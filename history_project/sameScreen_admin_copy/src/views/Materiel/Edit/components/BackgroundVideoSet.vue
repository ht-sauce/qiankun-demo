<template>
  <background :title="title" class="background-video-set">
    <div class="item-one">
      <label :style="{ width: labelWidth }">视频选择：</label>
      <div class="item-con">
        <el-radio @change="onchange" v-model="radio" :label="1">本地视频</el-radio>
        <el-radio @change="onchange" v-model="radio" :label="2">编辑器视频</el-radio>
      </div>
    </div>
    <div class="item-two">
      <label :style="{ width: labelWidth }">
        <span v-if="isStar" class="star">*</span>
        <span>{{ materialType === 3 || materialType === 1 ? '音频文件' : '视频文件' }}：</span>
      </label>
      <!--本地视频上传-->
      <div v-if="radio === 1">
        <FileUpload type="file" @input="onchange" v-model="backgroundVideo" />
      </div>
      <div v-if="radio === 2" class="flex">
        <el-cascader
          size="small"
          :props="cascader"
          v-model="cascaderBackgroundVideo"
          :options="cascaderOptions"
          @change="onchange"
          style="width: 280px"
        ></el-cascader>
      </div>
    </div>
    <!--<div v-show="!isEdit" class="tips">
      <div>您是否在高级功能中编辑视频?请使用本地视频或前往话术市场编辑</div>
      <div>原视频地址：{{ value && value.url }}</div>
    </div>-->
  </background>
</template>

<script>
import Background from './Background'
import FileUpload from './FileUpload'
import Service from '@/servicesSauce'
import { Store } from '../store'

export default {
  components: {
    Background,
    FileUpload,
  },
  inject: [],
  props: {
    isStar: Boolean,
    labelWidth: String,
    title: {
      type: String,
      default: '背景视频设置',
    },
    materialType: Number,
    // 回显数据结构，当value值变化的时候回显结构是保证数据展示的来源
    value: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    // 是否传输音频地址
    isAudio() {
      return this.materialType === 3 || this.materialType === 1
    },
  },
  data() {
    return {
      radio: 2,
      backgroundVideo: '',
      cascaderBackgroundVideo: [],
      // 懒加载级联数据
      cascader: {
        lazy: true,
        lazyLoad: this.cascaderLazyLoad,
      },
      cascaderOptions: [], // 级联回显需要
      isEdit: true, // 是否可以编辑
    }
  },
  watch: {
    value: {
      deep: true,
      async handler(data) {
        const { url, radio, cascaderBackgroundVideo } = data || {}
        if (!url) {
          this.backgroundVideo = ''
          this.cascaderBackgroundVideo = []
          return
        }

        this.Start()

        this.oneNodes = [
          { value: 1, label: '剧本', leaf: false, children: [] },
          { value: 2, label: '视频', leaf: false, children: [] },
        ]

        let isUrl = true
        if (radio === 1) this.backgroundVideo = url
        if (radio === 2) isUrl = await this.EchoCascader(cascaderBackgroundVideo, url)

        this.radio = radio
        // 为了兼容下老数据展示
        if (!radio || !cascaderBackgroundVideo) {
          this.radio = 1
          this.backgroundVideo = url
        }

        this.isEdit = isUrl
      },
    },
  },
  async created() {
    this.Start()
    // const isurl = await this.EchoCascader([2, "/vse/common/632061055354413056.flv"], "/vse/common/632061055354413056.flv")
    // console.log(1, isurl)
  },
  methods: {
    Start() {
      // 一级菜单数据
      this.oneNodes = [
        { value: 1, label: '剧本', leaf: false, children: [] },
        { value: 2, label: '视频', leaf: false, children: [] },
      ]
    },
    // 数据返回给父级
    async onchange() {
      // v-model返回的地址信息
      let url = ''
      let info = {} // 剧本或者视频的详情信息
      switch (this.radio) {
        case 1: {
          url = this.backgroundVideo
          break
        }
        case 2: {
          const [type, one, two] = this.cascaderBackgroundVideo
          // 剧本
          if (type === 1) {
            const dramas = await this.getDrama(one)
            info = dramas.filter(
              item => (this.isAudio ? item.audioConfigDTOList[0].url : item.url) === two,
            )[0]
            url = two
          }
          // 选择视频
          if (type === 2) {
            const videos = await this.getAllVideo()
            info = videos.filter(item => (this.isAudio ? item.audioUrl : item.url) === one)[0]
            url = one
          }
          break
        }
      }
      info = info || {}
      const videInfo = {
        name: info?.videoName ? info.videoName : url,
        audioContent: info?.audioContent
          ? info.audioContent
          : info.audioConfigDTOList && info?.audioConfigDTOList[0].content,
        audioUrl: info.audioConfigDTOList ? info.audioConfigDTOList[0].url : null,
      }
      const redata = {
        url, // 给话术市场的地址
        videInfo, // 当前剧本或者视频的详细信息
        radio: this.radio, // 本地视频，还是编辑器视频
        cascaderBackgroundVideo: this.cascaderBackgroundVideo,
      }
      // console.log(redata)
      this.$emit('input', redata)
      // 返回当前选择的数据
      this.$emit('change', redata)
    },
    // 懒加载数据
    async cascaderLazyLoad(node, resolve) {
      const { level, value } = node

      let nodes = []
      switch (level) {
        case 0:
          nodes = this.oneNodes
          break
        case 1: {
          const allVideo = await this.getAllVideo()

          const handler = (type, li) => {
            const item = {
              ...li,
              label: li.videoName,
            }
            switch (type) {
              // 剧本选择
              case 1: {
                item.leaf = false
                item.value = li.videoCode
                break
              }
              // 视频选择
              case 2: {
                item.leaf = true
                item.value = this.isAudio ? li.audioUrl : li.url // 兼容音频
              }
            }

            if (item.value) return item
            else return null
          }

          allVideo.forEach(li => {
            const item = handler(value, li)
            if (item) nodes.push(item)
          })
          break
        }
        case 2: {
          // 剧本选择的第三步
          const list = await this.getDrama(value)
          // console.log(list)
          list.forEach(li => {
            const _url = this.isAudio ? li.audioConfigDTOList[0].url : li.url
            if (_url)
              nodes.push({
                label: li.dramaCode,
                value: _url,
                leaf: true,
              })
          })
          break
        }
      }
      resolve(nodes)
    },
    // 级联数据回显, 第二个url用来检测当前url是否在列表内
    async EchoCascader(arr = [], url) {
      let isUrl = false // 用来标识传入url是否存在的问题
      const [type, two] = arr // arr结构是onchange返回给外界的数据格式
      const opts = this.oneNodes

      const allVideo = await this.getAllVideo()

      // 剧本视频地址
      const drList = async code => {
        const list = await this.getDrama(code)
        const children = []
        list.forEach(dr => {
          const _url = this.isAudio ? dr.audioConfigDTOList[0].url : dr.url
          if (_url) {
            if (_url === url) {
              isUrl = true
            }
            children.push({
              label: dr.dramaCode,
              value: _url,
              leaf: true,
            })
          }
        })
        return children
      }
      // 二级数据处理, 剧本或者视频地址
      const handler = async (T, li) => {
        const item = {
          ...li,
          label: li.videoName,
        }
        switch (T) {
          case 1: {
            item.value = li.videoCode
            item.leaf = false
            item.children = []
            if (li.videoCode === two) item.children = await drList(li.videoCode)
            break
          }
          case 2: {
            const _url = this.isAudio ? li.audioUrl : li.url
            item.value = _url
            item.leaf = true
            if (_url === url) isUrl = true
            break
          }
        }

        if (item.value) return Promise.resolve(item)
        else return Promise.resolve(null)
      }

      // 当多层forEach的时候还是有异步问题
      for (let i = 0; i < allVideo.length; i++) {
        const li = allVideo[i]
        const res = await handler(type, li)
        if (res)
          switch (type) {
            case 1: {
              opts[0].children.push(res)
              break
            }
            case 2: {
              opts[1].children.push(res)
              break
            }
          }
      }

      this.cascaderOptions = opts
      this.cascaderBackgroundVideo = arr

      return isUrl
    },
    // 获取剧本, code：视频code
    async getDrama(code) {
      try {
        const typeData = Store.AllDrama.get(code)
        if (typeData) return Promise.resolve(typeData)

        const res = await Service.RS.queryDramaConfigList(code)
        // console.log(111, res.object)
        Store.AllDrama.set(code, res.object)
        return Promise.resolve(res.object)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 获取所有视频
    async getAllVideo() {
      if (!this.materialType) {
        this.$notify({
          message: '视频选择组件缺少关键参数，请退出重试',
          type: 'error',
        })
      }
      try {
        const materialType = this.materialType
        const typeData = Store.AllVideo.get(materialType)
        if (typeData) return Promise.resolve(typeData)

        const params = {
          corpId: this.$storage.getCorpId(),
          synthesisMode: this.$config.getConfig('synthesisMode'),
          videoName: '',
          status: '1',
          pageSize: 1000,
          pageNumber: 1,
          materialType: materialType === 3 ? 2 : this.materialType,
        }
        const res = await Service.RS.queryVideoListAll({ data: params })
        // console.log(111, res.object)
        Store.AllVideo.set(materialType, res.object)
        return Promise.resolve(res.object)
      } catch (e) {
        return Promise.reject(e)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.background-video-set {
  .item-one {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    .item-con {
      margin-bottom: -6px;
    }
  }
  .item-two {
    display: flex;
    align-items: center;
    .star {
      position: absolute;
      display: inline-block;
      margin-top: 2px;
      margin-left: -8px;
      color: #ff4647;
    }
  }
  .tips {
    padding: 10px 0 0 70px;
    font-size: 12px;
    color: #8b8b8b;
    white-space: pre-wrap;
    > div {
      padding: 0;
      line-height: 14px;
    }
  }
}
</style>
