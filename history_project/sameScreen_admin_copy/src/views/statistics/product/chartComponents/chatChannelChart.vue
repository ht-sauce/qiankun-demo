<template>
	<div class="chart-body">
		<div class="chatChannelChart" id="chatChannelChart"></div>
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
			chatChannelChart: null,
		};
	},
	watch: {
		chartData: {
			handler() {
				this.drawChatChannelChart();
			},
			deep: true,
		},
	},
	mounted() {
		this.chatChannelChart = echarts.init(document.getElementById("chatChannelChart"));
		this.$nextTick().then(() => {
			this.drawChatChannelChart();
		});
	},
	methods: {
		drawChatChannelChart() {
			var option = {
				title: {
					text: "微信聊天渠道总览",
				},
				color: ["#18BB92", "#3080FF"],
				legend: {
					orient: "vertical",
					icon: "circle",
					top: "center",
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
			this.chatChannelChart.clear();
			this.chatChannelChart.setOption(option);
			this.chatChannelChart.resize();
			window.addEventListener("resize", this.chatChannelChart.resize);
		},
	},
};
</script>

<style lang="scss" scoped>
.chart-body {
	height: 100%;
	width: 100%;
	.chatChannelChart {
		height: 100%;
		width: 100%;
	}
}
</style>
