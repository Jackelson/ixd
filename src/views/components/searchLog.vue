<template>
  <el-select
    style="width: 200px"
    v-model="name"
    filterable
    remote
    :clearable="true"
    reserve-keyword
    allow-create
    placeholder="请输入"
    :loading="searchLoading"
    @change="change"
  >
    <template v-if="searchRecords.length > 0">
      <el-option
        v-for="item in searchRecords"
        :key="item.selectContentList"
        :label="item.selectContentList"
        :value="item.selectContentList"
      />
    </template>
  </el-select>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits } from "vue";
import { getSeachRecord, addSeachRecord } from "@/api/application";
const props = defineProps({
  searchData: {
    type: Object,
  },
  selectKey: {
    type: String,
  },
  modelValue: {
    type: String,
  },
});

const emits = defineEmits(["update:modelValue"]);
const searchLoading = ref(false);
const searchRecords = ref([]);
const name = ref("");
//  搜索记录
const remoteMethod = async () => {
  searchLoading.value = true;
  const selectKey = props.selectKey;
  const data = { ...props.searchData, selectKey };
  const res = await getSeachRecord(data);
  searchLoading.value = false;
  if (res.code == 200) {
    searchRecords.value = res.data.filter(
      (item) => item.selectContentList != null && item.selectContentList !== ""
    );
  }
};
remoteMethod();
//  选择完成事件
const change = (value) => {
  emits("update:modelValue", value);
};

const addRecord = async () => {
  const selectKey = props.selectKey;
  const data = {
    ...props.searchData,
    selectKey,
    selectContentList: name.value,
  };
  const res = await addSeachRecord(data);
  if (res.code == 200) {
    searchRecords.value = res.data;
  }
};
console.log(addRecord);
defineExpose({ remoteMethod, addRecord });
</script>

<style lang="scss" scoped></style>
