<template>
  <background class="node-content">
    <!--<div class="operation">
      <el-button size="small" type="primary" @click="formCheck">新增流程</el-button>
    </div>-->
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
      <el-form-item label="流程名称" prop="name">
        <el-input placeholder="请输入名称" v-model="formDataCopy.name" />
      </el-form-item>
      <el-form-item label-width="0" prop="videoInfo">
        <BackgroundVideoSet
          :material-type="materialType"
          label-width="90px"
          class="bg-set"
          :title="materialType === 3 ? '音频选择' : '视频选择'"
          is-star
          v-model="formDataCopy.videoInfo"
        />
      </el-form-item>
      <el-form-item v-if="materialType === 3" label="产品长图" prop="longImage">
        <FileUpload v-model="formDataCopy.longImage" />
      </el-form-item>
      <el-form-item v-else label="产品图片" prop="productImg">
        <FileUpload v-model="formDataCopy.productImg" />
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
      if (!value.url) {
        callback(new Error('请上传资源'))
      } else {
        callback()
      }
    }
    return {
      formDataCopy: this.formData,
      rules: {
        name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
        productImg: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
        longImage: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
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
  .operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
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
