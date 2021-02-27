<template>
	<div class="chart-body">
		<div class="customerSourceChart" id="customerSourceChart"></div>
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
			customerSourceChart: null,
		};
	},
	watch: {
		chartData: {
			handler() {
				this.drawCustomerSourceChart();
			},
			deep: true,
		},
	},
	mounted() {
		this.customerSourceChart = echarts.init(
			document.getElementById("customerSourceChart")
		);
		this.$nextTick().then(() => {
			this.drawCustomerSourceChart();
		});
	},
	methods: {
		drawCustomerSourceChart() {
			var option = {
				title: {
					// text: "客户来源渠道总览",
					text: this.title,
				},
				color: ["#F85656", "#18BB92", "#3080FF"],
				legend: {
					orient: "vertical",
					icon: "circle",
					top: "center",
					right: "5%",
					data: this.chartData.map((item) => item.name),
					textStyle: {
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
			this.customerSourceChart.clear();
			this.customerSourceChart.setOption(option);
			this.customerSourceChart.resize();
			window.addEventListener("resize", this.customerSourceChart.resize);
		},
	},
};
</script>

<style lang="scss" scoped>
.chart-body {
	height: 100%;
	width: 100%;
	.customerSourceChart {
		height: 100%;
		width: 100%;
	}
}
</style>
