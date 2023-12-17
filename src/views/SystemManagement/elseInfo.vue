<template>
  <div>
    <el-card>
      <el-space
        ><el-button @click="getInfo"> 接口信息查询</el-button>
        <el-button @click="getRegister"> 注册中心查询</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup>
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
</script>

<style lang="scss" scoped></style>
