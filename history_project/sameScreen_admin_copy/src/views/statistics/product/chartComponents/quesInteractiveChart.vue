<template>
	<div class="chart-body">
		<div class="quesInteractiveChart" id="quesInteractiveChart"></div>
	</div>
</template>

<script>
import echarts from "echarts";
export default {
	props: {
		chartData: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			quesInteractiveChart: null,
		};
	},
	watch: {
		chartData: {
			handler() {
				this.drawQuesInteractiveChart();
			},
			deep: true,
		},
	},
	mounted() {
		this.quesInteractiveChart = echarts.init(
			document.getElementById("quesInteractiveChart")
		);
		this.$nextTick().then(() => {
			this.drawQuesInteractiveChart();
		});
	},
	methods: {
		drawQuesInteractiveChart() {
			var option = {
				color: ["#18BB92", "#3080FF"],
				title: {
					text: "交互问答方式",
				},
				legend: {
					orient: "vertical",
					top: "center",
					icon: "circle",
					right: "5%",
					data: this.chartData.map((item) => item.name),
					textStyle: {
						// color: "#fff",
						fontSize: 16,
					},
				},
				tooltip: {
					trigger: "item",
					// formatter: "{a} <br/>{b} : {c} ({d}%)",
				},
				series: [
					{
						type: "pie",
						radius: "70%",
						center: ["40%", "50%"],
						label: {
							normal: {
								fontSize: 16,
							},
						},
						itemStyle: {
							//图形样式
							normal: {
								borderColor: "#ffffff",
								borderWidth: 3,
							},
						},
						data: this.chartData,
					},
				],
			};
			this.quesInteractiveChart.clear();
			this.quesInteractiveChart.setOption(option);
			this.quesInteractiveChart.resize();
			window.addEventListener("resize", this.quesInteractiveChart.resize);
		},
	},
};
</script>

<style lang="scss" scoped>
.chart-body {
	height: 100%;
	width: 100%;
	.quesInteractiveChart {
		height: 100%;
		width: 100%;
	}
}
</style>
