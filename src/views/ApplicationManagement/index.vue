<template>
  <div class="applicationStyle">
    <el-row style="width: 99%; margin-left: 0.5%; height: calc(100% - 0vh)" class="switch-search">
      <el-card class="app-card">
        <el-row class="formRow">
          <el-col :span="24" class="formSty">
            <span>应用名称：</span>
            <el-input v-model="filterData.appName" style="width:200px"></el-input>
            <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">应用状态：</span>
            <el-input v-model="filterData.appCheckStatus" style="width:200px"></el-input>
            <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">业务域：</span>
            <el-select
              v-model="filterData.businessType"
              filterable
              clearable
              placeholder="--请选择--"
              @change="enterSelect"
              style="width:22vh;"
            >
              <el-option
                v-for="(item, index) in businessTypeList"
                :key="index"
                :label="item.optionName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button style="margin-left: 10px;" @click="searchList">查询</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableList"
          v-loading="tableLoading"
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
                <el-button @click="getUserConfiguration(scope.row)" type="text">
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
            :total="total"
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

    <!--弹框部分-->
    <Configuration
      title="用户配置"
      v-model:show="dialogAdd"
      :temp1="temp"
      :menuList="menuList"
      :source="chooseNum"
    />
  </div>
</template>

<script>
import * as roleApi from "@/api/role"
import * as userApi from "@/api/user"
import * as api from "@/api/dashBoard"
import { Share, Tools } from '@element-plus/icons-vue'
import ApplicationDialog from "./component/applicationDialog.vue";
import Configuration from "./component/configuration.vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Application',
  components: {
    Share,
    Tools,
    ApplicationDialog,
    Configuration
  },
  data() {
    return {
      tableLoading: true,
      dialogTableVisible: false,
      tableData: {},
      tableList: [
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '', operate: '测试链接 用户配置' },
        // { appId: '12', status: '已上架', address: '无', leader: 'user2', phone: '', operate: '测试链接 用户配置' },
        // { appId: '13', status: '已上架', address: '无', leader: 'user1', phone: '', operate: '测试链接 用户配置' },
      ],
      total: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '操作', key: 'operate', width: '200px' },
        { label: '应用ID', key: 'id' },
        { label: '名称', key: 'appName' },
        { label: '描述', key: 'appDescribe' },
        { label: '应用状态', key: 'state' },
        { label: '首页地址', key: 'appIndexUrl' },
        { label: '业务域', key: 'businessName' },
        { label: '所属部门', key: 'department' },
        { label: '应用检测状态', key: 'appCheckStatus' },
        { label: '是否离线', key: 'offLineApp' },
        { label: '应用管理员', key: 'contactPerson' },
        { label: '所属公司', key: 'appAffiliatedCompany' },
        { label: '负责人姓名', key: 'contactPerson' },
        { label: '联系方式', key: 'contactPersonTel' },
        { label: '电子邮箱', key: 'contactEmail' },
      ],
      filterData: {
        appName: "",
        appCheckStatus: "",
        businessType: "",
      },
      dialogAdd: false,
      temp: {},
      menuList: [],
      chooseNum: [],
      businessTypeList: [],
      businessType: ''
    }
  },
  watch: {

  },
  created() {
    this.requestData()
    this.SysSelectDictionary()
    // 获取菜单tree
    // this.selectMenuTree()
  },
  mounted() {

  },
  methods: {
    SysSelectDictionary() {
      let param = {
        selectFlag: "business_type"
      }
      api.SysSelectDictionary(param).then(res => {
        this.businessTypeList = res.data
        console.log(res);
      })
    },
    enterSelect() {

    },
    selectAppUsers(val) {
      let param = {
        appId: val
      }
      userApi.selectAppUsers(param).then(res => {
        // this.menuList = res.data
        // for (let n = 0; n < this.menuList.length; n++) {
        //   this.menuList[n].nickName = this.menuList[n].roleName
        // }
        const groupsData = res.data
        for (let n = 0; n < groupsData.length; n++) {
          groupsData[n].label = groupsData[n].roleName
        }
        this.menuList = this.dg(groupsData)
        console.log(this.menuList, this.chooseNum, '5555555555555');
      })
    },
    // 根据树结构节点id从树结构数据中获取节点数据
    dg(data) {
      let arr = []
      if (data) {
        data.forEach((item, index1) => {
          item.label = item.roleName
          if (item.userNames) {
            item.userNames.forEach((ele, index) => {
              ele.label = ele.nickName
              ele.id = ele.nickName + index1 + index
              if (ele.isBelong === 1) {
                this.chooseNum.push(ele.id)
              }
            })
          }
          arr.push(item)
        });
        return arr
      } else {
        return null
      }

    },
    selectMenuTree() {
      let param = { "params": { "userId": "1" } }
      roleApi.selectMenuTree(param).then(res => {
        console.log(res, 'res');
        this.menuList = res.data
      })
    },
    // 用户配置
    getUserConfiguration(val) {
      this.temp = val
      this.selectAppUsers(val.id)
      this.dialogAdd = true

    },
    // (-1删除，0 未提交，1 提交审批，2.上架状态(也就是审批通过)，3审批驳回 4 流程删除 5下架状态 6 已撤销 7 申请下架状态 8 申请上架状态
    getState(val) {
      if (val === '-1') return val = '删除'
      if (val === '0') return val = '未提交'
      if (val === '1') return val = '提交审批'
      if (val === '2') return val = '上架'
      if (val === '3') return val = '审批驳回'
      if (val === '4') return val = '流程删除'
      if (val === '5') return val = '下架'
      if (val === '6') return val = '已撤销'
      if (val === '7') return val = '申请下架'
      if (val === '8') return val = '申请上架'
    },
    getState2(val) {
      if (val === '删除') return val = '-1'
      if (val === '未提交') return val = '0'
      if (val === '提交审批') return val = '1'
      if (val === '上架') return val = '2'
      if (val === '审批驳回') return val = '3'
      if (val === '流程删除') return val = '4'
      if (val === '下架') return val = '5'
      if (val === '已撤销') return val = '6'
      if (val === '申请下架') return val = '7'
      if (val === '申请上架') return val = '8'
    },
    getoffLineApp(val) {
      if (val === 0) return val = '离线应用'
      if (val === 1) return val = '在线应用'
    },
    getappCheckStatus(val) {
      if (val === 0) return val = '未检测'
      if (val === 1) return val = '已检测'
    },
    searchList() {
      let param = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      !this.filterData.appName ? null : param.appName = this.filterData.appName
      !this.filterData.appCheckStatus ? null : param.state = this.getState2(this.filterData.appCheckStatus)
      !this.filterData.businessType ? null : param.businessType = this.filterData.businessType

      this.tableLoading = true
      api.getAppInfo(param).then(res => {
        this.tableList = Object.assign([], res.data.rows)
        this.tableList.forEach(ele => {
          ele.state = this.getState(ele.state)
          ele.offLineApp = this.getoffLineApp(ele.offLineApp)
          ele.appCheckStatus = this.getappCheckStatus(ele.appCheckStatus)
        })
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    requestData() {
      let params = {
        // "appName": "测试11",
        // "appDescribe": "1111",
        // "appSecretKey": "123123",
        // "appAffiliatedCompany": "1231231",
        // "contactPerson": "123123",
        // "contactPersonTel": "13951631328",
        // "contactEmail": "123@qq.com",
        // "dateStart": "2023-02-16 02:17:44",
        // "dateEnd": "2023-02-16 02:17:44"
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      api.getAppInfo(params).then(res => {
        this.tableList = Object.assign([], res.data.rows)
        this.tableList.forEach(ele => {
          ele.state = this.getState(ele.state)
          ele.offLineApp = this.getoffLineApp(ele.offLineApp)
          ele.appCheckStatus = this.getappCheckStatus(ele.appCheckStatus)
        })
        this.total = res.data.total
        this.tableLoading = false
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