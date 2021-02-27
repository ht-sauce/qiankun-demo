<template>
  <background class="node-content">
    <div class="tips" v-show="!formDataCopy.id">请从左侧列表选择要修改或者查看的数据</div>
    <el-form
      :model="formDataCopy"
      :disabled="!formDataCopy.id"
      :rules="rules"
      ref="ruleForm"
      class="form-con"
      size="small"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="兜底名称" prop="name">
        <el-input v-model="formDataCopy.name" />
      </el-form-item>
      <el-form-item label="图片素材" prop="image">
        <FileUpload v-model="formDataCopy.image" />
      </el-form-item>
      <el-form-item label-width="0" prop="videoInfo">
        <BackgroundVideoSet
          :material-type="materialType"
          label-width="90px"
          class="bg-set"
          title="兜底视频"
          v-model="formData.videoInfo"
          is-star
        />
      </el-form-item>
    </el-form>
  </background>
</template>

<script>
import Background from '../../components/Background'
import BackgroundVideoSet from '../../components/BackgroundVideoSet'
import FileUpload from '../../components/FileUpload'
import { formCheck } from '../../glTool'
export default {
  inject: ['word'],
  components: {
    Background,
    BackgroundVideoSet,
    FileUpload,
  },
  computed: {
    materialType() {
      return this.word().materialType
    },
  },
  props: {
    formData: {
      type: Object,
      default() {
        return {
          videoInfo: {
            url: null,
          },
        }
      },
    },
  },
  watch: {
    formData: {
      deep: true,
      handler(e) {
        this.formDataCopy = e
      },
    },
  },
  data() {
    const videoInfo = (rule, value, callback) => {
      if (!value?.url) {
        callback(new Error('请上传资源'))
      } else {
        callback()
      }
    }
    return {
      formDataCopy: this.formData,
      rules: {
        name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
        image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
        videoInfo: [{ validator: videoInfo, trigger: 'blur' }],
      },
    }
  },
  methods: {
    formCheck() {
      return formCheck('ruleForm', this)
    },
  },
}
</script>

<style scoped lang="scss">
.node-content {
  margin-top: 0;
  width: 700px;
  height: 100%;
  .tips {
    color: #8f8f8f;
    padding-bottom: 10px;
  }
  .form-con {
    background: #fff;
    padding: 10px;
  }
  .bg-set {
    margin: 0;
    background: #fff;
    ::v-deep .content {
      background: #fff;
      padding: 0;
      padding-left: 10px;
    }
  }
}
</style>
