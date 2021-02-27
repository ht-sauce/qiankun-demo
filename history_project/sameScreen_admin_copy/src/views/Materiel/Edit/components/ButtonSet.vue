<template>
  <background v-loading="loading" title="按钮设置" class="button-set">
    <div class="operation">
      <el-button size="small" type="primary" @click="Save">保存按钮设置</el-button>
    </div>
    <el-form
      class="button-set-content"
      ref="ruleForm"
      label-width="140px"
      label-position="left"
      size="small"
      :rules="formRule"
      :model="formData"
    >
      <!--流程设置展示部分-->
      <template v-if="gActive === 1">
        <div class="title">基础设置</div>
        <el-form-item label="流程结束提示" prop="baseConfig.endFlowTip">
          <el-input class="input-w" v-model="formData.baseConfig.endFlowTip"></el-input>
        </el-form-item>
        <el-form-item label="按钮微动效匹配词" prop="baseConfig.matchWord">
          <el-input class="input-w" v-model="formData.baseConfig.matchWord"></el-input>
        </el-form-item>

        <template v-if="materialInfo.materialType === 2 || materialInfo.materialType === 4">
          <div class="title">流程结束背景视频</div>
          <el-form-item label-width="0" prop="endVideoConfig.videoUrl">
            <BackgroundVideoSet
              :material-type="materialInfo.materialType"
              label-width="140px"
              class="bg-set"
              @change="bgChange"
              is-star
              v-model="formData.endVideoConfig.echo"
              title=""
            />
          </el-form-item>
        </template>
      </template>
      <!--互动设置展示部分-->
      <template v-if="gActive === 2">
        <div class="title">客户端主题选择</div>
        <el-form-item label="主题选择" prop="subject">
          <el-select v-model="formData.subject">
            <el-option
              v-for="item in subjectList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="title">按钮设置</div>
        <el-form-item label="语音互动" prop="voiceButton.enable">
          <el-switch v-model="formData.voiceButton.enable"></el-switch>
        </el-form-item>
        <el-form-item label="跳转按钮" prop="jumpButton.enable">
          <el-switch v-model="formData.jumpButton.enable"></el-switch>
        </el-form-item>
        <div class="jump-button" v-if="formData.jumpButton.enable">
          <el-form-item label-width="100px" label="按钮名称" prop="jumpButton.name">
            <el-input class="input-w" v-model="formData.jumpButton.name"></el-input>
          </el-form-item>
          <el-form-item label-width="100px" label="调整链接" prop="jumpButton.link">
            <el-input class="input-w" v-model="formData.jumpButton.link"></el-input>
          </el-form-item>
        </div>
      </template>
    </el-form>
  </background>
</template>

<script>
import Background from '../components/Background'
import BackgroundVideoSet from '../components/BackgroundVideoSet'
import Service from '@/servicesSauce'
const RS = Service.RS
export default {
  inject: ['glActive'],
  components: {
    Background,
    BackgroundVideoSet,
  },
  computed: {
    // 当前编辑的位置
    gActive() {
      return this.glActive()
    },
  },
  props: {
    materialInfo: Object,
  },
  data() {
    return {
      loading: false,
      // 主题列表
      subjectList: [
        { key: 'v0', label: '默认主题' },
        { key: 'v1', label: '雨花政策' },
      ],
      formData: {
        id: this.materialInfo.id,
        subject: 'v0', // 客户端主题选择
        controlButton: {
          enable: true, // 同屏接管，默认为true，暂无配置
        },
        baseConfig: {
          // 基础设置
          endFlowTip: null,
          matchWord: null,
        },
        voiceButton: {
          enable: false, // 语音互动
        },
        endVideoConfig: {
          // 背景视频设置
          videoUrl: null,
          // 背景视频回显,非小程序关键参数
          echo: {
            url: null,
            radio: null,
            cascaderBackgroundVideo: null,
          },
        },
        jumpButton: {
          enable: false, // 跳转按钮
          name: null,
          link: null,
          // background: null // 该字段暂时无用
        },
      },
      formRule: {
        'baseConfig.endFlowTip': [
          { required: true, message: '请填写流程结束提示', trigger: 'blur' },
        ],
        'jumpButton.name': [
          { required: true, message: '请输入按钮名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        'jumpButton.link': [{ required: true, message: '请输入按钮链接', trigger: 'change' }],
        'endVideoConfig.videoUrl': [
          { required: true, message: '请上传流程结束视频', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(data) {
        this.callEmit('formData', data)
      },
    },
  },
  created() {
    // 初始数据
    this.subjectList = this.$store.state.config.subTitle
    this.Start()
  },
  methods: {
    // 统一事件触发
    callEmit(name, data) {
      if (!name) return
      switch (name) {
        case 'save': {
          this.$emit(name, data)
          break
        }
        case 'formData': {
          this.$emit(name, data)
          break
        }
      }
    },
    // 开始初始化
    async Start() {
      try {
        //console.log(this.materialInfo)
        const params = {
          capabilityId: this.materialInfo.id,
          dataType: 2,
        }
        const res = await RS.ConfigMeterial.query({ data: params })
        //console.log('buttonset', res)
        if (!res.data) throw res
        //console.log(223, res.data)
        const { dataJson, id } = res.data[0]
        this.formData = JSON.parse(dataJson) || {}
        // console.log(this.formData)
        this.formData.id = id

        // 保存事件回调
        // this.$emit('save', this.formData)
      } catch (e) {
        //console.log(e)
      }
    },
    // 保存
    async Save() {
      try {
        await this.formCheck()
        await this.addUpdateConfig()
        // 保存事件回调
        this.$emit('save', this.formData)
        return Promise.resolve()
      } catch (e) {
        console.log(e)
        return Promise.reject(e)
      }
    },
    // 背景设置传递数据
    bgChange(data) {
      this.formData.endVideoConfig = {
        videoUrl: data.url,
        echo: data,
      }
      //console.log(data)
    },
    // 保存校验
    formCheck() {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) resolve(true)
          else reject({ message: '有未填写项' })
        })
      })
    },
    // 新增或者保存配置
    async addUpdateConfig() {
      try {
        this.loading = true
        const params = {
          capabilityId: this.materialInfo.id,
          dataJson: JSON.stringify(this.formData),
          dataType: 2,
          id: this.formData.id,
        }
        const res = await RS.ConfigMeterial.addOrUpdate({ data: params })
        //  成功处理
        this.formData.id = res.data.id
        // this.$message({
        //   message: '配置保存成功！',
        //   type: 'success',
        // })

        this.loading = false
        this.callEmit('save', this.formData)
        return Promise.resolve(res)
      } catch (e) {
        this.loading = false
        return Promise.reject(e)
      }
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .bg-set {
  margin: 0;
  .content {
    padding: 0;
  }
}
.operation {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.button-set {
  ::v-deep .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    padding-left: 10px;
  }
  .input-w {
    width: 500px;
  }
  // 跳转按钮开启内容修饰
  .jump-button {
    padding-top: 15px;
    padding-left: 28px;
    overflow: hidden;
    background: #eeeeee;
  }
  .title {
    font-weight: 600;
    font-size: 14px;
    padding-bottom: 10px;
  }
}
</style>
