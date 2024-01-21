<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item
        label="流程中文名称"
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
    <el-space>
      <el-button @click="create">创建流程</el-button>
      <el-button @click="handelDownPack">下载流程定义安装包</el-button>
      <el-button @click="handelTemplate">下载流程绑定模板</el-button>
    </el-space>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="bpmnName" label="流程中文名字" align="center" />
      <el-table-column
        prop="bpmnFileName"
        label="流程附件名字"
        align="center"
      />
      <!-- <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          <span>
            {{ judgeStatus(row.state) }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="createName" label="创建人" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="" label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-space>
            <el-button size="small" @click="downFile(row)">下载</el-button>
            <el-button size="small" @click="configNode(row)"
              >配置节点</el-button
            >
            <el-button size="small" @click="handelDel(row)">删除</el-button>
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
      @size-change="changeSize"
      @current-change="changePage"
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
import {
  getFlowList,
  downFlow,
  downPack,
  deleteProcess,
  downTemplate,
} from "@/api/flow";
import searchLog from "@/views/components/searchLog.vue";
import { useRoute } from "vue-router";
import pickModel from "@/views/ApplicationManagement/component/pickModel.vue";
import { getFilterCon } from "@/api/application";
import { ElMessageBox, ElMessage } from "element-plus";
const route = useRoute();
const isCheckString = ref("bpmnName");
// const judgeStatus = (status) => {
//   switch (status) {
//     case -1:
//       return "删除";
//     case 0:
//       return "未配置";
//     case 1:
//       return "已配置";
//     default:
//       break;
//   }
// };

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
getFilterNum();
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

const changePage = (page) => {
  searchForm.value.pageNum = page;
  getData();
};
const changeSize = (size) => {
  searchForm.value.pageSize = size;
  getData();
};
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
  console.log(res, "下载文件");
  download(res.response, res.fileName);
};
// 下载安装包;
const handelDownPack = () => {
  window.open("http://20.47.91.28:18091/ixdpc/camunda/downloadCamundaModeler");
  // async
  // if (process.env.NODE_ENV == "production") {
  //   window.open("http://20.47.91.28:18091/ixdpc/camunda/downloadProcess");
  // } else {
  //   window.open("http://20.47.91.28:18091/ixdpc/camunda/downloadProcess");
  // }
  console.log(downPack);
  // if (res.fileName) {
  //   download(res.response, res.fileName);
  // }
};
const download = (res, name) => {
  console.log(res);
  const blob = new Blob([res]);
  const downloadElement = document.createElement("a");
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = name; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};
// 下载模版
const handelTemplate = async () => {
  const res = await downTemplate();
  if (res.fileName) {
    download(res.response, res.fileName);
  }
};
// 删除文件
const handelDel = async (row) => {
  const v = await ElMessageBox.confirm(`确定要删除此条数据吗 ?`);
  if (v) {
    const res = await deleteProcess({ id: row.id });
    if (res.code == 200) {
      ElMessage.success("删除成功");
      getData();
    }
  }
};

const configRef = ref();
const configNode = (record) => {
  configRef.value.open(record);
};

const resetData = () => {
  searchLogRef.value.clear();
  console.log(configRef.value.name);
  searchForm.value = {
    pageNum: 1,
    pageSize: 10,
  };
  getData();
};
</script>

<style lang="scss" scoped></style>
