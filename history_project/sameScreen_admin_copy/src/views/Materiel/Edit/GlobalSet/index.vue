<template>
  <div v-loading="loading" class="global-set">
    <el-form
      :model="formData"
      :rules="rules"
      :inline="true"
      ref="ruleForm"
      label-width="120px"
      size="small"
      class="formStyle"
    >
      <el-form-item label="支持类型" prop="capabilityPatternDTOList">
        <!--话术类型-->
        <el-checkbox-group v-model="formData.capabilityPatternDTOList">
          <el-checkbox :label="1">基础视频版</el-checkbox>
          <el-checkbox :label="2">3D视频版</el-checkbox>
          <el-checkbox :label="3">图文版</el-checkbox>
          <el-checkbox :label="4">2D真人版</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="name" label="物料名称">
        <el-input class="form-input" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item prop="desc" label="物料描述">
        <el-input class="form-input" v-model="formData.desc"></el-input>
      </el-form-item>
      <el-form-item label=" " style="display: block">
        <div style="color: #8f8f8f;font-size: 12px;">
          只能上传jpg/png/gif/jpeg/bmp文件，不超过2M
        </div>
      </el-form-item>
      <el-form-item prop="coverDefault" label="默认封面">
        <FileUpload v-model="formData.coverDefault" />
      </el-form-item>
      <el-form-item prop="coverShare" label="分享封面">
        <FileUpload v-model="formData.coverShare" />
      </el-form-item>
      <el-form-item prop="loadUrl" label="加载页图片">
        <FileUpload v-model="formData.loadUrl" />
      </el-form-item>
      <el-form-item prop="defaultBgImgUrl" label="默认背景图片">
        <FileUpload v-model="formData.defaultBgImgUrl" />
      </el-form-item>
      <el-form-item prop="endImgUrl" label="同屏结束营销">
        <FileUpload v-model="formData.endImgUrl" />
      </el-form-item>
      <!--<el-form-item prop="defaultImgUrl" label="默认介绍图片">
        <ImgUpload v-model="formData.defaultImgUrl" />
      </el-form-item>
      <el-form-item prop="defaultWholeImgUrl" label="默认背景长图">
        <ImgUpload v-model="formData.defaultWholeImgUrl" />
      </el-form-item>-->
    </el-form>
    <div class="opt">
      <el-button type="primary" size="small" class="opt-but" @click="nextPage">下一步</el-button>
      <el-button type="primary" size="small" class="opt-but" @click="Save">保存</el-button>
    </div>
  </div>
</template>

<script>
import FileUpload from '../components/FileUpload'
import { mapState } from 'vuex'
import Service from '@/servicesSauce'
const { RS } = Service
import { formCheck } from '../glTool'
export default {
  components: { FileUpload },
  inject: ['getTabData', 'EditUpperOrNext', 'setTabData'],
  computed: {
    ...mapState('user', ['userName']),
  },
  data() {
    return {
      loading: false,
      formData: {
        id: null,
        capabilityPatternDTOList: [2],
        corpId: this.$store.state.userInfo.corpid,
        name: null,
        desc: null,
        coverDefault: null,
        coverShare: null,
        defaultBgImgUrl: null,
        defaultImgUrl: null,
        defaultWholeImgUrl: null,
        endImgUrl: null,
        loadUrl: null,
        username: this.userName, // 用户名称
      },
      rules: {
        name: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入物料描述', trigger: 'blur' }],
        coverDefault: [{ required: true, message: '请上传默认产品封面', trigger: 'blur' }],
        coverShare: [{ required: true, message: '请上传分享封面', trigger: 'blur' }],
        loadUrl: [{ required: true, message: '请上传加载图', trigger: 'blur' }],
        endImgUrl: [{ required: true, message: '请上传同屏结束营销图', trigger: 'blur' }],
        defaultBgImgUrl: [{ required: true, message: '请上传默认背景图', trigger: 'blur' }],
      },
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.formSetInt = this.formSetInt + 1
      },
    },
  },
  async created() {
    this.formSetInt = 0 // 标识表单修改次数

    const row = this.getTabData()?.row
    if (!row) return

    const info = await this.getInfo(row.id)
    this.setTabData({ row: JSON.parse(JSON.stringify(info)) }) // 更新row数据，防止因为未修改导致数据错误

    // 数据需要进行格式化
    info.capabilityPatternDTOList = info.capabilityPatternDTOList.map(li => {
      return li.materialType
    })

    this.formData = info // 把初始数据展示出来
  },
  methods: {
    // 获取详情
    async getInfo(id) {
      try {
        const result = await RS.materiel.query({ data: { materialId: id } })
        return Promise.resolve(result.object)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async nextPage() {
      //console.log(this.formSetInt)
      // 当表单修改次数大于1则代表修改过，需要执行保存逻辑
      try {
        await this.formCheck()
        if (!this.formData.id) await this.Save()
        if (this.formSetInt > 1) await this.Save()
        this.EditUpperOrNext('next')
      } catch (e) {
        console.log(e)
      }
    },
    async Save() {
      this.loading = true
      try {
        await this.formCheck()
        let params = this.getParams()

        let result = {}
        if (params.id) result = await RS.materiel.update({ data: params, success: '保存成功' })
        else result = await RS.materiel.add({ data: params, success: '保存成功' })

        const data = result.object
        if (data && data.length > 0) {
          this.formData.id = result.object[0].materialId
          params = this.getParams()
        }

        const tabdata = this.getTabData()
        tabdata.row = params
        tabdata.row.capabilityPatternDTOList = data
        this.setTabData(tabdata)

        this.loading = false
        return Promise.resolve(true)
      } catch (e) {
        this.loading = false
        console.log(e)
        return Promise.reject(false)
      }
    },
    // 获取参数接口，上传之前进行处理
    getParams() {
      const formData = JSON.parse(JSON.stringify(this.formData))

      const dto = this.getTabData()?.row?.capabilityPatternDTOList
      const dtoMap = new Map()
      dto?.forEach(li => {
        dtoMap.set(li.materialType, li)
      })

      formData.capabilityPatternDTOList = formData.capabilityPatternDTOList.map(li => {
        let item = {
          materialType: li,
        }
        // 历史数据需要保留复原
        const dtoli = dtoMap.get(li)
        if (dtoli) item = dtoli
        // 新增的项需要增加id
        if (formData?.id) item.materialId = formData.id

        return item
      })

      formData.username = this.userName
      formData.corpId = this.$storage.getCorpId()
      return formData
    },
    formCheck() {
      return formCheck('ruleForm', this)
    },
  },
}
</script>

<style scoped lang="scss">
.global-set {
  display: flex;
  .formStyle {
    width: 1000px;
  }
  .opt {
    display: flex;
    left: 1045px;
    position: fixed;
    .opt-but {
      margin: 5px;
      width: 100px;
    }
  }

  .form-input {
    width: 500px;
  }
}
</style>
