<template>
	<div class="digital">
		<div class="toolbar">
			<div class="flex">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline formInline">
					<el-form-item label="ID:">
						<el-input style="width: 150px;" v-model.trim="searchForm.organizationId" clearable placeholder="请输入ID" size="small"></el-input>
					</el-form-item>

					<el-form-item label="组织名称:">
						<el-input style="width: 150px;" v-model.trim="searchForm.organizationName" clearable placeholder="请输入组织名称" size="small"></el-input>
					</el-form-item>
					<el-form-item><el-button type="primary" size="small" class="searchBtn" :disabled="loading" @click="searchFn">查询</el-button></el-form-item>
				</el-form>
			</div>
			<div style="margin-top:5px;"><el-button size="small" type="primary" @click.stop="dialogAdd = true">新增</el-button></div>
		</div>
		<div class="table-layout">
			<div class="table" v-loading="loading">
				<el-table height="100%" :data="tableData" @sort-change="sortChange" highlight-current-row>
					<el-table-column type="index" label="序号"></el-table-column>
					<el-table-column prop="organizationId" label="ID"></el-table-column>
					<el-table-column prop="organizationName" label="组织名称"></el-table-column>
					<el-table-column prop="organizationDesc" label="描述" :show-overflow-tooltip=true width="300"></el-table-column>
					<el-table-column prop="updateTime" sortable label="更新时间">
						<template slot-scope="scope">
							{{ scope.row.updateTime }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click.stop="edit(scope.row)">编辑</el-button>
							<el-button size="small" type="text" @click="showDelConfirm(scope.row.organizationId)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-pagination
				v-if="page.total > 0"
				class="pagination"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[10, 15]"
				:page-size="page.pageSize"
				:current-page="page.pageIndex"
				layout="total, prev, pager, next,sizes"
				:total="page.total"
			></el-pagination>
		</div>
		<!-- 新增界面内容管理 -->
		<dialogAdd :dialogAdd.sync="dialogAdd" @handleAddClose="handleAddClose" @init="init" />
		<!-- 新增界面内容管理 -->
		<dialogEdit :dialogEdit.sync="dialogEdit" @handleEditClose="handleEditClose" :rowObj.sync="rowObj" @init="init" />
	</div>
</template>

<script>
import dialogAdd from './components/dialogAdd.vue';
import dialogEdit from './components/dialogEdit.vue';
import { queryAllOrganization, deleteOrganizationInfo } from '@/api/user.js';
import { getObjValue } from '@/utils/obj.js';
import { formatLongDate } from '@/utils/date.js';
import { downFile } from '@/utils/dom.js';

export default {
	components: {
		dialogAdd,
		dialogEdit
	},
	data: function() {
		return {
			dialogAdd: false,
			dialogEdit: false,
			loading: false,
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rowObj: {},
			tableData: [],
			temp: [],
			searchForm: {
				organizationId: '',
				organizationName: ''
			},
			orderFlag:'desc',
			notifyInstance: false,
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		formatTime(time) {
			return formatLongDate(time);
		},
		searchFn() {
			this.page.pageIndex = 1;
			this.init();
		},
		edit(row) {
			this.rowObj = row;
			this.dialogEdit = true;
		},
		handleAddClose() {
			this.dialogAdd = false;
		},
		handleEditClose() {
			this.rowObj = {};
			this.dialogEdit = false;
		},
		init() {
			this.loading = true;
			queryAllOrganization({
				corpId: this.$storage.getCorpId(),
				organizationName: this.searchForm.organizationName,
				organizationId: this.searchForm.organizationId,
				pageNumber: this.page.pageIndex,
				pageSize: this.page.pageSize,
				orderFlag:this.orderFlag,
			})
				.then(res => {
					if (res.code == 0) {
						this.tableData = res.data;
						this.page.total = res.totalCount;
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
		createSuccess() {
			this.init();
		},
		showDelConfirm(organizationId) {
			this.$confirm('删除后将不可还原，请确认是否删除？', '删除确认', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteOrganizationInfo({
						corpId: this.$storage.getCorpId(),
						organizationId: organizationId
					}).then(
						res => {
							if (res.code == 0) {
								if (this.notifyInstance) {
									this.notifyInstance.close();
								}
								this.notifyInstance = this.$notify({
									title: '提示',
									message: '删除成功',
									type: 'success'
								});
								this.init();
							} else {
								if (this.notifyInstance) {
									this.notifyInstance.close();
								}
								this.notifyInstance = this.$notify({
									title: '提示',
									message: res.message || '删除失败',
									type: 'error'
								});
							}
						},
						() => {
							this.$notify({
								title: '提示',
								message: '网络或服务异常',
								type: 'error'
							});
						}
					);
				})
				.catch(() => {});
		},
		handleSizeChange(size) {
			this.page.pageSize = size;
			this.init();
		},
		handleCurrentChange(page) {
			this.page.pageIndex = page;
			this.init();
		},
		sortChange(column) {
			if (column.order === 'ascending') {
				this.orderFlag = 'asc';
			} else {
				this.orderFlag = 'desc';
			}
			this.init();
		}
	}
};
</script>

<style>
.digital .el-image__error {
	font-size: 10px;
}
</style>

<style scoped lang="scss">
.table-layout {
	margin-top: 10px;
	background-color: #fff;
	padding: 10px 15px;
	min-height: calc(100vh - 136px);
	box-sizing: border-box;
}
.toolbar {
	background-color: #fff;
	padding: 10px;
	border-radius: 2px;
	display: flex;
	justify-content: space-between;
	.el-form-item {
		margin-bottom: 0;
	}
}
.search-btn {
	margin-left: 10px;
}

.table-layout .table {
	height: calc(100vh - 190px);
}
.imgShow {
	width: 60px;
	height: 70px;
}
</style>
