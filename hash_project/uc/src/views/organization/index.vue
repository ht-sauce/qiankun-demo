<style lang="scss" scoped>
.accountList ::v-deep {
	height: 100%;
	position: relative;
	background: #f0f3f6;
	overflow: hidden;

	.contentBox {
		display: flex;
		height: 100%;
		position: relative;
		flex-direction: column;
	}

	.formInline .el-form-item {
		margin-bottom: 0;
	}

	.zhouqi_titleTop {
		.iconfont {
			font-size: 24px;
			margin-right: 6px;
			vertical-align: bottom;
			color: #bfbfbf;
		}
	}

	.tableBox {
		flex: 1;
		height: 100%;
		.zhouqi_lastCol {
			border-bottom: none;
		}
	}

	.paginationDiv {
		padding: 15px;
		background: #fff;
		text-align: right;
	}
	.right {
		float: right;
	}
}
</style>
<template>
	<div class="accountList">
		<div class="contentBox">
			<div class="zhouqi_search_top clear">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline formInline">
					<el-form-item label="企业ID">
						<el-input
							v-model.trim="searchForm.organizationId"
							placeholder="请输入企业ID"
							clearable
							size="small"
						></el-input>
					</el-form-item>

					<el-form-item label="企业名称">
						<el-input
							v-model.trim="searchForm.name"
							placeholder="请输入企业名称"
							clearable
							size="small"
						></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" plain size="small" @click="searchFn"
							>查询</el-button
						>
					</el-form-item>

					<el-form-item class="right">
						<el-button type="primary" size="small" @click="addLog">新增</el-button>
					</el-form-item>
				</el-form>
			</div>

			<div class="tableBox">
				<el-table :data="tableData" height="100%" :header-cell-style="tableHeaderColor">
					<el-table-column prop="id" label="ID"></el-table-column>
					<el-table-column
						prop="name"
						show-overflow-tooltip
						label="企业"
					></el-table-column>
					<el-table-column prop="createTime" label="创建时间">
						<template slot-scope="scope">
							<div class="clear">{{ scope.row.createTime }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="updateTime" label="更新时间">
						<template slot-scope="scope">
							<div class="clear">{{ scope.row.updateTime }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="120">
						<template slot-scope="scope">
							<div class="clear zhouqi_lastCol" style="padding-left: 10px">
								<el-button @click="intoDetail(scope.row)" type="text" size="small"
									>编辑</el-button
								>
								<el-button
									@click="handleDelete(scope.row)"
									type="text"
									size="small"
									class="s-del-text"
									>删除</el-button
								>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="paginationDiv">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[10, 20, 30, 40]"
					:page-size="searchForm.size"
					:current-page="searchForm.page"
					layout="total, prev, pager, next, sizes"
					:total="totalRecord"
				></el-pagination>
			</div>

			<!-- 编辑新增弹框 -->
			<EditDialog
				v-if="showAdd"
				:showDialog="showAdd"
				:rowData="rowData"
				@close="close"
				@addSuccess="addSuccess"
			></EditDialog>
		</div>
	</div>
</template>

<script>
import { queryOrganizationList } from "@/api/organization.js";
import EditDialog from "./editDialog.vue";
export default {
	components: { EditDialog },
	data() {
		return {
			// 当前用户有用按钮权限
			permission_button: JSON.parse(localStorage.getItem("permission_button")),
			showAdd: false,
			size: "",
			isShow: false,
			totalRecord: 0,
			tableData: [],
			showEdit: false,
			rowData: {},
			searchForm: {
				organizationId: "",
				name: "",
				size: 10,
				page: 1,
			},
		};
	},
	filters: {},
	methods: {
		//查询
		searchFn() {
			this.handleCurrentChange(1);
		},
		//每页条数
		handleSizeChange(val) {
			this.searchForm.size = val;
			this.handleCurrentChange(1);
		},
		//翻页
		handleCurrentChange(val) {
			this.searchForm.page = val;
			this.onload();
		},
		onload() {
			this.isShow = true;
			this.isShow = true;
			queryOrganizationList(this.searchForm)
				.then((res) => {
					this.isShow = false;
					if (res.code != "0") {
						return;
					}
					this.tableData = res.data.contents;
					this.totalRecord = res.data.totalElements;
					// this.totalRecord = res.body.totalNum*1;
				})
				.catch();
		},
		intoDetail(d) {
			this.rowData = d;
			this.showAdd = true;
		},
		closeAddOrganization(d) {
			this.showAdd = false;
			if (d == "refresh") {
				this.searchFn();
			}
		},
		closeEditOrganization(d) {
			this.showEdit = false;
			if (d == "refresh") {
				this.onload();
			}
		},
		handleDelete(d) {
			var self = this;
			deleteDialog_comfirm(self).then(() => {
				this.isShow = true;
				let data = {
					id: d.id,
				};
				DeleteOrganization(data)
					.then((res) => {
						if (res.code != "0") {
							this.isShow = false;
							return;
						}
						this.$Notice.success({
							title: "删除成功",
						});
						this.onload();
					})
					.catch();
			});
		},
		// 表头样式
		tableHeaderColor({ row, column, rowIndex, columnIndex }) {
			if (columnIndex === 0) {
				return {
					background: "#F1F8FF",
					color: "#303133",
					border: "0",
				};
			} else {
				return { background: "#F1F8FF", color: "#303133", border: "0" };
			}
		},
		addLog() {
			this.rowData = {};
			this.showAdd = true;
		},
		close() {
			this.showAdd = false;
		},
		async addSuccess() {
			await this.onload();
			this.showAdd = false;
		},
	},
	created() {
		this.onload();
	},
};
</script>
