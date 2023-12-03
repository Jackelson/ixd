<template>
  <el-dialog v-model="visible" title="选择筛选框">
    <template #default>
      <div v-if="data.menuId == '/application'">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="appName">
            <div class="label">应用名称输入搜索框</div>
          </el-checkbox>
          <el-checkbox label="appCheckStatus">
            <div class="label">应用状态选择框</div>
          </el-checkbox>
          <el-checkbox label="businessType">
            <div class="label">业务域选择框</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div v-if="data.menuId == '/userManagement'">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="userName">
            <div class="label">用户名</div>
          </el-checkbox>
          <el-checkbox label="roleId">
            <div class="label">角色</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps, defineEmits, watchEffect } from "vue";
import { editFilterCon } from "@/api/application";

const props = defineProps({
  data: {
    type: Object,
  },
  isCheck: {
    type: String,
  },
});

const emits = defineEmits(["reload"]);
const visible = ref(false);
const checkList = ref([]);

const open = () => {
  visible.value = true;
};
// checkList.value = props.isCheck.split(",");
// watch(
//   () => props.isCheck,
//   (n, o) => {
//     console.log(n, o);
//     checkList.value = props.isCheck.split(",");
//   },
//   { immediate: true }
// );
watchEffect(() => {
  checkList.value = props.isCheck.split(",");
});
const save = async () => {
  const paramslist = checkList.value.join(",");
  const data = {
    ...props.data,
    paramslist,
  };
  const res = await editFilterCon(data);
  if (res.code == 200) {
    emits("reload");
    visible.value = false;
  }
  console.log(res);
};
defineExpose({ open });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
