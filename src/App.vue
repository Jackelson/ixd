<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:29
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-03 22:21:57
-->
<template>
  <router-view />
</template>
<script>
import * as echarts from 'echarts'
import { provide, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    provide('ec', echarts)//provide
		
		// 解决 ElTable 自动宽度高度导致的「ResizeObserver loop limit exceeded」问题
    const debounce = (fn, delay) => {
      let timer = null;
      return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      }
    }
    const _ResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
      constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
      }
    }
		onMounted(() => {
       
    });

  },
  components: {
  }
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
