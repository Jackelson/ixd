<template>
  <div :id="chartName" :style="{ height: height, width: width }"></div>
</template>
<script>
import { inject, onMounted, watch, reactive, onUnmounted } from "vue";

export default {
  name: "bar",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: "100%",
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartName: String,
  },
  setup(props) {
    const dataMap = reactive({
      chartName: props.chartName,
      chartData: props.chartData,
    });
    let echarts = inject("ec"); //引入
    let chart; // 这里是chart的根
    // 绘制图表
    const chartOption = (param) => {
      const isBar = props.chartName == "selectAppOnLineUser" ? true : false;
      return chart.setOption({
        // title: {
        //   show: true,
        //   text: '单位： 个',
        //   right: '10%',
        //   textStyle: {
        //     color: "rgb(43,52,56)",
        //     fontSize: "0.75rem",
        //   },
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        formatter: (params) => {
          return params[0].data.name + ":" + params[0].data.value;
        },
        legend: {
          data: isBar
            ? param.map((item) => item.appName)
            : param.map((item) => item.date),
          bottom: "bottom",
        },
        xAxis: [
          {
            type: "category",
            data: isBar
              ? param.map((item) => item.appName)
              : param.map((item) => item.date),
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            min: 0,
            minInterval: 1,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            show: false,
          },
        ],
        series: isBar
          ? [
              {
                name: param.map((item) => item.app_name),
                type: "bar",
                barWidth: 30, // 柱图宽度
                barMaxWidth: 30, // 最大宽度
                tooltip: {
                  valueFormatter: function (value) {
                    return value + "";
                  },
                },
                data: param.map((item) => ({
                  value: item.size,
                  name: item.appName,
                })),
              },
            ]
          : [
              {
                type: "line",
                yAxisIndex: 1,
                data: param.map((item) => ({
                  value: item.num,
                  name: item.date,
                })),
              },
            ],
      });
    };

    watch(
      () => props.chartData,
      (count) => {
        // 监听数据变了  就重新绘制一遍  也就是大佬们说的  "切记，数据变化后需要再次调init方法刷线图表"
        // 绘制图表
        dataMap.chartData = count;
        // chartPrepare()
        chartOption(count);
      },
      {
        deep: true,
      }
    );

    onMounted(() => {
      chart = echarts.init(document.getElementById(dataMap.chartName)); // 这里就可以获取到这个元素了

      chartOption(props.chartData); // 绘制图表

      // window.onresize = function () { //自适应大小
      //   chart.resize();
      // };
    });
    onUnmounted(() => {});

    return {
      chartOption,
    };
  },
  components: {},
};
</script>
