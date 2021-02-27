<template>
  <background
    class="gl-set"
    v-loading="loading"
    title="背景视频设置"
    v-if="materialType === 2 || materialType === 4"
  >
    <el-form ref="ruleForm" size="small" :rules="formRule" :model="formData">
      <el-form-item prop="BackgroundVideoSetEcho">
        <BackgroundVideoSet
          :material-type="materialType"
          title=""
          v-model="formData.BackgroundVideoSetEcho"
          is-star
          @change="onChange"
        />
      </el-form-item>
    </el-form>
  </background>
</template>

<script>
import BackgroundVideoSet from '../../components/BackgroundVideoSet'
import Background from '../../components/Background'
import Service from '@/servicesSauce/index'
import { formCheck } from '../../glTool'
const Rs = Service.RS
export default {
  components: {
    BackgroundVideoSet,
    Background,
  },
  inject: ['word', 'tab'],
  computed: {
    materialType() {
      return this.tab().currentData?.materialType
    },
  },
  watch: {
    materialType: {
      immediate: true,
      handler(t) {
        const id = this.tab().currentData?.speechSkillId
        if (id) this.getConfig(id)
      },
    },
  },
  data() {
    const videoInfo = (rule, value, callback) => {
      console.log(value)
      if (!value.url) {
        callback(new Error('请上传资源'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      formRule: {
        BackgroundVideoSetEcho: [{ validator: videoInfo, trigger: 'blur' }],
      },
      formData: {
        BackgroundVideoSetEcho: {
          url: null,
          radio: null,
          cascaderBackgroundVideo: null,
          videInfo: {
            name: null,
            audioContent: null,
          },
        },
      },
    }
  },
  created() {
    this.GlConfig = null // 全局配置暂存
    this.url = null // 外部取值需要
  },
  methods: {
    // 表单验证
    formCheck() {
      return formCheck('ruleForm', this)
    },
    onChange() {
      const url = this.formData.BackgroundVideoSetEcho.url
      this.updateUrl(url)
    },
    async getConfig(id) {
      try {
        const info = await Rs.GlobalConfig.query({
          speechSkillId: id,
        })
        const GlConfig = JSON.parse(JSON.parse(info.object).globalConfig)
        // 背景视频地址取值，这样做是为了防止话术市场修改值, 显示错误
        const bgvideo = GlConfig.node.backgroundVideo
        const _videoEcho = GlConfig._videoEcho ? GlConfig._videoEcho : { url: null, radio: 1 }
        if (bgvideo.length >= 1) {
          this.url = bgvideo[0]
          _videoEcho.url = bgvideo[0]
        }
        this.formData.BackgroundVideoSetEcho = _videoEcho

        this.GlConfig = GlConfig
      } catch (e) {
        this.GlConfig = null
        return Promise.reject(e)
      }
    },
    async updateUrl(url) {
      // 利用对象传址特性
      // this.currentWord.test = 1
      this.loading = true
      try {
        const globalConfig = this.GlConfig
        let list = globalConfig.node?.backgroundVideo || []
        if (list.length < 1) list.push(url)
        else {
          list = list.map(item => {
            if (this.url === item) return url
            else return item
          })
        }

        globalConfig.node.backgroundVideo = list
        globalConfig._videoEcho = this.formData.BackgroundVideoSetEcho

        await Rs.GlobalConfig.update({
          data: { globalConfig: JSON.stringify(globalConfig) },
        })

        this.url = url
        this.loading = false
      } catch (e) {
        console.log(e)
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.gl-set {
  ::v-deep .content {
    padding: 1px 10px;
  }
}
</style>
