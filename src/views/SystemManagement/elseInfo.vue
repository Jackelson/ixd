<template>
  <div>
    <el-card>
      <el-space
        ><el-button @click="getInfo"> 接口信息查询</el-button>
        <el-button @click="getRegister"> 注册中心查询</el-button>
        <el-button @click="getConfigInfo">微服务应用配置信息查询</el-button>
      </el-space>
    </el-card>
    <el-dialog v-model="showConfig" title="配置信息详情">
      <div class="wape_list">
        <div v-for="(n, index) in info" :key="index">
          {{ n }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getCInfo } from "@/api/baseSet";
import { getPortInfo, getRegisterInfo } from "@/api/system";
const getInfo = async () => {
  const res = await getPortInfo();
  if (res.code == 200) {
    window.open(res.data);
  }
};
const getRegister = async () => {
  const res = await getRegisterInfo();
  if (res.code == 200) {
    window.open(res.data);
  }
};
const showConfig = ref(false);
const info = ref([]);
const getConfigInfo = async () => {
  const res = await getCInfo();
  if (res.code == 200) {
    showConfig.value = true;
    // console.log(res.data.split("\n"));
    info.value = res.data.split("\n");
  }
};
</script>

<style lang="scss" scoped>
.wape_list {
  max-height: 500px;
  overflow: auto !important;
}
</style>
