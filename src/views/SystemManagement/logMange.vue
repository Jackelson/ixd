<template>
  <el-card>
    <!-- <el-form :inline="true">
      <el-form-item label="选择应用" v-if="isCheckString.indexOf('appId') >= 0">
        <el-select v-model="searchForm.appId">
          <template v-if="options.length > 0">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.appName"
              :value="item.id"
            />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button v-if="isCheckString != ''" @click="getData">查询</el-button>
        <el-button v-if="isCheckString != ''" @click="resetData"
          >清空</el-button
        >
        <el-button @click="checkSeach">筛选搜索框</el-button>
      </el-form-item>
    </el-form> -->
    <el-button @click="getReord">查看备份日志</el-button>
    <el-row style="margin-top: 15px" :gutter="20">
      <el-col :span="8" v-for="n in tableData" :key="n.id">
        <el-card style="width: 100%" class="item">
          <div class="row">
            <div class="label">日志名称:</div>
            <div class="value">
              <p>{{ n.logName }}</p>
              <!-- <el-tooltip placement="top">
                <template #content>{{ n.logName }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
          <div class="row">
            <div class="label">日志追加策略:</div>
            <div class="value">
              <p>{{ n.logStrategy }}</p>
              <!-- <el-tooltip placement="top">
                <template #content>{{ n.logStrategy }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
          <div class="row">
            <div class="label">日志等级:</div>
            <div class="value">
              {{ n.logLevel }}
            </div>
          </div>
          <div class="row">
            <div class="label">日志路径/名称:</div>
            <div class="value">
              <p>{{ n.logPathName }}</p>
              <!-- <el-tooltip placement="top">
                <template #content>{{ n.logPathName }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
          <div class="row">
            <div class="label">日志保存策略:</div>
            <div class="value">
              <!-- <p>{{ n.logSaveStrategy }}</p>
              <el-tooltip placement="top">
                <template #content>{{ n.logSaveStrategy }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
          <div class="row">
            <div class="label">日志文件名模式:</div>
            <div class="value">
              <p>{{ n.fileNamePattern }}</p>
              <!-- <el-tooltip placement="top">
                <template #content>{{ n.fileNamePattern }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
          <div class="row">
            <div class="label">单个日志文件大小:</div>
            <div class="value">
              {{ n.maxHistory }}
            </div>
          </div>
          <div class="row">
            <div class="label">日志输出格式:</div>
            <div class="value">
              <p>{{ n.logLayout }}</p>
              <!-- <el-tooltip placement="top">
                <template #content>{{ n.logLayout }}</template>
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <pickModel
      ref="pickSearchRef"
      :data="searchData"
      :isCheck="isCheckString"
      @reload="getFilterNum"
    ></pickModel> -->
    <el-dialog title="日志备份明细" v-model="dialog">
      <el-empty v-if="logDetail.length <= 0" description="内容为空" />
      <el-table :data="logDetail">
        <el-table-column prop="fileName" label="文件名称" align="center" />
        <el-table-column prop="fileSize" label="文件大小" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import { getLogList, getselectLogReord } from "@/api/system";
// import { useRoute } from "vue-router";
// import pickModel from "@/views/ApplicationManagement/component/pickModel.vue";
// import { getFilterCon } from "@/api/application";
// const route = useRoute();
// const isCheckString = ref("appId");
// const judgeStatus = (type) => {
//   return options.value.filter((o) => o.value == type)[0].label;
// };

// 获取选择框内容
// const getSelects = async () => {
//   const res = await getSelAppList();
//   if (res.code == 200) {
//     options.value = res.data;
//   }
// };

// const options = ref([
//   {
//     label: "控制层",
//     value: "1",
//   },
//   {
//     label: "服务层",
//     value: "2",
//   },
//   {
//     label: "缓存层",
//     value: "3",
//   },
//   {
//     label: "数据层",
//     value: "4",
//   },
// ]);
// const searchData = ref({
//   userId: localStorage.getItem("createById"),
//   menuId: route.path,
// });

// const getFilterNum = async () => {
//   const res = await getFilterCon(searchData.value);
//   if (res.code == 200) {
//     res.data.forEach((item) => {
//       if (item.menuId == searchData.value.menuId) {
//         isCheckString.value = item.paramslist;
//       }
//     });
//   }
// };
// const pickSearchRef = ref();
// function checkSeach() {
//   pickSearchRef.value.open();
// }

const dialog = ref(false);
const logDetail = ref([]);
const getReord = async () => {
  const res = await getselectLogReord();
  if (res.code == 200) {
    logDetail.value = res.data;
    dialog.value = true;
  }
};

const total = ref(0);
const searchForm = ref({
  pageNum: 1,
  pageSize: 10,
  appId: "",
});
const tableData = ref([]);

const getData = async (params) => {
  if (params) {
    searchForm.value.pageNum = params.pageNum;
    searchForm.value.pageSize = params.pageSize;
  }
  const res = await getLogList(searchForm.value);
  if (res.code == 200) {
    tableData.value = res.data;
    total.value = res.data.total;
  }
};
getData();
// const resetData = () => {
//   searchForm.value = {
//     pageNum: 1,
//     pageSize: 10,
//   };
//   getData();
// };
</script>

<style lang="scss" scoped>
.request_post {
  width: 500px;
  white-space: nowrap; /* 给文本设置不换行在一行中显示 */
  overflow: hidden; /* 文本超出的部分隐藏 */
  text-overflow: ellipsis;
}
.row {
  width: 100%;
  // display: flex;
  margin-bottom: 30px;
  font-size: 14px;
  .label {
    font-weight: bold;
    // width: 20%;
    // white-space: nowrap; /* 给文本设置不换行在一行中显示 */
    // overflow: hidden; /* 文本超出的部分隐藏 */
    // text-overflow: ellipsis;
  }
  // .value {
  //   width: 70%;
  //   p {
  //     width: 95%;
  //     margin: 0;
  //     white-space: nowrap; /* 给文本设置不换行在一行中显示 */
  //     overflow: hidden; /* 文本超出的部分隐藏 */
  //     text-overflow: ellipsis;
  //     display: flex;
  //   }
  // }
}
</style>
