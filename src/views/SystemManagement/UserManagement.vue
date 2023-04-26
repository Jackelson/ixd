<template>
  <div class="applicationStyle">
    <el-row style="width: 99%; margin-left: 0.5%; height: calc(100% - 0vh)" class="switch-search">
      <el-card class="role-card">
        <el-row class="formRow">
          <el-col :span="8" class="formSty">
            <span>用户名：</span>
            <el-select
              v-model="filterData.appName"
              filterable
              clearable
              placeholder="--所有用户名--"
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
            <span>角色：</span>
            <el-select
              v-model="filterData.appStatus"
              filterable
              clearable
              placeholder="--所有角色--"
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
          <el-col :span="8" class="formSty">
            <el-button @click="requestData">查询</el-button>
            <el-button @click="openShareDialog">修改用户</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableList"
          height="calc(100% - 12vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          style="width: 100%"
          ref="table"
          @selection-change="handleSelectionChange"
          class="userTableSty"
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
      <el-form class="aboutForm">
        <el-form-item v-for="(item, index) in formLabel" :key="index" :label="item.label">
          <el-select
            v-model="formList[item.key]"
            v-if="item.key === 'userType'"
            filterable
            clearable
            placeholder="--所有安全区--"
            @change="filterChange(2)"
            class="search-select"
            style="width:200px"
          >
            <el-option
              v-for="(item, index) in userTypeList"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <el-input v-else v-model="formList[item.key]" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <el-row style="display: flex; justify-content: flex-end;">
        <el-button @click="cancelForm">取消</el-button>
        <el-button @click="confirmForm">确定</el-button>
      </el-row>
    </el-dialog>

    <!-- 组织新增/编辑弹窗 -->
    <el-dialog
      :title="groupText[groupDialogStatus]"
      class="aboutDialog"
      width="45%"
      height="400px"
      v-model="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="groupform"
        :model="groupTemp"
        label-position="right"
        label-width="100px"
        :rules="groupRule"
        class="editForm"
      >
        <el-form-item
          v-for="item in groupFormHeader"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <el-input
            v-if="item.key === 'deptId' && groupDialogStatus==='create'"
            disabled
            v-model="groupTemp[item.key]"
            style="width:90%;"
          />
          <el-input v-else v-model="groupTemp[item.key]" style="width:90%;" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="groupDialogStatus==='create'" type="primary" @click="createGroup">提交</el-button>
        <el-button v-else-if="groupDialogStatus==='update'" type="primary" @click="updateGroup">提交</el-button>
      </div>
    </el-dialog>
    <!--删除 部门分组 弹框部分-->
    <el-dialog
      title="删除部门"
      v-model="dialogDelNode"
      class="confirmDialog"
      :close-on-click-modal="false"
    >
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">是否删除所选部门</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDelNode=false">取 消</el-button>
        <el-button type="primary" @click="deleteDataNode">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { transTree } from '@/api/transTree_.js'
import * as api from "@/api/system"
// import { Share, Tools } from '@element-plus/icons-vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Application',
  components: {
  },
  data() {
    return {
      dialogTableVisible: false,
      tableData: {},
      multipleSelection: [],
      tableList: [
        { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '测试链接 用户配置' },
        { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '测试链接 用户配置' },
        { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '测试链接 用户配置' },
        { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '测试链接 用户配置' },
        { userName: '张三', userType: '管理员', address: '无', email: 'user4', phone: '', remark: '测试链接 用户配置' },
      ],
      serviceTotal: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '用户名', key: 'userName' },
        { label: '用户角色', key: 'userType' },
        { label: '单位信息', key: 'address' },
        { label: '手机号码', key: 'phone' },
        { label: '电子邮箱', key: 'email' },
        { label: '备注', key: 'remark' },
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
      ],
      formList: {
        userName: '',
        userType: '',
      },
      userTypeList: [
        { label: '管理员', key: 'admin' },
        { label: '运维专责', key: 'admin1' },
        { label: '业务部门主任', key: 'admin2' },
        { label: '业务部门管理专责', key: 'admin3' },
        { label: '子应用管理员', key: 'admin4' },
        { label: '子应用业务专责', key: 'admin5' },
      ],
      dialogVisible: false, // 往下是组织架构的相关数据
      dialogDelNode: false,
      groupOptions: [], // 获取组织
      groupList: [],
      groupChildren: 0,
      selectGroupId: null, // 选中的部门
      selectGroup: {}, // 选中的部门的信息
      selectGroup_path: null, // 选中的部门的group_path
      createNodeStatus: true,
      updataNodeStatus: true,
      deleteNodeStatus: true,
      groupText: {
        create: '新增部门',
        update: '编辑部门'
      },
      groupDialogStatus: null,
      resetStatus: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      groupFormHeader: [
        { label: 'ID', key: 'deptId' },
        { label: '节点', key: 'parentId' },
        { label: '名称', key: 'deptName' },
        { label: '次序', key: 'orderNum' },
        { label: '领导', key: 'leader' },
        { label: '手机号码', key: 'phone' },
        { label: '电子邮箱', key: 'email' },
        { label: '状态', key: 'status' },
        { label: '创建方式', key: 'createBy' },
      ],
      groupTemp: {
        deptId: '',
        parentId: 102,
        deptName: "运维部门",
        orderNum: 3,
        leader: "若依",
        phone: "15888888888",
        email: "ry@qq.com",
        status: "0",
        createBy: "akjjsdkadkasjdksa"
      },
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
    this.getGroup()
  },
  mounted() {

  },
  methods: {
    // 左侧tree结构
    getGroup() {
      let param = {}
      api.selectData(param).then(res => {
        console.log(res, 'res');
        this.sqGroupOptions = res.data
        const groupsData = res.data
        // this.groupsData = res.data
        for (let n = 0; n < groupsData.length; n++) {
          groupsData[n].label = groupsData[n].deptName
        }
        const jsonDataTree = transTree(groupsData, 'deptId', 'parentId', 'children')
        this.groupList = this.dg(jsonDataTree)
        console.log(groupsData, this.groupList, '8888');
        this.groupChildren = groupsData.children ? groupsData.children.length : 0
      })
    },
    // 根据树结构节点id从树结构数据中获取节点数据
    dg(data) {
      let arr = []
      let _this = this
      if (data) {
        data.forEach(item => {
          item.label = item.deptName
          if (item.children || item.children === null) {
            item.children.label = item.children.deptName
            _this.dg(item.children)
          }
          arr.push(item)
        });
        return arr
      } else {
        return null
      }

    },
    // 组织架构的相关信息
    handleNodeClick(data, node) {
      this.selectGroupId = data.deptId
      this.selectGroup = data
      console.log(data, node, 'datatreezzzzzz')
      this.resetSelect()
      this.groupChildren = data.children ? data.children.length : 0
      // 获取节点
      this.level = node.level

      if (this.btnStatus === false) {
        this.updataNodeStatus = false
      } else {
        this.updataNodeStatus = true
      }

      if (this.btnStatus === false) {
        this.createNodeStatus = false
      } else {
        this.createNodeStatus = true
      }
      if (this.groupChildren > 0) {
        this.deleteNodeStatus = true
      } else {
        if (this.btnStatus === false) {
          this.deleteNodeStatus = false
        } else {
          this.deleteNodeStatus = true
        }
      }
    },
    handleCreateNode() {
      // this.kindOptions = this.getGroupKindOptions(this.level + 1)
      // console.log(this.kindOptions, 'kindOption')
      // this.resetTemp()
      const { parentId, deptName, orderNum, leader, phone, email, status, createBy } = this.selectGroup
      this.groupTemp = { parentId, deptName, orderNum, leader, phone, email, status, createBy }
      this.dialogVisible = true
      this.groupDialogStatus = 'create'
      console.log(this.dialogVisible);
    },
    handleUpdateNode() {
      if (this.selectGroupId === null) {
        this.$message({
          message: '请选择要编辑的部门！',
          type: 'warning'
        })
      } else {
        console.log(this.selectGroup, 'selectGroup')
        const { deptId, parentId, deptName, orderNum, leader, phone, email, status, createBy } = this.selectGroup
        this.groupTemp = { deptId, parentId, deptName, orderNum, leader, phone, email, status, createBy }
        this.groupDialogStatus = 'update'
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['groupform'].clearValidate()
        })
      }
    },
    handleDeleteNode() {
      if (this.selectGroupId === null) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的部门！'
        })
      } else {
        this.dialogDelNode = true
      }
    },
    // 提交部门
    createGroup() {
      this.$refs['groupform'].validate((valid) => {
        if (valid) {
          // this.groupTemp.parent_id = this.selectGroupId
          api.insertData(this.groupTemp).then(res => {
            console.log(res);
            this.dialogVisible = false
            // this.selectGroupId = null
            this.groupList = []
            this.searchValue = ''
            this.getGroup()
            this.resetTemp()
            this.$message({
              message: '新增成功！',
              type: 'success'
            })
          })
        }
      })
    },
    // 编辑部门
    updateGroup() {
      this.$refs['groupform'].validate((valid) => {
        if (valid) {
          api.updateData(this.groupTemp).then((res) => {
            console.log(res);
            this.dialogVisible = false
            this.groupList = []
            this.searchValue = ''
            this.selectGroupId = null
            this.getGroup()
            this.resetTemp()
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
    // 删除部门
    deleteDataNode() {
      api.deleteData({ deptId: this.selectGroupId }).then(res => {
        console.log(res, 'deleteData');
        this.dialogDelNode = false
        this.groupList = []
        this.searchValue = ''
        this.selectGroupId = null
        this.getGroup()
        this.resetTemp()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      })
    },
    // 重置数据
    resetTemp() {
      this.temp = {}
      this.groupTemp = {

      }
    },
    resetSelect() {

    },
    requestData() {

    },
    filterChange(val) {
      console.log(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = JSON.parse(JSON.stringify(val));
      console.log(this.multipleSelection, this.tableList, 'val');
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
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
    openShareDialog() {
      if (Object.keys(this.multipleSelection).length > 0) {
        let { userName, userType } = JSON.parse(JSON.stringify(this.multipleSelection))[0]
        this.formList = { userName, userType }
        this.dialogTableVisible = true
      } else {
        this.$message({
          message: '请选择要删除的角色！',
          type: 'warning'
        })
      }

    },
    closeDialog2() {
      // this.$refs.hostDetailPage.reloadDate()
      this.dialogTableVisible = false
    },
    cancelForm() {
      this.dialogTableVisible = false
    },
    confirmForm() {
      console.log("提交完成，关闭弹框");
      this.dialogTableVisible = false
    }
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
.table_class {
  overflow: scroll;
  background: #ffffff;
  // box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: calc(100% - 0vh);
}
</style>