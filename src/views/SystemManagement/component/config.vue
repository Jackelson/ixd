<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :destroy-on-close="true"
    width="40%"
    :before-close="handleClose"
  >
    <div class="dialogCenter">
      <el-timeline>
        <el-timeline-item
          v-for="n in list"
          :key="n.key"
          :timestamp="n.key"
          placement="top"
        >
          <el-card v-if="n.key != '开始-Start' && n.key != '结束-End'">
            <el-button size="small" @click="pick(n.key)">
              选择审批人
            </el-button>
            <p>当前选择: {{ n.label }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <pickPeople ref="pickRef" @picked="picked"> </pickPeople>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import { getFlowNode, configuration } from "@/api/flow";
import pickPeople from "./pickPeople.vue";
import { ElMessage } from "element-plus";
const title = ref("配置节点");
const dialogVisible = ref(false);
const list = ref([]);
const currentRow = ref({});
const emits = defineEmits(["success"]);
const id = ref();
const open = async (record) => {
  console.log(record);
  const res = await getFlowNode({
    // id: record.id,record.businessKey + ":" +
    // processDefinitionId: record.bpmnId,
    processDefinitionId: record.businessKey,
  });
  currentRow.value = record;
  if (res.data.rows.length <= 0) {
    ElMessage.warning("当前流程数据错误");
    return;
  }
  id.value = res.data.rows[0].id || "";
  const flowsObj = JSON.parse(res.data.rows[0].taskUserJson || "{}");
  Object.keys(flowsObj).forEach((key) => {
    console.log(key);
    list.value.push({
      key,
      label: flowsObj[key],
    });
  });
  dialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
  list.value = [];
};

const pickRef = ref();

const currentKey = ref("");
// 开始点击时候
const pick = (key) => {
  currentKey.value = key;
  pickRef.value.open();
};
// 选择完之后
const picked = (row) => {
  list.value.forEach((item) => {
    if (item.key == currentKey.value) {
      item.label = row.userName;
    }
  });
};
//提交
const submit = async () => {
  const listArray = list.value;
  let peopleObj = {};
  for (let i = 0; i < listArray.length; i++) {
    if (listArray[i].key != "开始-Start" && listArray[i].key != "结束-End") {
      if (listArray[i].label == "") {
        ElMessage.warning("请补全审批人再提交");
        return;
      }
    }
    peopleObj[listArray[i].key] = listArray[i].label;
  }
  const params = {
    id: id.value,
    taskUserJson: JSON.stringify(peopleObj),
  };
  const res = await configuration(params);
  if (res.code == 200) {
    ElMessage.success("配置成功");
    handleClose();
    emits("success");
  }
};

defineExpose({ open });
</script>

<style lang="scss" scoped>
.dialogCenter {
  display: flex;
  justify-content: center;
}
.el-timeline {
  width: 200px;
  padding-left: 40px;
}
</style>
