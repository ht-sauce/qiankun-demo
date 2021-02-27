<template>
	<div class="batchPlan-container coverElement-checkbox">
		<!-- dialog 批量导入 start -->
		<el-dialog
			title="批量导入"
			:visible.sync="batchImportShow"
			:close-on-click-modal="false"
			width="500px"
			:before-close="closeDialog"
			@close="closeDialog"
			v-loading="batchPlanLoading"
			element-loading-text="拼命加载中"
		>
			<el-form ref="batchPlanForm" label-width="100px">
				<div class="batchUploadWrap">
					<div class="downloadTemp">
						<a class="theme-hostFontColor" download :href="templateUrl">客户信息模板下载</a>
						（如下图示例）
					</div>
					<el-table :data="tableData" style="width: 100%">
						<el-table-column prop="custCompany" label="客户手机号码" width="140"></el-table-column>
						<el-table-column prop="custName" label="kb_answer"></el-table-column>
						<el-table-column prop="phone" label="kb_answer"></el-table-column>
					</el-table>
					<div class="text-tips">请下载模板后将批量导入的客户信息填写完成后批量上传</div>
					<div class="btnUploadBox">
						<el-upload
							:show-file-list="false"
							:action="uploadUrl"
							accept=".xlsx"
							:before-upload="beforeUpload"
							:on-success="uploadSuccess"
							style="text-align:center;"
						>
							<el-button icon="el-icon-upload" type="primary" plain size="small">上传名单</el-button>
						</el-upload>
					</div>
					<div class="tip">
						<!-- <p class="checkbox">
                <el-checkbox v-model="checked" style="margin-right:8px"></el-checkbox>上传的客户号码与系统中客户号码重复时则更新重复号码的客户信息
              </p> -->
						<p class="text">1.请仔细检查Excel的表头是否符合第一步展示的要求，避免导入失败；</p>
						<p class="text">2.只能上传xls/xlsx/csv文件,且不超过5MB；</p>
						<p class="text">3.提示：已完成任务导入号码后将会即刻开始拨打，请确认是否导入。</p>
					</div>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
export default {
	props: {
		batchImportShow: {
			required: true,
			type: String
		}
	},
	data() {
		return {
			Theme: localStorage.getItem('theme'),
			tableData: [{ phone: '数据', custCompany: '1952023****', custName: '数据' }],
			// 上传文件的信息
			uploadUrl: '',
			uploadData: {
				taskId: this.task.taskId,
				taskDataType: 2
			}
		};
	},
	computed: {
		templateUrl() {
			return this.$config.formatSSUrl('/taskTemplate.xlsx', this.bizId);
		}
	},
	mounted() {
		//this.uploadUrl = getUploadDataUrl();
	},
	methods: {
		closeDialog() {
			this.$emit('handleClose');
		},
		beforeUpload(file) {
			let orgFileName = file ? file.name.toLocaleLowerCase() : '',
				suffix = orgFileName ? orgFileName.substring(orgFileName.lastIndexOf('.') + 1) : '';
			if (['xlsx'].indexOf(suffix) < 0) {
				this.$notify({
					title: '提示',
					message: '文件格式不正确，请使用模板上传',
					type: 'error'
				});
				return false;
			}
			return true;
		},
		uploadSuccess(resp) {
			if (resp.code != 0) {
				this.$notify({
					title: '提示',
					message: resp.message || '外呼名单上传失败',
					type: 'error'
				});
			} else {
				this.$notify({
					title: '提示',
					message: '外呼名单上传成功',
					type: 'success'
				});
				this.closeDialog();
				this.$emit('loadTable');
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.tip {
	width: 90%;
	text-align: left;
	font-size: 12px;
	line-height: 1.7;
	.checkbox {
		margin-bottom: 10px;
	}
	.text {
		color: #f56c6c;
	}
}
.el-form-item {
	padding-right: 20px;
	margin-bottom: 20px;
}
.theme-hostColor {
	background-color: #5492ff;
}

.batchPlan-container {
	.el-dialog {
		min-width: 400px;
	}
	.batchUploadWrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		.text-tips {
			width: 100%;
			height: 24px;
			line-height: 24px;
			color: #f56c6c;
			font-size: 12px;
			text-align: center;
			margin-top: 40px;
		}
		.btnUploadBox {
			width: 100%;
			margin-top: 20px;
			input {
				display: none;
			}
			p {
				text-align: center;
				font-size: 12px;
				color: #999;
				margin-top: 6px;
			}
			.batchUploadBtn {
				display: block;
				margin: auto;
				width: 400px;
				height: 40px;
				line-height: 40px;
				color: #fff;
				// background-color: #3f9ffe;
				text-align: center;
			}
		}
		.downloadTemp {
			width: 100%;
			color: #333;
			font-size: 12px;
			margin-bottom: 20px;
			a {
				display: inline-block;
				text-decoration: underline;
				font-size: 16px;
			}
		}
	}
}
</style>
