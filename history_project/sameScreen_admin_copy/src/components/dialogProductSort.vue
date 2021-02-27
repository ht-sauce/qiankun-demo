<template>
	<el-dialog title="分类管理" :visible.sync="dialogProductSortShow" width="420px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
		<div>
			<el-tag :key="index" v-for="(item,index) in dynamicTags" closable :disable-transitions="false" @close="handleTagClose(index,item)">{{ item.name }}</el-tag>
			<el-input
				class="input-new-tag"
				v-if="inputVisible"
				v-model="inputValue"
				ref="saveTagInput"
				size="small"
				maxlength="30"
				@keyup.enter.native="handleInputConfirm"
				@blur="handleInputConfirm"
			></el-input>
			<el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
		</div>
		<div slot="footer">
			
		</div>
	</el-dialog>
</template>

<script>
import {queryType,createType,delType} from '@/api/robot-ss.js';
export default {
	components: {},
	props: ['dialogProductSortShow'],
	data() {
		return {
			loading: false,
			dynamicTags: ['金融', '化妆品', '贷款'],
			inputVisible: false,
			inputValue: '',
			notifyInstance:false
		};
	},
	watch: {
		dialogProductSortShow(newObj, oldObj) {
			this.queryTypefn();
		},
		immediate: true,
		deep: true
	},
	mounted() {
		
	},
	methods: {
		handleClose() {
			this.$emit('handleClose');
		},
		cancel() {
			this.$emit('handleClose');
		},
		closeDialog() {
			this.$emit('handleClose');
		},
		handleTagClose(index,row) {
			let id = row.id;
			delType(id).then(res=>{
				if(res.code == 1){
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: '删除成功',
						type: 'success'
					});
					this.queryTypefn();
					this.$emit('queryType');
				}else{
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: res.message,
						type: 'error'
					});
				}
			})
			
		},
		queryTypefn() {
			queryType({
				pageNum: 1,
				pageSize: 10000,
				corpId: this.$storage.getCorpId()
			}).then(res => {
				if (res.code == 1) {
					this.dynamicTags = res.data.list;
				}
			});
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},

		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue == '') {
				if (this.notifyInstance) {
					this.notifyInstance.close();
				}
				this.notifyInstance = this.$notify({
					title: '提示',
					message: '产品类型不能为空',
					type: 'warning'
				});
				return;
			}
			this.inputVisible = false;
			this.inputValue = '';
			createType({name:inputValue,corpId:this.$storage.getCorpId()}).then(res=>{
				console.log(res);
				if(res.code==1){
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: '新增成功',
						type: 'success'
					});
					this.queryTypefn();
					this.$emit('queryType');	
				}else{
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: res.message,
						type: 'error'
					});
				}
			})
		},
		handelConfirm(){
			console.log(this.dynamicTags)
			
		}
	}
};
</script>

<style lang="scss" scoped>
.el-tag {
	margin-left:10px;
	margin-top:10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
	margin-top:10px;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
	margin-top:10px;
}
</style>
