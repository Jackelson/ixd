<template>
  <router-view />
</template>
<script>
import * as echarts from 'echarts'
import { provide } from 'vue'

export default {
  name: 'App',
  setup() {
    provide('ec', echarts)//provide
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
