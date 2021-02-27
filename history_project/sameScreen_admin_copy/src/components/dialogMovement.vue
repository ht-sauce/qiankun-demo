<template>
	<el-dialog :title="num==-1?'上移':'下移'" :visible.sync="dialogMovement" width="420px" :before-close="handleClose" @close="closeDialog" :close-on-click-modal="false">
		<el-form class="digitalDialog" ref="elForm" :model="formData" size="small" label-width="120px">
			<el-form-item :label="num==-1?'请输入上移步数':'请输入下移步数'" prop="ord">
				<el-input-number v-model="formData.ord" :precision="0" controls-position="right" :min="1" max="998" :style="{ width: '100%' }"></el-input-number>
			</el-form-item>
		</el-form>
		<div slot="footer">
			<el-button @click="cancel()" size="small">取消</el-button>
			<el-button type="primary" size="small" @click="handelConfirm">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { reorder } from '@/api/robot-ss.js';
export default {
	components: {},
	props: ['dialogMovement','rowObj'],
	data() {
		return {
			loading: false,
			formData: {
				ord:1
			},
			id:'',
			num:'',
			notifyInstance: false
		};
	},
	watch: {
		rowObj(newObj, oldObj) {
			console.log(newObj);
			if(newObj.id){
				this.id = newObj.id;
				this.num = newObj.num;
			}
			
		},
		immediate: true,
		deep: true
	},
	methods: {
		handleClose() {
			this.$emit('handleClose');
			this.$refs['elForm'].resetFields();
		},
		cancel() {
			this.$emit('handleClose');
			this.$refs['elForm'].resetFields();
		},
		closeDialog() {
			this.$emit('handleClose');
			this.$refs['elForm'].resetFields();
		},
		handelConfirm(){
			if(this.formData.ord == 0 || this.formData.ord == undefined){
				if (this.notifyInstance) {
					this.notifyInstance.close();
				}
				this.notifyInstance = this.$notify({
					title: '提示',
					message: '您输入的值不正确',
					type: 'warning'
				});
				return;
			}
			let id = this.id;
			let ord = this.formData.ord*(this.num);
			reorder(id,ord).then(res=>{
				if(res.code == 1){
					if (this.notifyInstance) {
						this.notifyInstance.close();
					}
					this.notifyInstance = this.$notify({
						title: '提示',
						message: '调整顺序成功',
						type: 'success'
					});
					this.$emit('handleClose');
					this.$emit('init');
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
		}
	}
};
</script>

<style></style>
