<template>
	<div class="chart-body">
		<div class="interestChart" id="interestChart"></div>
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
			interestChart: null,
		};
  },
  watch: {
    chartData: {
      handler() {
        this.drawInterestChart();
      },
      deep: true,
    }
  },
	mounted() {
		this.interestChart = echarts.init(document.getElementById("interestChart"));
		this.$nextTick().then(() => {
			this.drawInterestChart();
		});
	},
	methods: {
		drawInterestChart() {
			var option = {
				title: {
					text: this.title,
				},
				color: ["#F85656", "#18BB92", "#3080FF", "#6B4CFE"],
				legend: {
					orient: "vertical",
					icon: "circle",
					top: "center",
					right: "5%",
					data: this.chartData.map(item => item.name),
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
			this.interestChart.clear();
			this.interestChart.setOption(option);
			this.interestChart.resize();
			window.addEventListener("resize", this.interestChart.resize);
		},
	},
};
</script>

<style lang="scss" scoped>
.chart-body {
	height: 100%;
	width: 100%;
	.interestChart {
		height: 100%;
		width: 100%;
	}
}
</style>
