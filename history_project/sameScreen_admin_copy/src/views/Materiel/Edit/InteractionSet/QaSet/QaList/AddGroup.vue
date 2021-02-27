<template>
  <el-popover placement="right" width="300" trigger="manual" v-model="show">
    <el-form
      :model="formData"
      :rules="rules"
      ref="ruleForm"
      size="small"
      label-position="left"
      class="add-group"
    >
      <el-form-item prop="groupName">
        <el-input v-model="formData.groupName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="confirm" @click="save" :loading="loading" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
    <el-button :loading="loading" slot="reference" @click="show = !show" size="small" type="primary"
      >新增分类</el-button
    >
  </el-popover>
</template>

<script>
import Service from '@/servicesSauce'
import { formCheck } from '../../../glTool'
export default {
  inject: ['word', 'getTabData'],
  data() {
    return {
      loading: false,
      show: false,
      formData: {
        groupName: null,
      },
      rules: {
        groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 添加分组关系
    async addGroup() {
      try {
        const data = {
          corpId: this.$store.state.userInfo.corpid,
          groupName: this.formData.groupName,
          materialId: this.getTabData().row.id,
          materialType: this.word().materialType,
        }
        const list = await Service.RS.QaGroup.add({ data })
        return Promise.resolve(list.data)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    formCheck() {
      return formCheck('ruleForm', this)
    },
    // 保存
    async save() {
      try {
        this.loading = true
        await this.formCheck()
        const data = await this.addGroup()
        this.$emit('save', data)
        this.show = false
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
.add-group {
  .confirm {
    margin-left: 215px;
  }
}
</style>
