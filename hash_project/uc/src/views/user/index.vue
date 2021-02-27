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

	.searchBtn {
		color: #2284e7 !important;
		background: #e9f3fd !important;
		border-color: #a7cef5 !important;
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
					<el-form-item label="用户账号">
						<el-input
							v-model.trim="searchForm.username"
							placeholder="请输入用户账号"
							clearable
							size="small"
						></el-input>
					</el-form-item>
					<el-form-item label="企业">
						<el-select
							v-model.trim="searchForm.organizationId"
							placeholder="请选择企业"
							filterable
							clearable
							size="small"
							style="width: 100%"
						>
							<el-option
								:label="item.id + ' - ' + item.name"
								:key="item.id"
								:value="item.id"
								v-for="item in organizationList"
							></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button
							type="primary"
							class="searchBtn"
							plain
							size="small"
							@click="searchFn"
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
					<el-table-column label="ID" min-width="100">
						<template slot-scope="scope">
							<span style="width: 88%">{{ scope.row.id }}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="organizationName"
						label="企业名称"
						min-width="100"
					></el-table-column>
					<el-table-column label="用户名称" min-width="100">
						<template slot-scope="scope">
							<span style="width: 88%">{{ scope.row.nickname }}</span>
						</template>
					</el-table-column>
					<el-table-column label="用户账号" min-width="100">
						<template slot-scope="scope">
							<span style="width: 88%">{{ scope.row.username }}</span>
						</template>
					</el-table-column>

					<el-table-column label="角色" min-width="100">
						<template slot-scope="scope">
							<span style="width: 88%">{{ personList[scope.row.roleId] }}</span>
						</template>
					</el-table-column>

					<el-table-column label="创建时间" prop="createTime" min-width="120">
						<template slot-scope="scope">
							<span>{{ scope.row.createTime | formatDateTime }}</span>
						</template>
					</el-table-column>
					<el-table-column label="修改时间" prop="updateTime" min-width="120">
						<template slot-scope="scope">
							<span>{{ scope.row.updateTime | formatDateTime }}</span>
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
import { formatDate } from "@/utils/date.js";
import { queryUserList } from "@/api/user.js";
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
				username: "",
				organizationId: "",
				size: 10,
				page: 1,
			},
			organizationList: [],
			personList: Object.freeze({
				20: "企业管理员",
				21: "坐席",
				22: "操作员",
			}),
		};
	},
	filters: {
		formatDateTime(time) {
			var date = new Date(time);
			return formatDate(date, "yyyy-MM-dd hh:mm:ss");
		},
	},
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
			queryUserList(this.searchForm)
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
		organizationListFn() {
			queryOrganizationList({ page: 1, size: 1000 }).then((res) => {
				if (res.code === 0) {
					this.organizationList = res.data.contents;
				} else {
					this.organizationList = [];
				}
			});
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
		this.organizationListFn();
	},
};
</script>
