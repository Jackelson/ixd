<template>
  <el-card>
    <el-form :inline="true">
      <!-- v-if="isCheckString.indexOf('appId') >= 0" -->
      <el-form-item label="应用">
        <el-select v-model="searchForm.appId">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.appName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input v-model="searchForm.fileName"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="getData">查询</el-button>
        <el-button @click="resetData">清空</el-button>
        <!--  v-if="isCheckString != ''"   
          v-if="isCheckString != ''"
          -->
        <!-- <el-button @click="checkSeach">筛选搜索框</el-button> -->
      </el-form-item>
    </el-form>
    <el-button @click="handelDeleteFile">删除文件</el-button>
    <el-table
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sort" label="序号" align="center" width="80">
        <template #default="{ $index }">
          <span>
            {{ $index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userId"
        label="上传用户"
        align="center"
        width="140"
      />
      <el-table-column prop="fileName" label="文件名称" align="center">
        <template #default="{ row }">
          <span
            @click="handelDownFile(row)"
            style="color: #0d8678; cursor: pointer"
          >
            {{ row.fileName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="文件大小" align="center" />
      <el-table-column prop="createDt" label="上传时间" align="center" />
      <el-table-column prop="appId" label="应用名称" align="center" />
      <el-table-column prop="appUrl" label="文件发送接口" align="center" />
    </el-table>
    <el-pagination
      style="margin-top: 20px; float: right; margin-bottom: 10px"
      v-model:current-page="searchForm.pageNum"
      v-model:page-size="searchForm.pageSize"
      :page-sizes="[10, 15, 20, 30]"
      small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-card>
</template>

<script setup>
import { ref } from "vue";
// getList
// import { getSelAppList } from "@/api/monitor";
import { getFileSelect, downFile, deleteFile, getSelectAppInfo } from "@/api/system";
import { ElMessage } from "element-plus";

const total = ref(0);
// 获取选择框内容
const getSelects = async () => {
  const res = await getSelectAppInfo({
    userId: localStorage.getItem("createById") || '',
  });
  if (res.code == 200) {
    options.value = res.data;
  }
};

const options = ref([]);

const searchForm = ref({
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref([]);

const getData = async (params) => {
  if (params && params.pageNum) {
    searchForm.value.pageNum = params.pageNum;
    searchForm.value.pageSize = params.pageSize;
  }
  console.log(searchForm.value);
  const res = await getFileSelect(searchForm.value);
  if (res.code == 200) {
    total.value = res.data.total;
    tableData.value = res.data.rows;
  }
};
getSelects();
getData();
const resetData = () => {
  searchForm.value = {
    pageNum: 1,
    pageSize: 10,
  };
  getData();
};
const sizeChange = (size) => {
  searchForm.value.pageSize = size;
  getData();
};
const pageChange = (page) => {
  searchForm.value.pageNum = page;
  getData();
};

// 下载文件
const handelDownFile = async (row) => {
  const res = await downFile({ fileId: row.id });
  // console.log(res);
  if (res.fileName) {
    if (res.response == "未找到文件") {
      ElMessage.warning("未找到文件");
    } else {
      download(res.response, res.fileName);
    }
  }
};
const download = (res, name) => {
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
// 多选
const selects = ref([]);
const handleSelectionChange = (value) => {
  selects.value = value;
};
const tableRef = ref();
const clearSelect = () => {
  tableRef.value.clearSelection();
};
// 处理删除文件
const handelDeleteFile = async () => {
  const fileId = selects.value.map((item) => item.id);
  const res = await deleteFile(fileId);
  if (res.code == 200) {
    ElMessage.success("删除成功");
    getData();
  }
  clearSelect();
};
</script>

<style lang="scss" scoped>
.status {
  span {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    &.green {
      background: green;
    }
    &.red {
      background: red;
    }
  }
}
.el-table {
  overflow-x: scroll;
}
</style>
