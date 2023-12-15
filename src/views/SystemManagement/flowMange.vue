<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item
        label="bpmn中文名称"
        v-if="isCheckString.indexOf('bpmnName') >= 0"
      >
        <searchLog
          v-model="searchForm.bpmnName"
          selectKey="bpmnName"
          ref="searchLogRef"
          :searchData="searchData"
        ></searchLog>
      </el-form-item>
      <el-form-item label="">
        <el-button v-if="isCheckString != ''" @click="getData">查询</el-button>
        <el-button v-if="isCheckString != ''" @click="resetData"
          >清空</el-button
        >
        <el-button @click="checkSeach">筛选搜索框</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="create">创建流程</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="bpmnName" label="bpmn中文名字" align="center" />
      <el-table-column
        prop="bpmnFileName"
        label="bpmn附件名字"
        align="center"
      />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          <span>
            {{ judgeStatus(row.state) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="" label="操作" align="center">
        <template #default="{ row }">
          <el-space>
            <el-button @click="downFile(row)">下载</el-button>
            <el-button @click="configNode(row)">配置节点</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; float: right; margin-bottom: 10px"
      v-model:current-page="searchForm.pageNum"
      v-model:page-size="searchForm.pageSize"
      :page-sizes="[10, 15, 20, 30]"
      small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="getData"
      @current-change="getData"
    />
    <createFlow
      ref="flowRef"
      @success="
        getData({
          pageNum: 1,
          pageSize: 10,
        })
      "
    ></createFlow>
    <config
      ref="configRef"
      @success="
        getData({
          pageNum: 1,
          pageSize: 10,
        })
      "
    ></config>
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
import createFlow from "./component/createFlow.vue";
import config from "./component/config.vue";
import { getFlowList, downFlow } from "@/api/flow";
import searchLog from "@/views/components/searchLog.vue";
import { useRoute } from "vue-router";
import pickModel from "@/views/ApplicationManagement/component/pickModel.vue";
import { getFilterCon } from "@/api/application";
const route = useRoute();
const isCheckString = ref("bpmnName");
const judgeStatus = (status) => {
  switch (status) {
    case -1:
      return "删除";
    case 0:
      return "未配置";
    case 1:
      return "已配置";
    default:
      break;
  }
};

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
const flowRef = ref();
const create = () => {
  flowRef.value.open();
};
const total = ref(0);
const searchForm = ref({
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref([]);

const searchLogRef = ref();

const getData = async (params) => {
  if (params) {
    searchForm.value.pageNum = params.pageNum;
    searchForm.value.pageSize = params.pageSize;
  }
  const res = await getFlowList(searchForm.value);
  if (res.code == 200) {
    tableData.value = res.data.rows;
    total.value = res.data.total;
  }
  await searchLogRef.value.addRecord();
  await searchLogRef.value.remoteMethod();
};
getData();
// 下载文件
const downFile = async (record) => {
  const res = await downFlow({ id: record.id });
  const blob = new Blob([res]);
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = record.bpmnFileName; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
  console.log(res);
};

const configRef = ref();
const configNode = (record) => {
  configRef.value.open(record);
};

const resetData = () => {
  searchForm.value = {
    pageNum: 1,
    pageSize: 10,
  };
  getData();
};
</script>

<style lang="scss" scoped></style>
