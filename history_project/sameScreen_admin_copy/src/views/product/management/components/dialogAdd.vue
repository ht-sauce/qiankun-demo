<template>
	<div>
		<el-dialog title="新增产品" :visible.sync="dialogAdd" width="520px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
			<el-form class="digitalDialog" ref="elForm" :model="formData" :rules="rules" size="small" label-width="100px">
				<el-form-item label="产品名称" prop="name">
					<el-input v-model.trim="formData.name" placeholder="请输入产品名称" :maxlength="20" clearable :style="{ width: '90%' }"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="typeId" >
					<el-select v-model="formData.typeId" filterable clearable @change="handleChangeType" placeholder="请选择产品类型" size="small" style="width:90%;">
						<el-option v-for="item in tempList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<i class="editIcon el-icon-edit-outline" @click="dialogProductSortShow = true"></i>
				</el-form-item>
				<el-form-item label="物料" prop="materialId">
					<el-select v-model="formData.materialId" filterable clearable @change="handleChangeMater" placeholder="请选择营销物料" size="small" style="width:90%;">
						<el-option v-for="item in materialList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<!-- 按钮设置 -->
				<!-- <el-form-item label="按钮设置">
					<div>
						<el-checkbox v-model="formData.button" :true-label="1" :false-label="2">是否展示按钮</el-checkbox>
					</div>
				</el-form-item>
				<div style="padding-left: 15%;" v-if="formData.button == 1">
					<el-form-item label="文字内容" prop="content">
						<el-input v-model.trim="formData.content" placeholder="请输入文字内容" clearable :style="{ width: '90%' }"></el-input>
					</el-form-item>
					<el-form-item label="跳转链接" prop="buyLink">
						<el-input v-model.trim="formData.buyLink" placeholder="请输入购买连接" clearable :style="{ width: '90%' }"></el-input>
					</el-form-item>
				</div> -->
				<!-- <el-form-item label="购买连接" prop="buyLink">
					<el-input v-model.trim="formData.buyLink" placeholder="请输入购买连接" clearable :style="{ width: '90%' }"></el-input>
				</el-form-item> -->
				<el-form-item label="描述" prop="desc" ref="desc">
					<el-input type="textarea" :rows="2" v-model.trim="formData.desc" placeholder="请输入产品描述" :maxlength="200" clearable :style="{ width: '90%' }"></el-input>
				</el-form-item>
				<el-form-item label="封面" prop="coverImg">
					<el-upload
						ref="image"
						list-type="picture-card"
						class="avatar-uploader"
						:action="uploadUrl"
						:show-file-list="false"
						accept=".jpeg,.jpg,.png"
						:on-success="handleCoverImgSuccess"
						:before-upload="beforeCoverImgUpload"
					>
						<img v-if="coverImg" :src="coverImg" class="avatar" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<div style="font-size:10px;color:#ccc">图片格式要求：jpeg,jpg,png，且不超过2M</div>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="cancel()" size="small">取消</el-button>
				<el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
			</div>
		</el-dialog>
		<!-- 产品分类 -->
		<dialogProductSort :dialogProductSortShow.sync="dialogProductSortShow" @handleClose="handleSortClose" @queryType="queryTypefn" />
	</div>
</template>
<script>
import { createProduct, queryType, queryMaterial } from '@/api/robot-ss.js';
import dialogProductSort from '@/components/dialogProductSort.vue';
import axios from 'axios';
export default {
	components: { dialogProductSort },
	props: ['dialogAdd'],
	data() {
		return {
			loading: false,
			dialogProductSortShow: false,
			uploadUrl: this.$config.getConfig('upload'),
			imgShowUrl: this.$config.getConfig('imgShowUrl'),
			formData: {
				name: '',
				typeId: '',
				typeName: '',
				materialId: '',
				materialName: '',
				desc: '',
				coverImg: ''
			},
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入产品名称',
						trigger: 'blur'
					}
				],
				typeId: [
					{
						required: true,
						message: '请选择产品类型',
						trigger: 'change'
					}
				],
				materialId: [
					{
						required: true,
						message: '请选择营销物料',
						trigger: 'change'
					}
				],
				coverImg: [
					{
						required: true,
						message: '请上传产品封面',
						trigger: 'change'
					}
				],
				desc: [
					{
						required: true,
						message: '请输入产品描述',
						trigger: 'change'
					}
				]
			},
			tempList: [],
			materialList: [],
			coverImg: '',
			typeName:'',
			materialName:'',
			notifyInstance: false,
		};
	},
	computed: {},
	created() {},
	watch: {
		dialogAdd: {
			handler: function(val, oldVal) {
				this.resourceName = '';
				this.coverImg='';
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		this.queryTypefn();
		this.queryMaterialFn();
	},
	methods: {
		handleChangeType(val) {
			this.typeName = this.tempList.find(function(item) {
				return item.id === val;
			});
		},
		handleChangeMater(val){
			this.materialName = this.materialList.find(function(item) {
				return item.id === val;
			});
		},
		queryMaterialFn() {
			queryMaterial({
				pageNum: 1,
				pageSize: 10000,
				corpId: this.$storage.getCorpId(),
				status:'1,2',
			}).then(res => {
				if (res.code == 1) {
					this.materialList = res.data.list;
				}
			});
		},
		queryTypefn() {
			queryType({
				pageNum: 1,
				pageSize: 10000,
				corpId: this.$storage.getCorpId()
			}).then(res => {
				if (res.code == 1) {
					this.tempList = res.data.list;
					this.$emit('queryType');
				}
			});
		},
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
		handleSortClose() {
			this.dialogProductSortShow = false;
		},
		handelConfirm() {
			this.formData.corpId = this.$storage.getCorpId();
			const reqData = { ...this.formData };
			reqData.typeName = this.typeName.name;
			reqData.materialName = this.materialName.name;
			this.$refs['elForm'].validate(valid => {
				if (!valid) return;
				createProduct(reqData).then(res => {
					if (res.code != 1) {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: res.message,
							type: 'error'
						});
						return;
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '创建成功',
							type: 'success'
						});
					}
					this.handleClose();
					this.$emit('init');
					this.$refs['elForm'].resetFields();
				});
			});
		},
		beforeCoverImgUpload(file) {
			let isRightSize = file.size / 1024 / 1024 < 2;
			const isJPG = file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
			if (!isJPG) {
				this.$message.error('上传图片只能是 jpg或png或jpeg 格式!');
				return false;
			}
			if (!isRightSize) {
				this.$message.error('文件大小超过 2MB');
			}
			return isRightSize;
		},
		handleCoverImgSuccess(res) {
			this.formData.coverImg = res.data;
			this.coverImg = this.imgShowUrl + res.data;
		},
		// 按钮设置部分代码
		showBuyButtonChange() {

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
	.editIcon {
		font-size: 18px;
		margin-left: 10px;
		vertical-align: middle;
		color: #409eff;
		cursor: pointer;
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
