<template>
  <background class="node-content">
    <div class="tips" v-show="!formData.id">请从左侧列表选择要修改或者查看的数据</div>
    <el-form
      :model="formData"
      :disabled="!formData.id"
      :rules="rules"
      ref="ruleForm"
      class="form-con"
      size="small"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="问题描述" prop="label">
        <el-input type="textarea" :rows="2" v-model="formData.label" />
      </el-form-item>
      <el-form-item label="问题标签" prop="tag">
        <el-input type="textarea" :rows="2" v-model="formData.tag" />
      </el-form-item>
      <el-form-item label="场景问法" prop="rules">
        <el-input type="textarea" :rows="4" v-model="formData.rules" />
      </el-form-item>
      <el-form-item label-width="0" prop="videoInfo">
        <BackgroundVideoSet
          :material-type="materialType"
          label-width="90px"
          class="bg-set"
          title="问题视频"
          is-star
          v-model="formData.videoInfo"
        />
      </el-form-item>
      <el-form-item label="背景长图">
        <FileUpload v-model="formData.image" />
      </el-form-item>
      <el-form-item label="客户可见">
        <el-checkbox :true-label="1" :false-label="2" v-model="formData.isVisual"></el-checkbox>
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
  components: {
    Background,
    BackgroundVideoSet,
    FileUpload,
  },
  props: {
    materialType: Number,
    item: Object,
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(e) {
        this.formData = e || {}
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
    const SpecialCharacters = (rule, value, callback) => {
      const reg = new RegExp(
        //"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]",
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/~！@#￥……&*（）——|{}【】‘；：”“'。，、]",
      )
      if (reg.exec(value)) {
        callback(new Error('不允许输入除问号外字符'))
      } else {
        callback()
      }
    }

    return {
      formData: {
        image: null,
        label: null,
        tag: null,
        rules: null,
        videoInfo: null,
        isVisual: 1,
      },
      rules: {
        label: [
          { required: true, message: '请输入描述信息', trigger: 'blur' },
          { validator: SpecialCharacters, trigger: 'blur' },
        ],
        tag: [{ required: true, message: '请输入问题标签', trigger: 'blur' }],
        image: [{ required: true, message: '请上传产品图片', trigger: 'blur' }],
        rules: [{ required: true, message: '请输入场景问法', trigger: 'blur' }],
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
  margin-bottom: 0;
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
