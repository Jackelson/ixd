<template>
  <div class="applicationStyle">
    <el-row style="width: 99%; margin-left: 0.5%; height: calc(100% - 0vh)" class="switch-search">
      <el-card class="app-card">
        <el-row class="formRow">
          <el-col :span="8" class="formSty">
            <span>应用名称：</span>
            <el-select
              v-model="filterData.appName"
              filterable
              clearable
              placeholder="--所有应用名称--"
              @change="filterChange(1)"
              class="search-select"
            >
              <el-option
                v-for="(item, index) in filterSelection.appNameList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" class="formSty">
            <span>应用状态：</span>
            <el-select
              v-model="filterData.appStatus"
              filterable
              clearable
              placeholder="--所有应用状态--"
              @change="filterChange(2)"
              class="search-select"
            >
              <el-option
                v-for="(item, index) in filterSelection.appStatusList"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-table
          :data="tableList"
          height="calc(100% - 12vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          :row-class-name="tableRowClassName"
          style="width: 100%"
          size="mini"
          ref="table"
          class="appTableSty"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            :index="recordFormat"
            width="80px"
            min-width="80px"
          />
          <el-table-column
            v-for="item in tableHeader"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            show-overflow-tooltip
            align="center"
            :min-width="item.minWidth"
            :width="item.width"
          >
            <template v-slot="scope">
              <span v-if="item.key === 'operate'">
                <el-button type="text" @click="openShareDialog(scope.row)">
                  <el-icon>
                    <Share />
                  </el-icon>
                  <span>测试链接</span>
                </el-button>
                <el-button type="text">
                  <el-icon>
                    <Tools />
                  </el-icon>
                  <span>用户配置</span>
                </el-button>
              </span>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="width: 100%; display: flex; justify-content: flex-end;line-height: 44px">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="serviceTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </el-row>

    <el-dialog
      title="应用节点信息"
      class="aboutDialog"
      v-model="dialogTableVisible"
      width="45%"
      height="400px"
      @close="closeDialog2"
    >
      <ApplicationDialog ref="hostDetailPage" :tableData="tableData" />
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/dashBoard"
import { Share, Tools } from '@element-plus/icons-vue'
import ApplicationDialog from "./component/applicationDialog.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Application',
  components: {
    Share,
    Tools,
    ApplicationDialog
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: {},
      tableList: [
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '', operate: '测试链接 用户配置' },
        // { appId: '12', status: '已上架', address: '无', leader: 'user2', phone: '', operate: '测试链接 用户配置' },
        // { appId: '13', status: '已上架', address: '无', leader: 'user1', phone: '', operate: '测试链接 用户配置' },
      ],
      serviceTotal: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '应用ID', key: 'createId' },
        { label: '应用状态', key: 'appCheckStatus' },
        { label: '应用地址', key: 'applicationDownloadAddress' },
        { label: '应用负责人', key: 'contactPerson' },
        { label: '联系方式', key: 'contactPersonTel' },
        { label: '操作', key: 'operate' },
      ],
      filterData: {
        appName: "",
        appStatus: "",
      },
      filterSelection: {
        appNameList: [],
        appStatusList: [],
      },
    }
  },
  watch: {

  },
  created() {
    this.requestData()
  },
  mounted() {

  },
  methods: {
    requestData() {
      let params = {
        "appName": "测试11",
        "appDescribe": "1111",
        "appSecretKey": "123123",
        "appAffiliatedCompany": "1231231",
        "contactPerson": "123123",
        "contactPersonTel": "13951631328",
        "contactEmail": "123@qq.com",
        "dateStart": "2023-02-16 02:17:44",
        "dateEnd": "2023-02-16 02:17:44"
      }
      api.getAppInfo(params).then(res => {
        console.log(res, 'res');
        this.tableList = res.data.rows
      })
    },
    filterChange(val) {
      console.log(val);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.requestData();
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.requestData();
    },
    openShareDialog(val) {
      console.log(val, 'ssss');
      this.tableData = val
      this.dialogTableVisible = true
    },
    closeDialog2() {
      // this.$refs.hostDetailPage.reloadDate()
      this.dialogTableVisible = false
    },
  }
}
</script>
<style lang="scss">
.appTableSty {
  .el-table__inner-wrapper {
    height: 100% !important;
  }
}
.app-card {
  width: 100%;
  .el-card__body {
    padding: 5px;
    height: 100%;
  }
}

.el-table .change-row {
  background: #e4f4f3 !important;
}

.el-table .change-row-2 {
  background: #f9fafa !important;
}
/*关于 弹窗*/

.aboutDialog {
  .el-dialog__body {
    padding: 10px 20px;
    min-height: 120px;
  }
  .el-dialog {
    width: 470px;
    border-radius: 32px;
    .el-dialog__header {
      display: flex;
      align-items: center;
      height: 24px;
      background-color: #008b8bd9;
      border-radius: 32px 32px 0 0;
      padding: 20px;
    }
    .el-dialog__title {
      // 标题
      color: #fff;
      font-size: 20px;
      font-weight: 700;
    }
    .el-dialog__headerbtn {
      top: auto;
    }
    .el-dialog__headerbtn .el-dialog__close {
      // 右侧关闭按钮
      color: #fff !important;
      font-size: 20px;
      font-weight: 700;
    }
  }
  .el-dialog__footer {
    padding: 8px 41px 16px 0px;
    .el-button--default {
      padding-top: 8px;
      border-radius: 16px;
      width: 81px;
      height: 32px;
      background: #bfc5e2;
      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #fff;
      }
    }
    .el-button--primary {
      padding-top: 8px;
      border-radius: 16px;
      width: 146px;
      height: 32px;
      background: #008b8bd9;
      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #fff;
      }
    }
  }
}
.aboutForm {
  .el-form-item__label {
    font-weight: 700;
    font-size: 16px;
  }
  .el-form-item__content {
    font-size: 16px;
  }
}
</style>

<style lang='scss' scoped>
.applicationStyle {
  width: 100%;
  height: 100%;
  background-color: #f0f8f8;
}
// 表单及表格部分
.switch-search {
  width: 100%;
  background-color: #f9fafa;
  box-shadow: 0px 0px 10px 0px rgba(105, 179, 175, 0.2);
  border-radius: 6px;
  border: solid 1px #c9e0df;
  box-sizing: border-box;

  // 表单
  .formRow {
    height: 5.5vh;
    width: 98%;
    margin-left: 1%;
    display: flex;
    align-items: center;

    .formSty {
      display: flex;
      align-items: center;
      padding: 0 !important;

      span:nth-child(1) {
        font-size: calc(100vw / 1920 * 14);
      }
    }
  }
}
</style>