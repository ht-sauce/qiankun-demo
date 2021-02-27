<template>
	<el-dialog :title="title" :visible.sync="dialogManage" width="500px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
		<el-row>
			<el-col :span="12">
				<div>
					<div>全部</div>
					<div class="dataList">
						<el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
						<el-tree
							class="filter-tree"
							size="small"
							@node-click="handleNodeClick"
							:data="data"
							:props="defaultProps"
							default-expand-all
							:filter-node-method="filterNode"
							ref="tree"
						></el-tree>
					</div>
				</div>
			</el-col>
			<el-col :span="12">
				<div class="selectedContainer">
					<div>已选</div>
					<ul class="selectedList">
						<li class="selectedItem" v-for="(item, index) in selectedData" :key="index">
							<span class="selectedItemTitle">{{ item.label }}</span>
							<span class="del" @click="delItem(index)">删除</span>
						</li>
					</ul>
				</div>
			</el-col>
		</el-row>

		<div slot="footer">
			<el-button @click="cancel()" size="small">取消</el-button>
			<el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getProductUserList, getProductUserRelList, batchModifyProductUserRel } from '@/api/robot-ss.js';
import moment from 'moment';
export default {
	components: {},
	props: ['dialogManage', 'title', 'manageData', 'rowObj'],
	data() {
		return {
			loading: false,
			notifyInstance: false,
			filterText: '',
			selectedData: [],
			productId: '',
			data: [],
			mobile: ''
		};
	},
	watch: {
		filterText(val) {
			this.$refs.tree.filter(val);
		},
		rowObj: {
			handler(newObj, oldObj) {
				if (newObj.mobile) {
					this.mobile = newObj.mobile;
					this.productId = newObj.mobile;
					this.init();
					this.defaultProps = {
						children: 'productBaseDTOList',
						label: 'label'
					};
				} else {
					this.productId = newObj.id;
					this.init();
					this.defaultProps = {
						children: 'userBaseDTOList',
						label: 'label'
					};
				}
			},
			immediate: true,
			deep: true
		},
		manageData(newObj, oldObj) {
			this.data = this._.cloneDeep(newObj);
		}
	},
	mounted() {},
	methods: {
		handleClose() {
			this.filterText = '';
			this.$emit('handleClose');
		},
		cancel() {
			this.filterText = '';
			this.$emit('handleClose');
		},
		closeDialog() {
			this.filterText = '';
			this.$emit('handleClose');
		},
		filterNode(value, data, node) {
			//如果共有三级菜单
			if (!value) return true;
			let if_one = data.label.indexOf(value) !== -1;
			let if_two = node.parent && node.parent.data && node.parent.data.label && node.parent.data.label.indexOf(value) !== -1;
			let if_three = node.parent && node.parent.parent && node.parent.parent.data && node.parent.parent.data.label && node.parent.parent.data.label.indexOf(value) !== -1;
			let result_one = false;
			let result_two = false;
			let result_three = false;
			if (node.level === 1) {
				result_one = if_one;
			} else if (node.level === 2) {
				result_two = if_one || if_two;
			} else if (node.level === 3) {
				result_three = if_one || if_two || if_three;
			}
			return result_one || result_two || result_three;
		},
		init() {
			if (this.mobile) {
				let username = this.mobile;
				getProductUserList(username).then(res => {
					console.log(res);
					if (res.code == 1) {
						res.data.map((item, index) => {
							item.label = item.name;
						});
						this.selectedData = res.data;
					}
				});
			} else {
				let id = this.productId;
				getProductUserRelList(id).then(res => {
					if (res.code == 1) {
						res.data.map((item, index) => {
							item.label = item.username;
						});
						this.selectedData = res.data;
					}
				});
			}
		},
		handleNodeClick(d, n, s) {
			if (this.mobile) {
				if (!d.children) {
					let dataItem = this.selectedData.find(function(item) {
						return item.id == d.id;
					});
					if (dataItem == undefined && !d.productBaseDTOList) {
						this.selectedData.push(d);
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '该项已经被选择！',
							type: 'warning'
						});
					}
				}
			} else {
				if (!d.children) {
					let dataItem = this.selectedData.find(function(item) {
						return item.label == d.label;
					});
					if (dataItem == undefined && !d.userBaseDTOList) {
						this.selectedData.push(d);
					} else {
						if (this.notifyInstance) {
							this.notifyInstance.close();
						}
						this.notifyInstance = this.$notify({
							title: '提示',
							message: '该项已经被选择！',
							type: 'warning'
						});
					}
				}
			}
		},
		delItem(index) {
			this.selectedData.splice(index, 1);
		},
		handelConfirm() {
			var operationType;
			if (this.mobile) {
				operationType = 2;
				if (this.selectedData.length == 0) {
					this.selectedData = [{ username: this.mobile }];
				} else {
					this.selectedData.map((item, index) => {
						item.username = this.mobile;
						item.productId = item.id;
						delete item.id;
						delete item.name;
						delete item.label;
						delete item.desc;
						delete item.updateTime;
						delete item.createTime;
					});
				}
			} else {
				operationType = 1;
				if (this.selectedData.length == 0) {
					this.selectedData = [{ productId: this.productId }];
				} else {
					this.selectedData.map((item, index) => {
						item.productId = this.productId;
						delete item.updateTime;
						delete item.createTime;
					});
				}
			}

			batchModifyProductUserRel(operationType, this.selectedData).then(res => {
				if (res.code == 1) {
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: '操作成功',
						type: 'success'
					});
					this.handleClose();
					this.$emit('init');
				} else {
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: res.message,
						type: 'error'
					});
					return;
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.dataList {
	overflow: auto;
	margin-top: 10px;
	line-height: 25px;
	border: dotted 1px #ccc;
	padding: 10px;
	min-height: 300px;
	max-height: 300px;
}
.selectedContainer {
	margin-left: 20px;
	.selectedList {
		overflow: auto;
		margin-top: 10px;
		line-height: 25px;
		border: dotted 1px #ccc;
		padding: 10px;
		min-height: 300px;
		max-height: 300px;
		.selectedItem {
			.selectedItemTitle {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 150px;
				display: inline-block;
				cursor: pointer;
			}
			.del {
				float: right;
				color: red;
				cursor: pointer;
			}
		}
	}
}
</style>
