<template>
  <el-upload
    :class="type === 'img' ? 'avatar-uploader' : 'file-upload'"
    :action="uploadUrl"
    :show-file-list="false"
    :on-success="uploadSuccess"
    :before-upload="beforeUpload"
  >
    <template v-if="type === 'img'">
      <img v-if="value" :src="showImg(value)" class="avatar" alt="" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </template>
    <template v-if="type === 'file'">
      <div v-if="value" class="file-show">{{ value }}</div>
      <div v-else>
        <el-button type="primary" size="small">上传文件</el-button>
        <span class="tips">请上传10M以内的flv文件</span>
      </div>
    </template>
  </el-upload>
</template>

<script>
import Service from '@/servicesSauce'
const File = Service.File
export default {
  props: {
    value: String,
    type: {
      type: String, // img, file
      default: 'img',
    },
  },
  data() {
    return {
      uploadUrl: File.Rs.FileUploadUrl(),
      imgType: this.$store.state.config.imageType,
    }
  },
  created() {},
  methods: {
    showImg() {
      if (this.value) return this.$store.state.config.imgURL + this.value
      else return ''
    },
    // 提示信息
    tips(title) {
      this.$notify({
        title: '提示',
        message: title,
        type: 'error',
        duration: 1000,
      })
      return false
    },
    uploadSuccess(res) {
      if (!res.success) return this.tips('上传失败！')
      this.$emit('input', res.data)
    },
    imgCheck(file) {
      const testmsg = /^image\/(jpeg|png|jpg|gif|bmp)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!testmsg) return this.tips('上传图片格式不对')
      if (!isLt2M) return this.tips('上传图片大小不能超过 2MB')
      return testmsg && isLt2M
    },
    FileCheck(file) {
      const index = file.name.lastIndexOf('.')
      const ext = file.name.substr(index + 1)

      const isAccept = ext === 'flv'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) return this.tips('文件大小不能超过10MB')
      if (!isAccept) return this.tips('上传文件格式只能是flv')

      return isLt2M && isAccept
    },
    beforeUpload(file) {
      if (this.type === 'img') return this.imgCheck(file)
      if (this.type === 'file') return this.FileCheck(file)
    },
  },
}
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    &:hover {
      border-color: #409eff;
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
.file-upload {
  .file-show {
    color: #409eff;
  }
  .tips {
    padding-left: 10px;
    color: #8b8b8b;
    font-size: 12px;
  }
}
</style>
