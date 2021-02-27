<template>
	<div class="digital">
		<div class="product_all">
			<div class="top-title">
				<div>
					<span>产品一</span>
				</div>
				<div>
					<el-radio-group v-model="timeType" size="small">
						<el-radio-button label="今天"></el-radio-button>
						<el-radio-button label="昨天"></el-radio-button>
						<el-radio-button label="最近一周"></el-radio-button>
						<el-radio-button label="最近一个月"></el-radio-button>
					</el-radio-group>
					<el-date-picker
						style="width: 240px; margin-left: 12px"
						v-model="dateTime"
						size="small"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
					>
					</el-date-picker>
				</div>
			</div>
		</div>
		<div class="static-area">
			<div class="left">
				<div class="static-item static-item-right-border">
					<p class="text">浏览次数</p>
					<p class="num">{{ statisticForm.totalView }}</p>
				</div>
				<div class="static-item static-item-right-border">
					<p class="text">访问人数</p>
					<p class="num">{{ statisticForm.totalConsumer }}</p>
				</div>
				<div class="static-item">
					<p class="text">分享次数</p>
					<p class="num">{{ statisticForm.totalShare }}</p>
				</div>
			</div>
			<div class="right">
				<div class="static-item static-item-right-border">
					<p class="text">QA点击次数</p>
					<p class="num">{{ statisticForm.totalQAClick }}</p>
				</div>
				<div class="static-item static-item-right-border">
					<p class="text">按钮点击次数</p>
					<p class="num">{{ statisticForm.totalButtonClick }}</p>
				</div>
				<div class="static-item">
					<p class="text">同屏次数</p>
					<p class="num">{{ statisticForm.totalTakeover }}</p>
				</div>
			</div>
		</div>
		<div class="customer_source">
			<!-- 客户来源渠道 -->
			<div>
				<CustomerSourceChart
					:title="customerSourceTitle"
					:chartData="customerSourceData"
					class="chart"
				></CustomerSourceChart>
			</div>
			<!-- 微信聊天渠道 -->
			<div style="position: relative">
				<ChatChannelChart
					:title="chatChannelTitle"
					:chartData="chatChannelData"
					class="chart"
				></ChatChannelChart>
			</div>
		</div>
		<div class="client_portrait">
			<div class="chart_area">
				<!-- 客户意向分布 -->
				<div class="chart_parent">
					<InterestChart
						:title="interestTitle"
						:chartData="interestData"
						class="chart"
					></InterestChart>
				</div>
				<!-- 问答交互形式 -->
				<div class="chart_parent">
					<QuesInteractiveChart
						:title="quesInteractiveTitle"
						:chartData="quesInteractiveData"
						class="chart"
					></QuesInteractiveChart>
				</div>
			</div>
		</div>
		<div class="question-statistics">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane :label="addCustomerLabel" name="first">
					<div style="display: flex">
						<ScatterGram
							v-if="activeName == 'first'"
							:chartData="addChartData"
							style="height: 550px; width: calc(100% - 400px)"
						></ScatterGram>
						<div style="width: 400px; padding: 16px">
							<Ranking :itemArr="addCustomerRank"></Ranking>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane :label="activeCustomerLabel" name="second">
					<ScatterGram
						v-if="activeName == 'second'"
						:chartData="activeChartData"
						style="height: 550px; width: calc(100% - 400px)"
					></ScatterGram>
					<div style="width: 400px; padding: 16px">
						<Ranking :itemArr="activeCustomerRank"></Ranking>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import echarts from "echarts";

import {
	queryProdOverviewDetail,
	queryCustomerStatistic,
	queryDistributionStatistic,
} from "@/api/robot-data.js";
import CustomerSourceChart from "./chartComponents/customerSourceChart.vue";
import ChatChannelChart from "./chartComponents/chatChannelChart.vue";
import InterestChart from "./chartComponents/interestChart";
import QuesInteractiveChart from "./chartComponents/quesInteractiveChart";
import ScatterGram from "./chartComponents/scattergram";
import Ranking from "./components/Ranking";
export default {
	components: {
		CustomerSourceChart,
		ChatChannelChart,
		InterestChart,
		QuesInteractiveChart,
		ScatterGram,
		Ranking,
	},
	data: function () {
		return {
			timeType: null,
			dateTime: null,
			activeName: "first",
			statisticForm: {
				totalView: 0, //浏览次数
				totalConsumer: 0, //访问人数
				totalShare: 0, //分享次数
				totalTakeover: 0, //同屏次数
				totalButtonClick: 0, //按钮点击次数
				totalQAClick: 0, //QA点击次数
			},
			customerSourceTitle: "客户来源渠道总览",
			customerSourceData: [
				{
					value: 333,
					name: "微信聊天",
				},
				{
					value: 111,
					name: "二维码",
				},
				{
					value: 222,
					name: "小程序搜索",
				},
			],
			chatChannelTitle: "微信聊天渠道",
			chatChannelData: [
				{
					value: 335,
					name: "个人微信",
				},
				{
					value: 310,
					name: "微信群",
				},
			],
			interestTitle: "客户意向分布",
			interestData: [
				{
					value: 123,
					name: "意向A",
				},
			],
			quesInteractiveTitle: "交互问答方式",
			quesInteractiveData: [
				{
					value: 310,
					name: "点击交互",
				},
			],
			addCustomerNum: 0,
			addCustomerLabel: "",
			activeCustomerNum: 0,
			activeCustomerLabel: "",
			//
			addCustomerRank: [],
			activeCustomerRank: [],
			addChartData: [],
			activeChartData: [],
		};
	},
	mounted() {
		this.$nextTick().then(() => {
			console.log(this.$route.params.prodId);
			const params = {
				corpId: this.$storage.getCorpId(),
				dateType: 4,
				endTime: "",
				prodId: this.$route.params.prodId,
				startTime: "",
				username: this.$route.params.username,
			};
			this.prodOverviewDetail(params);
			this.distributionStatistic(params);
			this.customerStatistic(params);
		});
	},
	methods: {
		prodOverviewDetail(params) {
			queryProdOverviewDetail(params).then((res) => {
				if (res.code == "OK") {
					this.statisticForm = res.rows[0];
					this.quesInteractiveData[0].value = this.statisticForm.totalQAClick;
				} else {
					this.$message({
						message: res.msgExt,
						type: "error",
					});
				}
			});
		},
		distributionStatistic(params) {
			queryDistributionStatistic(params).then((res) => {
				if (res.code == "OK") {
					this.customerSourceData = res.rows
						.filter((item) => {
							return item.type == 1;
						})
						.map((child) => {
							return {
								value: child.num,
								name: child.name,
							};
						});
					this.chatChannelData = res.rows
						.filter((item) => {
							return item.type == 2;
						})
						.map((child) => {
							return {
								value: child.num,
								name: child.name,
							};
						});
					this.interestData = res.rows
						.filter((item) => {
							return item.type == 3;
						})
						.map((child) => {
							return {
								value: child.num,
								name: child.name,
							};
						});
				} else {
					this.$message({
						message: res.msgExt,
						type: "error",
					});
				}
			});
		},
		customerStatistic(params) {
			queryCustomerStatistic(params).then((res) => {
				if (res.code == "OK") {
					const addData = res.rows.filter((item) => item.type == 1);
					const activeData = res.rows.filter((item) => item.type == 2);
					this.addCustomerLabel = `新增用户(${addData[0].num})`;
					this.addCustomerRank = addData[0].phoneTypeRankDTOList;
					this.addChartData = addData[0].areaDTOList.map((item) => {
            return {
              name: item.area,
              value: item.num
            }
          });

					this.activeCustomerLabel = `活跃用户(${activeData[0].num})`;
					this.activeCustomerRank = activeData[0].phoneTypeRankDTOList;
					this.activeChartData = activeData[0].areaDTOList.map((item) => {
            return {
              name: item.area,
              value: item.num
            }
          });
				} else {
					this.$message({
						message: res.msgExt,
						type: "error",
					});
				}
			});
		},
	},
};
</script>

<style scoped lang="scss">
.digital {
	padding: 25px 30px;
	.product_all {
		display: flex;
		flex-wrap: wrap;
		height: 50px;
		.top-title {
			display: flex;
			justify-content: space-between;
			width: 100%;
			justify-content: space-between;
			.right-form-area {
				float: right;
				.item {
					width: 100px;
				}
			}
		}
	}
	.static-area {
		display: flex;
		justify-content: space-between;
		width: 100%;
		.left {
			width: calc(50% - 6px);
			background: #3684ff;
			height: 100px;
			border-radius: 4px;
			display: flex;
			.static-item {
				width: 33.3%;
				margin: 20px 0;
				.text {
					height: 20px;
					line-height: 20px;
					font-size: 14px;
					color: #ffffff;
					text-align: center;
				}
				.num {
					height: 50px;
					line-height: 50px;
					font-size: 26px;
					color: #ffffff;
					text-align: center;
				}
			}
			.static-item-right-border {
				border-right: 1px solid rgba(255, 255, 255, 0.4);
			}
		}
		.right {
			width: calc(50% - 6px);
			height: 100px;
			background: #23c6f4;
			border-radius: 4px;
			display: flex;
			.static-item {
				width: 33.3%;
				margin: 20px 0;
				.text {
					height: 20px;
					line-height: 20px;
					font-size: 14px;
					color: #ffffff;
					text-align: center;
				}
				.num {
					height: 50px;
					line-height: 50px;
					font-size: 26px;
					color: #ffffff;
					text-align: center;
				}
			}
			.static-item-right-border {
				border-right: 1px solid rgba(255, 255, 255, 0.4);
			}
		}
	}
	.customer_source {
		margin-top: 20px;
		display: flex;
		height: 300px;
		justify-content: space-between;
		& > div {
			width: calc(50% - 10px);
			background: #ffffff;
			padding: 12px;
			border-radius: 4px;
		}
		.chart {
			height: 100%;
			width: 100%;
		}
	}
	.client_portrait {
		margin-top: 20px;
		height: 300px;
		.chart_area {
			height: 100%;
			display: flex;
			justify-content: space-between;
			.chart_parent {
				padding: 12px;
				width: calc(50% - 10px);
				height: 100%;
				text-align: center;
				background: #ffffff;
				.chart {
					width: 100%;
					height: 100%;
				}
			}
			.quesInteractiveChart {
				width: 100%;
				height: 100%;
			}
		}
	}
	.question-statistics::v-deep {
		.el-tabs__header {
			margin: 0;
		}
		.el-tabs {
			width: 100%;
		}
		display: flex;
		height: 600px;
		margin-top: 20px;
		background: #ffffff;
		.right {
			width: 240px;
		}
		.left {
			width: calc(100% - 240px);
		}
	}
}
</style>
