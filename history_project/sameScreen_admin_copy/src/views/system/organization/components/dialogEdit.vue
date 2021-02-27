<template>
	<el-dialog title="编辑" :visible.sync="dialogEdit" width="420px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
		<el-form class="digitalDialog" ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
			<el-form-item label="组织名称" prop="organizationName">
				<el-input v-model.trim="formData.organizationName" placeholder="请输入组织名称" :maxlength="20" clearable :style="{ width: '90%' }"></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="organizationDesc" ref="organizationDesc">
				<el-input type="textarea" :rows="2" v-model.trim="formData.organizationDesc" placeholder="请输入描述" :maxlength="200" clearable :style="{ width: '90%' }"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="cancel()" size="small">取消</el-button>
			<el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
import _ from 'lodash';
import { modifyOrganizationInfo } from '@/api/user.js';
export default {
	inheritAttrs: false,
	components: {},
	props: ['dialogEdit', 'rowObj'],
	data() {
		return {
			loading: false,
			uploadUrl: this.$config.getConfig('upload'),
			formData: {
				organizationName: '',
				organizationDesc: ''
			},
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rules: {
				organizationName: [
					{
						required: true,
						message: '请输入组织名称',
						trigger: 'blur'
					}
				],
				organizationDesc: [
					{
						required: true,
						message: '请输入描述',
						trigger: 'blur'
					}
				]
			},
			notifyInstance:false
		};
	},
	computed: {},
	watch: {
		rowObj(newObj, oldObj) {
			this.formData = _.cloneDeep(newObj);
		},
		immediate: true,
		deep: true
	},
	created() {},
	mounted() {
	},
	methods: {
		handleClose() {
			this.$emit('handleEditClose');
			this.$refs['elForm'].resetFields();
		},
		cancel() {
			this.$emit('handleEditClose');
			this.$refs['elForm'].resetFields();
		},
		closeDialog() {
			this.$emit('handleEditClose');
			this.$refs['elForm'].resetFields();
		},
		handelConfirm() {
			this.formData.corpId = this.$storage.getCorpId();
			const reqData = { ...this.formData };
			this.$refs['elForm'].validate(valid => {
				if (!valid) return;
				modifyOrganizationInfo(reqData).then(res => {
					if (res.code == 0) {
						if(this.notifyInstance){
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '修改成功',
							type: 'success'
						});
					} else {
						if(this.notifyInstance){
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: res.message,
							type: 'error'
						});
					}
					this.handleClose();
					this.$emit('init');
					this.$refs['elForm'].resetFields();
				});
			});
		},
	}
};
</script>
<style scoped lang="scss">
.digitalDialog {
	.avatar {
		width: 100px;
		height: 100px;
	}
	.avatar-uploader {
		display: inline-block;
	}
}
</style>
<style>
.digitalDialog .el-upload--picture-card {
	width: 102px;
	height: 102px;
	line-height: 102px;
}
</style>
