<template>
  <el-card>
    <el-form :inline="true">
      <!-- v-if="isCheckString.indexOf('appId') >= 0" -->
      <el-form-item label="状态">
        <el-select v-model="searchForm.scanResult">
          <el-option label="正常" :value="true" />
          <el-option label="异常" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="searchForm.createTime"
          type="datetime"
          placeholder="请选择时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sort" label="序号" align="center" width="80">
        <template #default="{ $index }">
          <span>
            {{ $index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="appName"
        label="app名称"
        align="center"
        width="140"
      />
      <el-table-column prop="appId" label="appId" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" align="center" />
      <el-table-column prop="scanResult" label="状态" align="center" width="80">
        <template #default="{ row }">
          <div class="status">
            <span v-if="row.scanResult" class="green"></span>
            <span v-else class="red"></span>
          </div>
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
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-card>
</template>

<script setup>
import { ref } from "vue";
// getList
import { getSelAppList } from "@/api/monitor";
import { getAppScanInfo } from "@/api/system";

const total = ref(0);
// 获取选择框内容
const getSelects = async () => {
  const res = await getSelAppList();
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
  if (params) {
    searchForm.value.pageNum = params.pageNum;
    searchForm.value.pageSize = params.pageSize;
  }
  const res = await getAppScanInfo(searchForm.value);
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
