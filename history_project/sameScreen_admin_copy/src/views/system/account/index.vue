<template>
	<div class="digital">
		<div class="toolbar">
			<div class="flex">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline formInline">
					<el-form-item label="手机号:">
						<el-input style="width: 150px;" v-model.trim="searchForm.mobile" clearable placeholder="请输入手机号" size="small"></el-input>
					</el-form-item>

					<el-form-item label="用户名:">
						<el-input style="width: 150px;" v-model.trim="searchForm.username" clearable placeholder="请输入用户名" size="small"></el-input>
					</el-form-item>
					<el-form-item><el-button type="primary" size="small" class="searchBtn" :disabled="loading" @click="searchFn">查询</el-button></el-form-item>
				</el-form>
			</div>
			<div style="margin-top:5px;">
				<!-- <el-button size="small" type="primary" @click="batchImport()">批量导入</el-button> -->
				<el-button size="small" type="primary" @click.stop="dialogAdd = true">新增</el-button>
			</div>
		</div>
		<div class="table-layout">
			<div class="table" v-loading="loading">
				<el-table height="100%" :data="tableData" @sort-change="sortChange" highlight-current-row>
					<el-table-column type="index" label="序号"></el-table-column>
					<el-table-column prop="nickname" label="用户名"></el-table-column>
					<el-table-column prop="mobile" label="手机号"></el-table-column>
					<el-table-column prop="organizationName" label="归属组织"></el-table-column>
					<el-table-column prop="imGroup" label="已分配产品数">
						<template slot-scope="scope">
							<span @click="editManage(scope.row, manageData)" style="color:#409EFF;cursor:pointer;">{{ scope.row.productUserRelDTOList.length }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="updateTime" sortable label="更新时间">
						<template slot-scope="scope">
							{{ scope.row.updateTime || '--' }}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click.stop="edit(scope.row)">编辑</el-button>
							<el-button size="small" type="text" @click="showDelConfirm(scope.row.id)">删除</el-button>
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
		<dialogEdit :dialogEdit.sync="dialogEdit" @handleClose="handleClose" :rowObj.sync="rowObj" @init="init" />
		<!-- 管理 -->
		<dialogManage v-if="dialogManage" :dialogManage.sync="dialogManage" @handleClose="handleClose" :title.sync="title" @init="init" :manageData.sync="manageData" :rowObj.sync="rowObj" />
		<!-- 批量导入 -->
		<!-- <batchImportDialog :batchImportShow.sync="batchImportShow" @handleClose="handleClose" @init="init" /> -->
	</div>
</template>

<script>
import { queryUserListByPage, deleteUser } from '@/api/user.js';
import { queryAllProductList } from '@/api/robot-ss.js';
import dialogAdd from './components/dialogAdd.vue';
import dialogEdit from './components/dialogEdit.vue';
import dialogManage from '@/components/dialogManage.vue';
// import batchImportDialog from '@/components/batchImportDialog.vue';
import { getObjValue } from '@/utils/obj.js';
import { downFile } from '@/utils/dom.js';
import moment from 'moment';

export default {
	components: {
		dialogAdd,
		dialogEdit,
		dialogManage
		// batchImportDialog
	},
	data: function() {
		return {
			dialogAdd: false,
			dialogEdit: false,
			dialogManage: false,
			batchImportShow: false,
			loading: false,
			title: '产品管理',
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rowObj: {},
			tableData: [],
			temp: [],
			searchForm: {
				mobile: '',
				username: ''
			},
			manageData: [],
			orderFlag:'desc',
			notifyInstance: false
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		formatTime(time) {
			return moment(time).format('YYYY-MM-DD hh:mm:ss');
		},
		searchFn() {
			this.page.pageIndex = 1;
			this.init();
		},
		edit(row) {
			this.rowObj = row;
			this.dialogEdit = true;
		},
		editManage(row) {
			this.queryAllProductListFn();
			this.rowObj = row;
			this.dialogManage = true;
		},
		handleAddClose() {
			this.dialogAdd = false;
		},
		handleClose() {
			this.rowObj = {};
			this.dialogManage = false;
			this.dialogEdit = false;
			this.batchImportShow = false;
		},
		batchImport() {
			this.batchImportShow = true;
		},
		queryAllProductListFn() {
			queryAllProductList({
				corpId: this.$storage.getCorpId()
			}).then(res => {
				if (res.code == 1) {
					res.data.map((item, index) => {
						item.label = item.typeName;
						item.productBaseDTOList.map((current, i) => {
							current.label = current.name;
						});
					});
					this.manageData = res.data;
					console.log(this.manageData);
				}
			});
		},
		init() {
			this.loading = true;
			queryUserListByPage({
				corpId: this.$storage.getCorpId(),
				mobile: this.searchForm.mobile,
				username: this.searchForm.username,
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
		showDelConfirm(id) {
			this.$confirm('删除后将不可还原，请确认是否删除？', '删除确认', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteUser({
						id: id
					}).then(
						resp => {
							if (resp.code == 0) {
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
									message: resp.message || '删除失败',
									type: 'error'
								});
							}
						},
						() => {
							if (this.notifyInstance) {
								this.notifyInstance.close();
							}
							this.notifyInstance = this.$notify({
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
