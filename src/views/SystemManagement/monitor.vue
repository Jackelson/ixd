<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="选择应用" v-if="isCheckString.indexOf('appId') >= 0">
        <el-select v-model="searchForm.appId">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.appName"
            :value="item.id"
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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="sort" label="序号" align="center" width="80">
        <template #default="{ $index }">
          <span>
            {{ $index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="appId"
        label="app名称"
        align="center"
        width="140"
      />
      <el-table-column prop="requestMethodName" label="方法名称" align="center">
        <template #default="{ row }">
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="row.requestMethodName"
            placement="top-start"
          >
            <p class="request_post" style="width: 300px">
              {{ row.requestMethodName }}
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="requestParam" label="方法参数" align="center" /> -->

      <el-table-column prop="requestType" label="请求方式" align="center">
        <template #default="{ row }">
          <span>
            {{ judgeType(row.requestType) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="requestTime" label="请求日期" align="center" />
      <!-- <el-table-column prop="requestId" label="请求id" align="center" /> -->

      <el-table-column prop="action" label="类型" align="center">
        <template #default="{ row }">
          <span>
            {{ row.action == 2 ? "文件" : "普通请求" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="errMessage"
        label="错误信息"
        align="center"
        width="400"
      >
        <template #default="{ row }">
          <el-tooltip placement="left">
            <template #content>
              <p
                class="tip"
                style="max-width: 400px; max-height: 400px; overflow: auto"
              >
                {{ row.errMessage }}
              </p>
            </template>
            <div class="request_post">
              {{ row.errMessage }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      style="margin-top: 20px; float: right; margin-bottom: 10px"
      v-model:current-page="searchForm.pageNum"
      v-model:page-size="searchForm.pageSize"
      :page-sizes="[10, 15, 20, 30]"
      small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="getData"
      @current-change="getData"
    /> -->
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
import { getSelAppList, getList } from "@/api/monitor";
import { useRoute } from "vue-router";
import pickModel from "@/views/ApplicationManagement/component/pickModel.vue";
import { getFilterCon } from "@/api/application";
const route = useRoute();
const isCheckString = ref("appId");
// const judgeStatus = (type) => {
//   return options.value.filter((o) => o.value == type)[0].label;
// };

// 获取选择框内容
const getSelects = async () => {
  const res = await getSelAppList();
  if (res.code == 200) {
    options.value = res.data;
  }
};
const judgeType = (type) => {
  const file = typeList.value.filter((o) => o.value == type);
  if (file.length > 0) {
    return file[0].label;
  } else {
    return "";
  }
};
const options = ref([]);
const typeList = ref([
  {
    label: "get",
    value: 1,
  },
  {
    label: "post",
    value: 2,
  },
  {
    label: "put",
    value: 3,
  },
  {
    label: "delete",
    value: 4,
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

const total = ref(0);
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
  const res = await getList(searchForm.value);
  if (res.code == 200) {
    tableData.value = res.data;
    total.value = res.data.total;
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
</script>

<style lang="scss" scoped>
.request_post {
  width: 500px;
  white-space: nowrap; /* 给文本设置不换行在一行中显示 */
  overflow: hidden; /* 文本超出的部分隐藏 */
  text-overflow: ellipsis;
}
.el-table {
  overflow-x: scroll;
}
</style>
