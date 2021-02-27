<template>
  <div class="chart-body">
    <div class="scatterGram" id="scatterGram"></div>
  </div>
</template>

<script>
import echarts from "echarts";

import 'echarts/map/js/china'
export default {
  props: {
    chartData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    chartData: {
      handler() {
        this.drawscatterGram();
      },
      deep: true
    }
  },
  data() {
    return {
      scatterGram: null,
    };
  },
  mounted() {
    this.scatterGram = echarts.init(document.getElementById("scatterGram"));
    this.$nextTick().then(() => {
      this.drawscatterGram();
    });
  },
  methods: {
    drawscatterGram() {
      var outdata = this.chartData;

      var max = 500,
        min = 10;
      var maxSize4Pin = 100,
        minSize4Pin = 20;
      var geoCoordMap = {};
      /*获取地图数据*/
      var mapFeatures = echarts.getMap("china").geoJson.features;
      //  console.log(mapFeatures)
      mapFeatures.forEach(function (v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
      });
      var convertData = function (outdata) {
        var res = [];
        for (var i = 0; i < outdata.length; i++) {
          var geoCoord = geoCoordMap[outdata[i].name];
          if (geoCoord) {
            res.push({
              name: outdata[i].name,
              value: geoCoord.concat(outdata[i].value),
            });
          }
        }
        return res;
      };
      var option = {
        // backgroundColor: "#0F1C3C",
        tooltip: {
          show: true,
          formatter: function (params) {
            if (!params.value) {
                 return (
                "&nbsp;&nbsp;" +
                params.name +
                "&nbsp;&nbsp;&nbsp;0人&nbsp;&nbsp;"
              )
            }
            if (params.value.length > 1) {
              return (
                "&nbsp;&nbsp;" +
                params.name +
                "&nbsp;&nbsp;&nbsp;" +
                params.value[2] +
                "人&nbsp;&nbsp;"
              );
            } else {
              return (
                "&nbsp;&nbsp;" +
                params.name +
                "&nbsp;&nbsp;&nbsp;" +
                params.value +
                "人&nbsp;&nbsp;"
              );
            }
          },
        },
        geo: {
          map: "china",
          show: true,
          roam: false,
          label: {
            emphasis: {
              show: true,
            },
          },
          layoutSize: "100%"
        },
        series: [
          {
            type: "map",
            map: "china",
            aspectScale: 0.75,
            label: {
              normal: {
                show: true,
                color: '#ccc'
              },
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                color: "#000",
                areaColor: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#073684", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#061E3D", // 100% 处的颜色
                    },
                  ],
                },
                borderColor: "#215495",
                borderWidth: 1,
              }
            },
            data: outdata,
          },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            rippleEffect: {
              brushType: "stroke",
            },
            showEffectOn: "render",
            itemStyle: {
              normal: {
                color: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(5,80,151,0.2)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(5,80,151,0.8)",
                    },
                    {
                      offset: 1,
                      color: "rgba(0,108,255,0.7)",
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
            label: {
              normal: {
                show: true,
                color: "#fff",
                fontWeight: "bold",
                position: "inside",
                formatter: function (para) {
                  return "{cnNum|" + para.data.value[2] + "}";
                },
                rich: {
                  cnNum: {
                    fontSize: 13,
                    color: "#fff",
                  },
                },
              },
            },
            symbol: "circle",
            symbolSize: function (val) {
              if (val[2] === 0) {
                return 0;
              }
              var a = (maxSize4Pin - minSize4Pin) / (max - min);
              var b = maxSize4Pin - a * max;
              return a * val[2] + b * 1.2;
            },
            data: convertData(outdata),
            zlevel: 1,
          },
        ],
      };
      this.scatterGram.clear();
      this.scatterGram.setOption(option);
      this.scatterGram.resize();
      window.addEventListener("resize", this.scatterGram.resize);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-body {
  height: 100%;
  width: 100%;
  .scatterGram {
    height: 100%;
    width: 100%;
  }
}
</style>
