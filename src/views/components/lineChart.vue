<template>
  <div :id="chartName" :style="{ height: height, width: width }"></div>
</template>
  <script>
import { inject, onMounted, watch, reactive, onUnmounted } from "vue";

export default {
  name: "data_page",
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
		console.log(props.chartData, '555555555555555');
    const dataMap = reactive({
      chartName: props.chartName,
      chartData: props.chartData,
    })
    let echarts = inject("ec");//引入
    let chart; // 这里是chart的根
    // 绘制图表
    const chartOption = (param) => chart.setOption({
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
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      formatter: (params) => {
        return (
          params[0].data.name + ':' + params[0].data.value
        );
      },
      legend: {
        data: param.map((item) => item.app_name),
        bottom: 'bottom'
      },
      xAxis: [
        {
          type: 'category',
          data: param.map((item) => item.app_name),
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
					minInterval:1,
          // max: 250,
          // interval: 50,
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          show: false,
        }
      ],
      series: [
        {
          name: param.map((item) => item.app_name),
          type: 'bar',
          barWidth: 30, // 柱图宽度
          barMaxWidth: 30, // 最大宽度
          tooltip: {
            valueFormatter: function (value) {
              return value + '';
            }
          },
          data: param.map((item) => ({ value: item.requestCount, name: item.app_name }))
        },
        {
          type: 'line',
          yAxisIndex: 1,
          data: param.map((item) => ({ value: item.requestCount, name: item.app_name }))
        }
      ]
    })




    watch(() => props.chartData,
      (count, prevCount) => {
        // 监听数据变了  就重新绘制一遍  也就是大佬们说的  "切记，数据变化后需要再次调init方法刷线图表"
        // 绘制图表
        dataMap.chartData = count
        // chartPrepare()
        chartOption(count)
        console.log(dataMap.option, dataMap.chartData, 'dataMap.option');
        console.log(count, prevCount);
      }, {
      deep: true
    }
    )


    onMounted(() => {
      chart = echarts.init(document.getElementById(dataMap.chartName));  // 这里就可以获取到这个元素了

      chartOption(props.chartData)  // 绘制图表

      // window.onresize = function () { //自适应大小
      //   chart.resize();
      // };
    });
    onUnmounted(() => {

    })

    return {
      chartOption
    }
  },
  components: {},

};
</script>