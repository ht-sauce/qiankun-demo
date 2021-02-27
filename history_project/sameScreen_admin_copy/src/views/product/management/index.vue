<template>
	<div class="digital">
		<div class="toolbar">
			<div class="flex">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline formInline">
					<el-form-item label="产品名称:">
						<el-input style="width: 150px;" v-model.trim="searchForm.name" clearable placeholder="请输入产品名称" size="small"></el-input>
					</el-form-item>

					<el-form-item label="类型:">
						<el-select v-model="searchForm.typeId" placeholder="请选择类型" filterable clearable size="small" style="width: 150px;">
							<el-option v-for="item in tempList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="物料:">
						<el-select v-model="searchForm.materialId" placeholder="请选择营销物料" filterable clearable size="small" style="width: 150px;">
							<el-option v-for="item in materialList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态:">
						<el-select v-model="searchForm.status" placeholder="请选择产品状态" filterable clearable size="small" style="width: 150px;">
							<el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item><el-button type="primary" size="small" class="searchBtn" :disabled="loading" @click="searchFn">查询</el-button></el-form-item>
				</el-form>
			</div>
			<div style="margin-top:5px;"><el-button size="small" type="primary" @click.stop="dialogAdd = true">新增</el-button></div>
		</div>
		<div class="table-layout">
			<div class="table" v-loading="loading">
				<el-table height="100%" :data="tableData" @sort-change="sortChange" highlight-current-row @cell-mouse-leave="showClickIcon = false" @cell-mouse-enter="sortable">
					<el-table-column prop="ord" label="序号">
						<template slot-scope="scope">
							<div style="cursor:pointer;">
								<div style="float:left;">{{ scope.row.ord }}</div>
								<div v-if="showClickIcon == true && scope.row.id == rowid" style="float:left;margin-left:5px;">
									<img src="@/assets/img/up.png" @click="editMove(scope.row, -1)" width="16" style="vertical-align: middle;" />
									<img src="@/assets/img/down.png" @click="editMove(scope.row, 1)" width="16" style="vertical-align: middle;margin-left:5px;" />
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="产品名称"></el-table-column>
					<el-table-column prop="typeName" label="类型"></el-table-column>
					<el-table-column prop="materialName" label="物料">
						<template slot-scope="scope">
							<span>{{ formatmMterialName(scope.row.materialId) }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="desc" label="描述" :show-overflow-tooltip="true" width="300"></el-table-column>
					<el-table-column prop="remark" label="分配人员数">
						<template slot-scope="scope">
							<span @click="editManage(scope.row, manageData)" style="color:#409EFF;cursor:pointer;">{{ scope.row.memberCount ? scope.row.memberCount : '0' }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="updateTime" label="状态">
						<template slot-scope="scope">
							{{ formatStatus(scope.row.status) }}
						</template>
					</el-table-column>
					<el-table-column prop="updateTime" sortable label="更新时间">
						<template slot-scope="scope">
							{{ scope.row.updateTime || '--'}}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click="modifyStatusFn(scope.row.id, scope.row.status)">{{ formatStatusNext(scope.row.status) }}</el-button>
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
		<dialogAdd :dialogAdd.sync="dialogAdd" @handleAddClose="handleAddClose" @init="init" @queryType="queryTypefn" />
		<!-- 新增界面内容管理 -->
		<dialogEdit :dialogEdit.sync="dialogEdit" @handleClose="handleClose" :rowObj.sync="rowObj" @init="init" @queryType="queryTypefn" />
		<!-- 管理 -->
		<dialogManage v-if="dialogManage" :dialogManage.sync="dialogManage" @handleClose="handleClose" :title.sync="title" @init="init" :manageData.sync="manageData" :rowObj.sync="rowObj" />
		<!-- 移动 -->
		<dialogMovement :dialogMovement.sync="dialogMovement" @handleClose="handleClose" :rowObj.sync="rowObj" @init="init" />
	</div>
</template>

<script>
import { queryProductListByPage, modifyStatus, queryType, delProduct, getProductUserRelList, queryMaterial } from '@/api/robot-ss.js';
import { queryAllUserOrganization } from '@/api/user.js';
import dialogAdd from './components/dialogAdd.vue';
import dialogEdit from './components/dialogEdit.vue';
import dialogManage from '@/components/dialogManage.vue';
import dialogMovement from '@/components/dialogMovement.vue';
import { getObjValue } from '@/utils/obj.js';
import { formatLongDate } from '@/utils/date.js';
import { downFile } from '@/utils/dom.js';
import moment from 'moment';
export default {
	components: {
		dialogAdd,
		dialogEdit,
		dialogManage,
		dialogMovement
	},
	data: function() {
		return {
			dialogAdd: false,
			dialogEdit: false,
			dialogManage: false,
			dialogMovement: false,
			loading: false,
			ordType: '',
			title: '成员管理',
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10
			},
			rowObj: {},
			tableData: [],
			tempList: [],
			statusList: [
				{
					id: 0,
					label: '待发布'
				},
				{
					id: 1,
					label: '已发布'
				}
			],
			searchForm: {
				name: '',
				typeId: '',
				materialId: '',
				status: ''
			},
			manageData: [],
			selectedData: [],
			materialList: [],
			showClickIcon: false,
			rowid: '',
			notifyInstance: false
		};
	},
	mounted() {
		this.queryTypefn();
		this.queryMaterialFn();
		this.init();
	},
	methods: {
		//鼠标移入事件
		sortable(row) {
			this.showClickIcon = true;
			this.rowid = row.id; //赋值行id，便于页面判断
		},
		formatmMterialName(id) {
			let name;
			this.materialList.find(function(item) {
				if (item.id == id) {
					name = item.name;
				}
			});
			return name;
		},

		formatStatus(status) {
			let arr = ['待发布', '已发布', '待更新'];
			return arr[status] || '--';
		},
		formatStatusNext(status) {
			let arr = ['发布', '下架', '更新'];
			return arr[status] || '--';
		},
		formatTime(time) {
			return moment(time).format('YYYY-MM-DD hh:mm:ss');
		},
		queryAllUserOrganizationFn() {
			queryAllUserOrganization({
				corpId: this.$storage.getCorpId()
			}).then(res => {
				if (res.code == 0) {
					res.data.map((item, index) => {
						item.label = item.organizationName;
						item.userBaseDTOList.map((current, i) => {
							current.label = current.username;
						});
					});
					this.manageData = res.data;
				}
			});
		},
		queryMaterialFn() {
			queryMaterial({
				corpId: this.$storage.getCorpId(),
				pageNum: 1,
				pageSize: 10000,
				status: '1,2'
			}).then(res => {
				if (res.code == 1) {
					this.materialList = res.data.list;
				}
			});
		},
		queryTypefn() {
			queryType({
				corpId: this.$storage.getCorpId(),
				pageNum: 1,
				pageSize: 10000
			}).then(res => {
				if (res.code == 1) {
					this.tempList = res.data.list;
				}
			});
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
			this.queryAllUserOrganizationFn();
			this.rowObj = row;
			this.dialogManage = true;
		},
		editMove(row, num) {
			row.num = num;
			this.rowObj = row;
			this.dialogMovement = true;
		},
		handleAddClose() {
			this.dialogAdd = false;
		},
		handleClose() {
			this.rowObj = {};
			this.dialogEdit = false;
			this.dialogManage = false;
			this.dialogMovement = false;
		},
		modifyStatusFn(id, status) {
			this.loading = true;
			if (status == 1) {
				status = 0;
				this.$confirm('请确认产品是否下架？', '下架确认', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						modifyStatus(id, status).then(
							res => {
								if (res.code == 1) {
									if (this.notifyInstance) {
										this.notifyInstance.close();
									}
									this.notifyInstance = this.$notify({
										title: '提示',
										message: '修改成功',
										type: 'success'
									});
									this.loading = false;
									this.init();
								} else {
									if (this.notifyInstance) {
										this.notifyInstance.close();
									}
									this.notifyInstance = this.$notify({
										title: '提示',
										message: res.message,
										type: 'warning'
									});
									this.loading = false;
									return;
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
					.catch(() => {
						this.loading = false;
					});
			} else {
				status = 1;
				modifyStatus(id, status).then(res => {
					if (res.code == 1) {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '修改成功',
							type: 'success'
						});
						this.loading = false;
						this.init();
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: res.message,
							type: 'warning'
						});
						this.loading = false;
						return;
					}
				});
			}
		},
		init() {
			let that = this;
			that.tableData = [];
			this.loading = true;
			queryProductListByPage({
				corpId: this.$storage.getCorpId(),
				name: this.searchForm.name,
				ordType: this.ordType,
				typeId: this.searchForm.typeId,
				materialId: this.searchForm.materialId,
				status: this.searchForm.status,
				pageNum: this.page.pageIndex,
				pageSize: this.page.pageSize
			})
				.then(res => {
					if (res.code == 1) {
						const newArr = [];
						res.data.list.map((item, index) => {
							let id = item.id;
							getProductUserRelList(id).then(res => {
								if (res.code == 1) {
									item.memberCount = res.data.length;
									newArr.push(item);
								}
							});
						});

						setTimeout(function() {
							that.tableData = res.data.list;
							that.page.total = res.data.total;
							that.loading = false;
						}, 1000);
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
					delProduct(id).then(
						res => {
							if (res.code == 1) {
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
				this.ordType = 1;
			} else {
				this.ordType = 0;
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
.el-tooltip__popper {
	max-width: 350px;
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
	height: calc(100vh - 200px);
}
.imgShow {
	width: 60px;
	height: 70px;
}
</style>
