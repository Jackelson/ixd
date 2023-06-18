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
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        bottom: 'bottom'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          data: param.map((item) => ({
              name: item.name,
              value: item.value,
            })),
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })






    watch(() => props.chartData,
      (count, prevCount) => {
        // 监听数据变了  就重新绘制一遍  也就是大佬们说的  "切记，数据变化后需要再次调init方法刷线图表"
        // 绘制图表
        dataMap.chartData = count
        console.log(prevCount, dataMap.chartData, '444444444444');

        // chartPrepare()
        chartOption(count)
      }, {
      deep: true
    }
    )


    onMounted(() => {
      chart = echarts.init(document.getElementById(dataMap.chartName));  // 这里就可以获取到这个元素了

      // chartOption(props.chartData)  // 绘制图表

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