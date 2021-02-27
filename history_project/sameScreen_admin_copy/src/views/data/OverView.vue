<template>
	<div class="dashboard">
		<div class="dashboard-header">
			<el-row>
				<el-col :span="24">
					<div class="grid-content">
						<div class="companyTitle">
							<div>{{ this.userInfo.organizationName }}</div>
							<div class="companyCode">{{ this.userInfo.organizationId }}</div>
						</div>
						<div class="manageInfo">
							<div class="manageItem">
								管理员账号：
								<span>{{ this.userInfo.username }}</span>
							</div>
							<div class="manageItem">
								创建时间：
								<span>{{ formatTime(this.userInfo.createTime) }}</span>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="dashboard-content">
			<div class="dashboard-list">
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="grid-content">
							<div class="dashboard-list-info">
								<div class="dashboard-list-info-item">
									<div class="dashboard-list-info-item-title">用户数</div>
									<div class="dashboard-list-info-item-num">{{userData.totalConsumer?userData.totalConsumer:'0'}}</div>
								</div>
								<div class="dashboard-list-info-item"><img src="@/assets/img/usercountImg.png" /></div>
							</div>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content">
							<div class="dashboard-list-info">
								<div class="dashboard-list-info-item">
									<div class="dashboard-list-info-item-title">登录次数</div>
									<div class="dashboard-list-info-item-num">{{userData.totalLoginNum?userData.totalLoginNum:'0'}}</div>
								</div>
								<div class="dashboard-list-info-item"><img src="@/assets/img/loginCountImg.png" /></div>
							</div>
						</div>
					</el-col>
					<!-- 					<el-col :span="6">
						<div class="grid-content">
							<div class="dashboard-list-info">
								<div class="dashboard-list-info-item">
									<div class="dashboard-list-info-item-title">登录时长</div>
									<div class="dashboard-list-info-item-num">903</div>
								</div>
								<div class="dashboard-list-info-item"><img src="@/assets/img/loginTimeImg.png" /></div>
							</div>
						</div>
					</el-col> -->
					<el-col :span="8">
						<div class="grid-content">
							<div class="dashboard-list-info">
								<div class="dashboard-list-info-item">
									<div class="dashboard-list-info-item-title">服务天数</div>
									<div class="dashboard-list-info-item-num">{{userData.totalServiceNum?userData.totalServiceNum:'0'}}</div>
								</div>
								<div class="dashboard-list-info-item"><img src="@/assets/img/serverImg.png" /></div>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="dashboard-echarts">
				<el-row :gutter="20">
					<el-col :span="24">
						<div class="grid-content">
							<div class="title">使用量趋势图</div>
							<div class="echarts" id="main" style="width: 100%;height:500px;"></div>
						</div>
					</el-col>
					<!-- <el-col :span="6">
						<div class="grid-content">
							<div class="title">
								公告
								<span class="more" @click="dialogTableVisible = true">更多</span>
							</div>
							<div class="notice">
								<div>
									<span>2020/5/15</span>
									增加一对一对话知识管理功能，优化响应性能；
								</div>
								<div>
									<span>2020/5/15</span>
									增加一对一对话知识管理功能，优化响应性能；
								</div>
								<div>
									<span>2020/5/15</span>
									增加一对一对话知识管理功能，优化响应性能；
								</div>
								<div>
									<span>2020/5/15</span>
									增加一对一对话知识管理功能，优化响应性能；
								</div>
								<div>
									<span>2020/5/15</span>
									增加一对一对话知识管理功能，优化响应性能；
								</div>
							</div>
						</div>
					</el-col> -->
				</el-row>
			</div>
		</div>
		<el-dialog title="公告" :visible.sync="dialogTableVisible" style="display:none">
			<el-table :data="gridData" style="max-height:500px;overflow:auto;">
				<el-table-column property="date" label="日期" width="150"></el-table-column>
				<el-table-column property="address" label="地址"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>
<script>
import echarts from 'echarts';
import moment from 'moment';
import { queryUsageAnalysis } from '@/api/user.js';
export default {
	data() {
		return {
			checked: false,
			dialogTableVisible: false,
			userInfo: {},
			gridData: [
				{
					date: '2020/5/15',
					address: '增加一对一对话知识管理功能，优化响应性能；'
				},
				{
					date: '2020/5/15',
					address: '增加一对一对话知识管理功能，优化响应性能；'
				},
				{
					date: '2020/5/15',
					address: '增加一对一对话知识管理功能，优化响应性能；'
				},
				{
					date: '2020/5/15',
					address: '增加一对一对话知识管理功能，优化响应性能；'
				}
			],
			userData:{
				totalConsumer:0,
				totalLoginNum:0,
				totalServiceNum:0,
				date:[],
				usage:[]
			},
			notifyInstance: false
		};
	},
	mounted() {
		this.analysisFn();
		this.userInfo = this.$storage.getUserInfo('user');
	},
	methods: {
		formatTime(time) {
			return moment(time).format('YYYY-MM-DD hh:mm:ss');
		},
		setPass(val) {
			if (val) {
				console.log('解密');
			} else {
				console.log('加密');
			}
		},
		analysisFn() {
			let username = this.$storage.getUserInfo('user').username;
			queryUsageAnalysis(username).then(res => {
				//console.log(res);
				if (res.code == 0) {
					this.userData.totalConsumer = res.data.totalConsumer;
					this.userData.totalLoginNum = res.data.totalLoginNum;
					this.userData.totalServiceNum = res.data.totalServiceNum;
					this.userData.date = res.data.usageAnalysisDTOList.map(x=>x.date?x.date:0);
					this.userData.usage = res.data.usageAnalysisDTOList.map(x=>x.usage?x.usage:0);
					this.myEcharts(this.userData.date,this.userData.usage);
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
			});
		},
		myEcharts(date,usage) {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));

			// 指定图表的配置项和数据
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						}
					}
				},
				// toolbox: {
				// 	feature: {
				// 		dataView: { show: true, readOnly: false },
				// 		magicType: { show: true, type: ['line', 'bar'] },
				// 		restore: { show: true },
				// 		saveAsImage: { show: true }
				// 	}
				// },
				legend: {
					x: 'center',
					y: 'bottom',
					data: ['登录次数']
				},
				xAxis: [
					{
						type: 'category',
						axisLine: { show: false },
						axisTick: { show: false },
						data: this.userData.date,
						axisPointer: {
							type: 'shadow'
						},
					}
				],
				yAxis: [
					// {
					// 	type: 'value',
					// 	min: 0,
					// 	max: 250,
					// 	interval: 50,
					// 	axisLabel: {
					// 		formatter: '{value}',
					// 		interval: 1,
					// 		textStyle: {
					// 			color: '#999999'
					// 		}
					// 	},
					// 	splitLine: {
					// 		show: true,
					// 		lineStyle: {
					// 			type: 'dashed',
					// 			color: '#CCCDCF'
					// 		}
					// 	},
					// 	axisLine: { show: false },
					// 	axisTick: { show: false }
					// },
					{
						type: 'value',
						axisLabel: {
							formatter: '{value}',
							textStyle: {
								color: '#999999'
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed',
								color: '#CCCDCF'
							}
						},
						axisLine: { show: false },
						axisTick: { show: false }
					}
				],
				series: [
					{
						name: '登录次数',
						type: 'bar',
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{ offset: 0, color: '#7EBEFF' }, //柱图渐变色
									{ offset: 1, color: '#ffffff' } //柱图渐变色
								])
							}
						},
						data: this.userData.usage
					}
					// {
					// 	name: '登录时长',
					// 	type: 'line',
					// 	symbol: 'none',
					// 	yAxisIndex: 1,
					// 	itemStyle: {
					// 		normal: {
					// 			color: '#FF5316',
					// 			lineStyle: {
					// 				color: '#FF5316'
					// 			}
					// 		}
					// 	},
					// 	data: [2.0, 4.9, 7.0, 23.2, 20.6, 13.7, 12.6, 11.2, 8.6, 6.0, 6.4, 3.3, 6.8, 9.8, 20, 21, 23, 15, 18, 17, 22, 19, 8, 6, 5, 13, 12, 9, 5, 6, 4]
					// }
				]
			};
			myChart.clear();
			myChart.setOption(option);
			myChart.resize();
			window.addEventListener('resize', myChart.resize);
		}
	}
};
</script>
<style lang="scss" scoped>
.dashboard {
	background: #eff3f6;
	.dashboard-header {
		.grid-content {
			background: #fff;
			border-radius: 4px;
			padding: 30px 30px 20px 30px;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.02);
			.companyTitle {
				font-size: 20px;
				font-weight: 600;
				color: rgba(0, 0, 0, 0.85);
				font-family: PingFangSC-Medium, PingFang SC;
				.companyCode {
					color: rgba(0, 0, 0, 0.65);
					font-weight: 400;
					font-size: 14px;
					margin-top: 5px;
				}
			}
			.manageInfo {
				display: flex;
				margin-top: 30px;
				.manageItem {
					flex: 1;
					font-size: 14px;
					font-weight: 500;
					color: rgba(0, 0, 0, 0.85);
					display: inline-flex;
					span {
						font-size: 14px;
						color: rgba(0, 0, 0, 0.65);
					}
					.checkbox {
						margin-left: 15px;
						color: #0091ff;
						cursor: pointer;
						font-size: 24px;
						margin-top: -7px;
						display: inline-flex;
					}
				}
			}
		}
	}
	.dashboard-content {
		margin-top: 20px;
		.dashboard-list {
			.grid-content {
				background: #fff;
				border-radius: 4px;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.02);
				.dashboard-list-info {
					display: flex;
					.dashboard-list-info-item {
						position: relative;
						flex: 1;
						padding: 20px 30px;
						img {
							position: absolute;
							right: 0px;
							bottom: 0px;
							width: 90px;
						}
						.dashboard-list-info-item-num {
							font-size: 26px;
							font-weight: 500;
							text-align: left;
							color: #000000;
						}
						.dashboard-list-info-item-title {
							color: rgba(0, 0, 0, 0.45);
							font-size: 14px;
							text-align: left;
						}
					}
				}
			}
		}
		.dashboard-echarts {
			margin-top: 20px;
			.grid-content {
				background: #fff;
				border-radius: 4px;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.02);

				.title {
					padding: 20px;
					font-size: 16px;
					font-weight: 600;
					border-bottom: solid 1px #e8eaef;
					.more {
						float: right;
						color: #0091ff;
						font-size: 14px;
						font-weight: 400;
						cursor: pointer;
					}
				}
				.echarts {
					padding: 20px 0px;
				}
				.notice {
					padding: 0px 20px 20px 20px;
					line-height: 25px;
					height: 500px;
					overflow: auto;
					div {
						margin-top: 15px;
						color: #333333;
						font-size: 14px;
						span {
							color: #999999;
							display: block;
						}
					}
				}
			}
		}
	}
}
</style>
