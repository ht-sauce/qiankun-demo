<template>
	<el-dialog title="新增" :visible.sync="dialogAdd" width="420px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
		<el-form class="digitalDialog" ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
			<el-form-item label="用户名" prop="nickname">
				<el-input v-model.trim="formData.nickname" placeholder="请输入用户名" :maxlength="20" clearable :style="{ width: '90%' }"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model.trim="formData.mobile" placeholder="请输入手机号" :maxlength="20" clearable :style="{ width: '90%' }"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model.trim="formData.password" placeholder="请输入密码" type="password" :maxlength="20" clearable :style="{ width: '90%' }"></el-input>
			</el-form-item>
			<el-form-item label="归属组织" prop="organizationId">
				<el-select v-model="formData.organizationId" filterable clearable placeholder="请选择归属组织" size="small" style="width:90%;">
					<el-option v-for="item in tableData" :key="item.id" :label="item.organizationName" :value="item.organizationId"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="cancel()" size="small">取消</el-button>
			<el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { createUser, queryAllOrganization } from '@/api/user.js';
export default {
	components: {},
	props: ['dialogAdd'],
	data() {
		return {
			loading: false,
			formData: {
				nickname: '',
				mobile: '',
				password: '',
				organizationId: ''
			},
			tableData: [],
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rules: {
				nickname: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}
				],
				mobile: [
					{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					},
					{ pattern:/^((0\d{2,3}-\d{7,8})|(1[3584769]\d{9}))$/, message: "请输入有效手机号", trigger: "blur" }
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					},
					{ min:6,max:20,message: '密码长度为6-20个字符',trigger: 'blur'}
				],
				organizationId: [
					{
						required: true,
						message: '请选择归属组织',
						trigger: 'change'
					}
				]
			},
			notifyInstance: false
		};
	},
	computed: {},
	created() {},
	watch: {
		dialogAdd: {
			handler: function(val, oldVal) {
				this.resourceName = '';
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.queryOrganization();
	},
	methods: {
		handleClose() {
			this.$emit('handleAddClose');
			this.$refs['elForm'].resetFields();
		},
		cancel() {
			this.$emit('handleAddClose');
			this.$refs['elForm'].resetFields();
		},
		closeDialog() {
			this.$emit('handleAddClose');
			this.$refs['elForm'].resetFields();
		},
		queryOrganization() {
			this.loading = true;
			queryAllOrganization({
				corpId: this.$storage.getCorpId(),
				organizationId: '',
				organizationName: '',
				pageSize: 100000,
				pageNumber: 1
			})
				.then(res => {
					if (res.code == 0) {
						this.tableData = res.data;
						this.loading = false;
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: res.message,
							type: 'error'
						});
						this.loading = false;
						return;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		handelConfirm() {
			this.formData.corpId = this.$storage.getCorpId();
			const reqData = { ...this.formData };
			reqData.username = this.formData.mobile;
			this.$refs['elForm'].validate(valid => {
				if (!valid) return;
				createUser(reqData).then(res => {
					if (res.code == 0) {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '新增成功',
							type: 'success'
						});
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance =this.$notify({
							title: '提示',
							message: res.message,
							type: 'error'
						});
						return;
					}
					this.handleClose();
					this.$emit('init');
					this.$refs['elForm'].resetFields();
				});
			});
		},
		beforePostersUpload(file) {
			let isRightSize = file.size / 1024 / 1024 < 5;
			const isJPG = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
			if (!isJPG) {
				this.$message.error('上传图片只能是 jpg或png或jpeg 格式!');
				return false;
			}
			if (!isRightSize) {
				this.$message.error('文件大小超过 5MB');
			}
			return isRightSize;
		},
		beforeResourceUpload(file) {
			this.resourceName = file.name;
			console.log(file);
		},
		beforeBackgroundUpload(file) {
			let isRightSize = file.size / 1024 / 1024 < 5;
			const isJPG = file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
			if (!isJPG) {
				this.$message.error('上传图片只能是 jpg或png或jpeg 格式!');
				return false;
			}
			if (!isRightSize) {
				this.$message.error('文件大小超过 5MB');
			}
			return isRightSize;
		},
		handlePostersSuccess(res) {
			this.formData.posters = res.data;
		},
		handleBackgroundSuccess(res) {
			this.formData.background = res.data;
		},
		handleResourceSuccess(res) {
			this.$refs.resource.clearValidate();
			this.formData.resource = res.data;
		}
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
