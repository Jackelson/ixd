<template>
  <el-dialog v-model="visible" title="流程图">
    <template #default>
      <div>
        <!-- <img src="../../../assets/online.jpg" /> -->
        <img :src="props.src" style="width: 100%; height: 100%" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps } from "vue";
// src
const props = defineProps({
  src: {
    type: String,
  },
});
console.log(props.src);
const visible = ref(false);

const open = () => {
  visible.value = true;
};
defineExpose({ open });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
