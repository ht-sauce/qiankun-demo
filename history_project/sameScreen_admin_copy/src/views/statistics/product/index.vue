<template>
	<div class="digital">
		<!-- <router-link to="/statistics/productDetail">详情按钮</router-link> -->
		<div class="top-statistics-area">
			<div class="item item1">
				<p class="title">总产品数</p>
				<p class="num">{{ totalProd }}</p>
			</div>
			<div class="item item2">
				<p class="title">已上线产品数</p>
				<p class="num">{{ totalOnlineProd }}</p>
			</div>
			<div class="item item3">
				<p class="title">已下架产品数</p>
				<p class="num">{{ totalOfflineProd }}</p>
			</div>
		</div>
		<div class="table-area">
			<div class="search-area">
				<el-form :inline="true" :model="searchForm" class="demo-form-inline formInline">
					<el-form-item label="产品:">
						<el-input
							style="width: 240px"
							v-model.trim="searchForm.productName"
							clearable
							placeholder="请输入产品名称"
							size="small"
						></el-input>
					</el-form-item>
					<el-form-item label="时间:">
						<el-date-picker
							style="width: 240px"
							v-model="searchForm.dateTime"
							size="small"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="权限:">
						<el-cascader
							v-model="searchForm.role"
							style="width: 340px"
							size="small"
              :props="props"
							:options="roleOptions"
							clearable
						></el-cascader>
					</el-form-item>
					<!-- <el-form-item label="权限:">
            <el-input
              style="width: 220px"
              v-model.trim="searchForm.organizationName"
              clearable
              placeholder="请选择权限"
              size="small"
            ></el-input>
          </el-form-item> -->
					<el-form-item class="reset"
						><el-button
							type="primary"
							plain
							size="small"
							class="searchBtn"
							:disabled="loading"
							@click="searchFn"
							>重置</el-button
						>
					</el-form-item>
					<el-form-item class="search"
						><el-button
							type="primary"
							size="small"
							class="searchBtn"
							:disabled="loading"
							@click="searchFn"
							>查询</el-button
						>
					</el-form-item>
				</el-form>
			</div>
			<div class="table-title-area">
				<h3>查询列表</h3>
				<!-- <div>
          <el-select
            v-model="value"
            placeholder="请选择"
            size="small"
            style="margin-right: 12px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div> -->
			</div>
			<div class="table-layout">
				<div class="table" v-loading="loading">
					<el-table
						height="100%"
						:data="tableData"
						@sort-change="sortChange"
						highlight-current-row
					>
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column prop="prodName" label="产品名称"></el-table-column>
						<el-table-column prop="username" label="客服经理"></el-table-column>
						<el-table-column prop="totalConsumer" label="访问人数"></el-table-column>
						<el-table-column prop="totalShare" label="分享次数"></el-table-column>
						<el-table-column prop="totalView" label="浏览次数"></el-table-column>
						<el-table-column prop="totalQAClick" label="QA点击次数"></el-table-column>
						<el-table-column prop="totalAvgInteract" label="平均总交互轮次"></el-table-column>
						<el-table-column
							prop="totalAvgHit"
							label="平均有效交互轮次"
						></el-table-column>
						<el-table-column
							prop="totalButtonClick"
							label="按钮点击次数"
						></el-table-column>
						<el-table-column label="操作" width="180">
							<template slot-scope="scope">
								<router-link :to="`/statistics/productDetail/${scope.row.prodId}/${scope.row.username}`">详情</router-link>
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
		</div>
	</div>
</template>

<script>
import { getRoleslist, deleteOrganizationInfo } from "@/api/user.js";
import { queryProdOverView } from "@/api/robot-data.js";
import { formatLongDate } from "@/utils/date.js";
export default {
	components: {},
	data: function () {
		return {
			totalProd: 0,
			totalOfflineProd: 0,
			totalOnlineProd: 0,
			searchForm: {
				productName: "",
				dateTime: [],
      },
      props: { multiple: true, emitPath: false },
			value: "",
			roleOptions: [],
			loading: false,
			page: {
				total: 0,
				pageIndex: 1,
				pageSize: 10,
			},
			rowObj: {},
			allTableData: [],
			tableData: [],
			temp: [],
			orderFlag: "desc",
			notifyInstance: false,
		};
	},
	mounted() {
		this.initData();
		this.getRoles();
	},
	methods: {
		formatTime(time) {
			return formatLongDate(time);
		},
		searchFn() {
			this.page.pageIndex = 1;
			this.initData();
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
		getRoles() {
			getRoleslist({
				page: 1,
				size: 1000,
			}).then((res) => {
				console.log(res.data.contents.length, "99999999999");
				if (res.code == 0) {
					const contents = res.data.contents;
					if (contents.length == 0) {
						return;
					}
					// 数据去重处理 筛选组织结构树
					let organizationIdArr = [];
					let newList = [];
					contents.forEach((item) => {
						if (!organizationIdArr.includes(item.organizationName)) {
							organizationIdArr.push(item.organizationName);
							newList.push({
								label: item.organizationName,
								value: item.organizationId,
								children: [],
							});
						}
					});
					newList.forEach((child) => {
						contents.forEach((ele) => {
							if (ele.organizationId === child.value) {
								child.children.push({
									label: ele.username,
									value: ele.username,
								});
							}
						});
					});
					console.log(newList, "newList");
					this.roleOptions = newList;
				} else {
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: "提示",
						message: res.message,
						type: "error",
					});
				}
			});
		},
		initData() {
			this.loading = true;
			queryProdOverView({
				corpId: this.$storage.getCorpId(),
				userList: this.searchForm.role,
				startTime: this.searchForm.dateTime.length > 0 ? this.searchForm.dateTime[0] : "",
				endTime: this.searchForm.dateTime.length > 0 ? this.searchForm.dateTime[1] : "",
        prodName: this.searchForm.productName,
			})
				.then((res) => {
					if (res.code === "OK") {
						this.allTableData =
							res.rows && res.rows.length > 0 ? res.rows[0].prodTrackRecordDTOList : [];
						this.tableData = this.allTableData.slice(
							(this.page.pageIndex - 1) * this.page.pageSize,
							this.page.pageIndex * this.page.pageSize
						);
						this.page.total = res.rows && res.rows.length > 0 ? res.rows[0].totalOnlineProd : 0;
						this.totalProd = res.rows && res.rows.length > 0 ? res.rows[0].totalProd : 0;
						this.totalOfflineProd =
							res.rows && res.rows.length > 0 ? res.rows[0].totalOfflineProd : 0;
						this.totalOnlineProd =
							res.rows && res.rows.length > 0 ? res.rows[0].totalOnlineProd : 0;
						this.loading = false;
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: "提示",
							message: res.msgExt,
							type: "error",
						});
						this.loading = false;
						return;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		init() {
			this.tableData = this.allTableData.slice(
				(this.page.pageIndex - 1) * this.page.pageSize,
				this.page.pageIndex * this.page.pageSize
			);
		},
		createSuccess() {
			this.init();
		},
		showDelConfirm(organizationId) {
			this.$confirm("删除后将不可还原，请确认是否删除？", "删除确认", {
				confirmButtonText: "删除",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					deleteOrganizationInfo({
						corpId: this.$storage.getCorpId(),
						organizationId: organizationId,
					}).then(
						(res) => {
							if (res.code == 0) {
								if (this.notifyInstance) {
									this.notifyInstance.close();
								}
								this.notifyInstance = this.$notify({
									title: "提示",
									message: "删除成功",
									type: "success",
								});
								this.init();
							} else {
								if (this.notifyInstance) {
									this.notifyInstance.close();
								}
								this.notifyInstance = this.$notify({
									title: "提示",
									message: res.message || "删除失败",
									type: "error",
								});
							}
						},
						() => {
							this.$notify({
								title: "提示",
								message: "网络或服务异常",
								type: "error",
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
			if (column.order === "ascending") {
				this.orderFlag = "asc";
			} else {
				this.orderFlag = "desc";
			}
			this.init();
		},
	},
};
</script>

<style scoped lang="scss">
.digital {
	padding: 25px 30px;
	.top-statistics-area {
		height: 100px;
		line-height: 100px;
		display: flex;
		justify-content: space-between;
		.item {
			width: 33%;
			.title {
				height: 20px;
				line-height: 20px;
				margin-top: 20px;
				text-align: center;
				color: #ffff;
			}
			.num {
				height: 50px;
				font-size: 26px;
				line-height: 50px;
				text-align: center;
				font-weight: 500;
				color: #ffffff;
			}
		}
		.item1 {
			background-image: url("../../../assets/img/num_bg1.png");
			background-size: 100% 100%;
		}
		.item2 {
			background-image: url("../../../assets/img/num_bg2.png");
			background-size: 100% 100%;
		}
		.item3 {
			background-image: url("../../../assets/img/num_bg3.png");
			background-size: 100% 100%;
		}
	}
	.table-area {
		height: calc(100vh - 196px);
		background: #ffffff;
		padding: 42px 20px 20px 20px;
		.search-area {
			padding: 15px;
			height: 72px;
			background: #f3f6fb;
			border-radius: 4px;
			.search {
				float: right;
			}
			.reset {
				float: right;
			}
		}
		.table-title-area {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 12px 0;
		}
		.table-layout {
			height: calc(100% - 170px);
			padding: 14px 0 0 0;
			.table {
				height: 100%;
			}
		}
	}
}
</style>
