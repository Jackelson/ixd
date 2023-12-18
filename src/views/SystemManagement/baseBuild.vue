<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item
        label="底层建设信息"
        v-if="isCheckString.indexOf('javaName') >= 0"
      >
        <searchLog
          v-model="searchForm.javaName"
          selectKey="javaName"
          ref="searchLogRef"
          :searchData="searchData"
        ></searchLog>
      </el-form-item>
      <el-form-item label="类别" v-if="isCheckString.indexOf('type') >= 0">
        <el-select v-model="searchForm.type">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button v-if="isCheckString != ''" @click="getData">查询</el-button>
        <el-button v-if="isCheckString != ''" @click="resetData"
          >清空</el-button
        >
        <el-button @click="checkSeach">筛选搜索框</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="getConfigInfo">微服务应用配置信息查询</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sort" label="序号" align="center" width="80">
        <template #default="{ $index }">
          <span>
            {{ $index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="javaName" label="底层建设信息" align="center" />
      <el-table-column prop="type" label="类别" align="center">
        <template #default="{ row }">
          <span>
            {{ judgeStatus(row.state) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="showConfig" title="配置信息详情">
      <div class="wape_list">
        <div v-for="(n, index) in info" :key="index">
          {{ n }}
        </div>
      </div>
    </el-dialog>
    <pickModel
      ref="pickSearchRef"
      :data="searchData"
      :isCheck="isCheckString"
      @reload="getFilterNum"
    ></pickModel>
  </el-card>
</template>

<script setup>
import { ref } from "vue";

import { getBottomBuildLog, getCInfo } from "@/api/baseSet";
import searchLog from "@/views/components/searchLog.vue";
import { useRoute } from "vue-router";
import pickModel from "@/views/ApplicationManagement/component/pickModel.vue";
import { getFilterCon } from "@/api/application";
const route = useRoute();
const isCheckString = ref("javaName,type");
const judgeStatus = (type) => {
  return options.value.filter((o) => o.value == type)[0].label;
};
const options = ref([
  {
    label: "控制层",
    value: "1",
  },
  {
    label: "服务层",
    value: "2",
  },
  {
    label: "缓存层",
    value: "3",
  },
  {
    label: "数据层",
    value: "4",
  },
]);
const searchData = ref({
  userId: localStorage.getItem("createById"),
  menuId: route.path,
});

const getFilterNum = async () => {
  const res = await getFilterCon(searchData.value);
  if (res.code == 200) {
    res.data.forEach((item) => {
      if (item.menuId == searchData.value.menuId) {
        isCheckString.value = item.paramslist;
      }
    });
  }
};
const pickSearchRef = ref();
function checkSeach() {
  pickSearchRef.value.open();
}

const searchForm = ref({
  type: "1",
});
const tableData = ref([]);

const searchLogRef = ref();

const getData = async () => {
  const res = await getBottomBuildLog(searchForm.value);
  if (res.code == 200) {
    tableData.value = res.data.rows;
  }
  await searchLogRef.value.addRecord();
  await searchLogRef.value.remoteMethod();
};
getData();

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

const resetData = () => {
  searchForm.value = {
    type: 1,
  };
  getData();
};
</script>

<style lang="scss" scoped>
.wape_list {
  max-height: 500px;
  overflow: auto !important;
}
</style>
