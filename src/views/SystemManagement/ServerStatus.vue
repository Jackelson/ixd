<template>
  <div>
    <div class="item">
      <el-card style="margin-bottom: 10px">
        <el-space :size="30">
          <span>路由分配IP: {{ info.routerIp }}</span>
          <span>本地IP: {{ info.localIp }}</span>
          <span>系统名称: {{ info.osName }}</span>
          <span>cpu使用占比: {{ info.systemCpuLoad }}</span>
        </el-space>
      </el-card>
      <el-card style="margin-bottom: 10px">
        <template #header>
          <div class="card-header">
            <span>物理内存</span>
          </div>
        </template>
        <div class="content">
          <el-space :size="30">
            <span>已用: {{ info.usedMemory }}GB</span>
            <span>剩余: {{ info.freePhysicalMemorySize }}GB</span>
            <span>总内存: {{ info.usedMemory }}GB</span>
            <span>使用占比: {{ info.memoryLoad }}</span>
          </el-space>
        </div>
      </el-card>

      <el-card style="margin-bottom: 10px">
        <template #header>
          <div class="card-header">
            <span>磁盘</span>
          </div>
        </template>
        <div class="content">
          <el-space :size="30">
            <span>未使用: {{ info.freeSpace }}GB</span>
            <span>负载: {{ info.diskLoad }}GB</span>
            <span>已使用: {{ info.usedDisk }}GB</span>
            <span>总内存: {{ info.totalDisk }}GB</span>
          </el-space>
        </div>
      </el-card>
      <el-card style="margin-bottom: 10px">
        <template #header>
          <div class="card-header">
            <span>jvm</span>
          </div>
        </template>
        <div class="content">
          <el-space :size="30" wrap>
            <span>未使用: {{ info.jvmFreeMemory }}GB</span>
            <span>负载: {{ info.jvmMemoryLoad }}GB</span>
            <span>已使用: {{ info.jvmUseMemory }}GB</span>
            <span>总内存: {{ info.jvmTotalMemory }}GB</span>
            <span>可申请最大内存: {{ info.jvmMaxMemory }}GB</span>
            <span>线程负载: {{ info.processCpuLoad }}GB</span>
          </el-space>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { getServersInfo } from "@/api/system";
import { ref } from "vue";
const info = ref({
  freePhysicalMemorySize: "", //剩余物理内存大小
  totalMemorySize: "", //物理内存大小
  usedMemory: "", //已使用物理内存大小
  routerIp: "", //获取路由分配的IP
  freeSpace: "", //获取磁盘未使用大小（单位：G）
  memoryLoad: "", //内存使用占比
  diskLoad: "", //获取磁盘负载（单位：G）
  jvmMemoryLoad: "", //JVM内存负载
  jvmFreeMemory: "", //JVM内存的空闲空间
  usedDisk: "", //获取磁盘已使用大小（单位：G）
  osName: "", //系统名称
  totalDisk: "", //获取磁盘已使用大小（单位：G）
  processCpuLoad: "", //获取jvm线程负载
  systemCpuLoad: "", //cpu使用占比
  jvmTotalMemory: "", //JVM总内存空间（单位:M）
  localIp: "", //获取本地IP
  jvmUseMemory: "", //JVM内存已用的空间（单位:M）
  jvmMaxMemory: "", //JVM最大能够申请的内存（单位:M）
});
const getData = async () => {
  const res = await getServersInfo();
  if (res.code == 200) {
    info.value = res.data;
  }
};
getData();
</script>

<style lang="scss" scoped></style>
