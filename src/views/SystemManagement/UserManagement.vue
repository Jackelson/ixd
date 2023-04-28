<template>
  <div class="applicationStyle">
    <el-row style="width: 99%; margin-left: 0.5%; height: calc(100% - 0vh)" class="switch-search">
      <el-card class="role-card">
        <el-row class="formRow">
          <el-col :span="24" class="formSty">
            <span>用户名：</span>
            <el-input v-model="filterData.appName" style="width:200px"></el-input>
            <span style="font-size: calc(100vw / 1920 * 14);">角色：</span>
            <el-input v-model="filterData.appStatus" style="width:200px"></el-input>
            <el-button @click="searchList">查询</el-button>
          </el-col>
        </el-row>
        <el-row class="formRow">
          <el-col :span="8" class="formSty">
            <el-button @click="addDialog">新增用户</el-button>
            <el-button @click="handleUpdate">修改用户</el-button>
            <el-button @click="handleStop">删除用户</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          v-loading="tableLoading"
          :data="tableList"
          height="calc(100% - 17vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          style="width: 100%"
          class="userTableSty"
          :highlight-current-row="highlight"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
            :label="item.label"
            show-overflow-tooltip
            align="center"
            :min-width="item.minWidth"
            :width="item.width"
          >
            <template v-slot="scope">
              <span>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row
          style="width: 100%; display: flex; justify-content: flex-end;align-items: flex-start;margin-top: 1vh;"
        >
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
      :title="dialogTitle"
      class="aboutDialog"
      v-model="dialogTableVisible"
      @close="dialogTableVisible = false"
    >
      <el-form ref="dataform" :rules="rules" :model="temp" label-width="120px">
        <el-form-item
          v-for="(item, index) in formLabel"
          :key="index"
          :label="item.label"
          :prop="item.key"
        >
          <el-select
            v-model="temp[item.key]"
            v-if="item.key === 'userType'"
            filterable
            clearable
            placeholder="--请选择用户角色--"
            @change="filterChange(2)"
            class="search-select"
          >
            <el-option
              v-for="(item, index) in userTypeList"
              :key="index"
              :label="item.label"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-radio-group v-else-if="item.key === 'sex'" v-model="temp[item.key]">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
          <el-radio-group v-else-if="item.key === 'admin'" v-model="temp[item.key]">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <el-input v-else v-model="temp[item.key]" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <el-row style="display: flex; justify-content: flex-end;">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else-if="dialogStatus==='update'" type="primary" @click="updateData">确定</el-button>
      </el-row>
    </el-dialog>
    <!--删除 角色 弹框部分-->
    <el-dialog
      title="删除角色"
      v-model="dialogDelRole"
      class="confirmDialog"
      :close-on-click-modal="false"
    >
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">是否删除所选用户</span>
      </el-row>
      <el-row style="display: flex; justify-content: flex-end;">
        <el-button @click="dialogDelRole=false">取 消</el-button>
        <el-button type="primary" @click="deleteDataRole">确 认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/user"
export default {
  components: {
  },
  data() {
    return {
      dialogTableVisible: false,
      tableLoading: true,
      dialogTitle: '',
      dialogStatus: 'create',
      dialogDelRole: false,
      tableData: {},
      multipleSelection: [],
      highlight: true,
      temp: {},
      tableList: [
        // { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
        // { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
        // { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
        // { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
      ],
      total: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '用户名', key: 'userName', minWidth: '80px' },
        { label: '用户角色', key: 'userType', minWidth: '80px' },
        { label: '单位信息', key: 'address', minWidth: '80px' },
        { label: '手机号码', key: 'phonenumber', minWidth: '80px' },
        { label: '电子邮箱', key: 'email', minWidth: '80px' },
        { label: '备注', key: 'remark', minWidth: '80px' },
      ],
      filterData: {
        appName: "",
        appStatus: "",
      },
      filterSelection: {
        appNameList: [],
        appStatusList: [],
      },
      formLabel: [
        { label: '用户名', key: 'userName' },
        { label: '用户角色', key: 'userType' },
        { label: '电子邮箱', key: 'email' },
        { label: '手机号码', key: 'phonenumber' },
        { label: '性别', key: 'sex' },
        { label: '管理员', key: 'admin' },
        { label: '密码', key: 'password' },
        // { label: '状态', key: 'status' },
        { label: '备注', key: 'remark' },
      ],
      rules: {},
      formList: {
        userName: '',
        userType: '',
      },
      userTypeList: [
        { label: '管理员', key: '00' },
        { label: '运维专责', key: '11' },
        { label: '业务部门主任', key: '22' },
        { label: '业务部门管理专责', key: '33' },
        { label: '子应用管理员', key: '44' },
        { label: '子应用业务专责', key: '55' },
      ],
    }
  },
  watch: {

  },
  computed: {
    btnStatus() {
      return false
    }
  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    searchList() {
      let param = {
        appName: this.filterData.appName,
        appStatus: this.filterData.appStatus,
      }
      this.getList(param)
    },
    // 查询表单
    getList(val) {
      let params = val || {}
      this.tableLoading = true
      api.selectUserData(params).then(res => {
        console.log(res, 'res');
        this.tableList = res.data.rows
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    filterChange(val) {
      console.log(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // this.multipleSelection = JSON.parse(JSON.stringify(val));
      console.log(this.multipleSelection, this.tableList, 'val');
    },
    // 选中某行
    rowClick(row) {
      this.highlight = true
      this.temp = Object.assign({}, row)
      console.log(this.temp, 'sssss');
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleCurrentChange(page) {
      this.page = page;
      let param = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.getList(param);
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      let param = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.getList(param);
    },
    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.selectRows = []
      this.temp = {}
      this.$refs.multipleTable.clearSelection()
    },
    // 新增角色
    addDialog() {
      this.highlight = false
      this.resetSelect()
      this.dialogTitle = '新增用户'
      this.dialogStatus = 'create'
      this.dialogTableVisible = true
      console.log(this.dialogTableVisible,);
    },
    // 编辑
    handleUpdate() {
      if (Object.keys(this.temp).length > 0) {
        this.dialogTitle = '修改用户'
        this.dialogStatus = 'update'
        this.dialogTableVisible = true
        this.$refs.multipleTable.clearSelection()

      } else {
        this.$message({
          message: '请选择要修改的用户！',
          type: 'warning'
        })
      }
    },
    // 删除角色
    handleStop() {
      if (Object.keys(this.multipleSelection).length > 0) {
        // this.changeTxt = '是否删除用户'
        this.dialogDelRole = true
      } else {
        this.$message({
          message: '请勾选要删除的用户！',
          type: 'warning'
        })
      }
    },
    // 新增提交
    createData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          data.delFlag = "0"
          data.status = "0"
          data.nickName = data.userName

          api.insertUserData(data).then(res => {
            this.getList()
            console.log(res, 'res');
            this.dialogTableVisible = false
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
          })
          console.log(data);
        }
      })
    },
    // 编辑提交
    updateData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          console.log(this.temp, 44444444444);
          let { userId, userType, remark, userName, nickName, email, phonenumber, sex, status } = data
          let params = { userId, remark, userName, nickName, email, phonenumber, sex, status, userType }
          console.log(data, 'data')
          api.updateUserData(params).then(res => {
						this.page = 1
            this.getList()
            console.log(res, 'res');
            this.dialogTableVisible = false
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
    // 删除用户
    deleteDataRole() {
      let params = this.multipleSelection.map(item => item.userId)
      console.log(params, 'params');
      api.deleteUserData(params).then(res => {
        console.log(res, 'deleteData');
        this.dialogDelRole = false
        this.getList()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      })
    },
  }
}
</script>
<style lang="scss">
.userTableSty {
  .el-table__inner-wrapper {
    height: 100% !important;
  }
}
.role-card {
  width: 100%;
  .el-card__body {
    padding: 5px;
    height: 100%;
  }
}
// .box-card {
//   .el-card__body {
//     padding: 0;
//     height: 100%;
//   }
// }

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
.search-select {
  width: 200px;
}
.applicationStyle {
  width: 100%;
  height: 100%;
  // background-color: #f0f8f8;
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
    display: flex;
    align-items: center;

    .formSty {
      display: flex;
      align-items: center;
      padding: 0 !important;

      span:nth-child(1) {
        font-size: calc(100vw / 1920 * 14);
      }
      .el-input {
        margin-right: 20px;
      }
    }
  }
}
.table_class {
  overflow: scroll;
  background: #ffffff;
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: calc(100% - 0vh);
}
</style>