<template>
  <div class="app-container">
    <el-row style=" height: calc(100% - 0vh)">
      <el-card class="role-card">
        <el-row style=" height: calc(100% - 0vh)">
          <!--左侧栏-->
          <!-- <el-col :span="5">
            <el-row
              type="flex"
              align="middle"
              style="height:40px;line-height:40px;margin-left: 0.5%"
            >
              <el-col
                class="title_table"
                :span="6"
                style="font-size:1.5vh;color:#666;font-family: Microsoft YaHei;font-weight: bold;"
              >部门分组</el-col>
              <el-col class="edit" :span="18">
                <el-button
                  class="smallBtn"
                  :disabled="btnStatus || createNodeStatus"
                  @click="handleCreateNode"
                >添加</el-button>
                <el-button
                  class="smallBtn"
                  :disabled="btnStatus || updataNodeStatus"
                  @click="handleUpdateNode"
                >编辑</el-button>
                <el-button
                  class="smallBtn"
                  :disabled="btnStatus || deleteNodeStatus"
                  @click="handleDeleteNode"
                >删除</el-button>
              </el-col>
            </el-row>

            <el-tree
              ref="tree"
              draggable
              :data="groupList"
              :props="defaultProps"
              :accordion="false"
              :auto-expand-parent="false"
              :highlight-current="true"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              style="color:#666;font-family: Microsoft YaHei;"
              @node-click="handleNodeClick"
            />
          </el-col> -->
          <!--右侧栏-->
          <el-col :span="24" style="border-left: 1px solid #ebeef5;">
            <el-row style="height:40px;line-height:40px;margin-left: 0.5%;" type="flex">
              <el-col class="edit" :span="16">
                <el-button @click="addDialog">新增角色</el-button>
                <el-button @click="handleUpdate">修改角色</el-button>
                <el-button @click="handleStop">删除角色</el-button>
              </el-col>
            </el-row>
            <!-- 表格 -->
            <el-row style="width: 99%;margin-left: 0.5%; height: calc(100% - 40px)">
              <!-- <el-card class="role-card"> -->
              <el-table ref="multipleTable" v-loading="tableLoading" :data="list" height="calc(100% - 7vh)"
                :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
                :highlight-current-row="highlight" style="width: 100%" class="roleTableSty" :row-style="rowStyle"
                @row-click="rowClick" @selection-change="handleSelectionChange" @select="onTableSelect">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" align="center" type="index" :index="recordFormat" width="80px"
                  min-width="80px" />
                <el-table-column v-for="item in tableHeader" :key="item.key" :label="item.label" show-overflow-tooltip
                  align="center" :min-width="item.minWidth" :width="item.width">
                  <template v-slot="scope">
                    <span v-if="item.key === 'operation'">
                      <el-button @click="searchUserList(scope.row)">查看用户</el-button>
                    </span>
                    <span v-else>{{ scope.row[item.key] }}</span>
                  </template>
                </el-table-column>
              </el-table>

              <!--分页查询-->
              <el-row style="width: 100%; display: flex; justify-content: flex-end;align-items: flex-start;">
                <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper" :total="roleTotal" @size-change="handleSizeChange"
                  @current-change="handleCurrentChange" />
              </el-row>
              <!-- </el-card> -->
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-row>

    <!--弹框部分-->
    <taskList :title="dialogTitle" :dialog-status="dialogStatus" v-model:show="dialogAdd" :temp1="temp"
      :groupList="groupList" :menuList="menuList" source="task" />

    <!-- 组织新增/编辑弹窗 -->
    <el-dialog :title="groupText[groupDialogStatus]" class="aboutDialog" width="45%" height="400px"
      v-model="dialogVisible" :close-on-click-modal="false">
      <el-form ref="groupform" :model="groupTemp" label-position="right" label-width="100px" :rules="groupRule"
        class="editForm">
        <el-form-item v-for="item in groupFormHeader" :key="item.key" :label="item.label" :prop="item.key">
          <el-input v-if="item.key === 'deptId' && groupDialogStatus === 'create'" disabled v-model="groupTemp[item.key]"
            style="width:90%;" />
          <el-input v-else-if="item.key === 'orderNum'" v-model.number="groupTemp[item.key]" style="width:90%;" />
          <el-input v-else v-model="groupTemp[item.key]" style="width:90%;" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button v-if="groupDialogStatus === 'create'" type="primary" @click="createGroup">提交</el-button>
        <el-button v-else-if="groupDialogStatus === 'update'" type="primary" @click="updateGroup">提交</el-button>
      </div>
    </el-dialog>
    <!--删除 部门分组 弹框部分-->
    <el-dialog title="删除部门" v-model="dialogDelNode" class="confirmDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">是否删除所选部门</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDelNode = false">取 消</el-button>
        <el-button type="primary" @click="deleteDataNode">确 认</el-button>
      </div>
    </el-dialog>
    <!--删除 角色 弹框部分-->
    <el-dialog title="删除角色" v-model="dialogDelRole" class="confirmDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">是否删除所选角色</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDelRole = false">取 消</el-button>
        <el-button type="primary" @click="deleteDataRole">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 用户弹框 -->
    <UserList title="用户信息" v-model:show="dialogUser" :temp1="temp" :userParams="userParams" />
  </div>
</template>
<script>
import { transTree } from '@/api/transTree_.js'
import * as api from "@/api/system"
import * as roleApi from "@/api/role"
import TaskList from "./component/taskList.vue";
import UserList from "./component/userList.vue";
export default {
  name: 'TaskDistribute',
  components: { TaskList, UserList },
  data() {
    return {
      tableLoading: true,
      roleTotal: 0,
      page: 1,
      pageSize: 10,
      list: [
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
      ],
      tableHeader: [
        { label: '角色编号', key: 'roleId' },
        { label: '角色名称', key: 'roleName' },
        { label: '角色排序', key: 'roleSort' },
        { label: '创建时间', key: 'createTime' },
        { label: '操作', key: 'operation' },
      ],
      userList: [
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
        // { roleId: '002', roleName: '张三', roleSort: '1', createTime: '2022-12-33' },
      ],
      dialogUser: false, // 用户信息弹框
      userParams: '', // 用户
      multipleSelection: [],
      selectRows: [],
      statusOptions: [],
      temp: {},
      highlight: true,
      dialogTitle: '', // 弹框标题
      dialogStatus: '',
      dialogAdd: false,
      dialogStop: false,
      dialogDelRole: false,
      changeTxt: '是否修改该任务状态？',
      adjustVisible: false, // 侧拉弹窗
      height: document.documentElement.clientHeight,
      dialogVisible: false, // 往下是组织架构的相关数据
      dialogDelNode: false,
      groupOptions: [], // 获取组织
      groupList: [
        // {
        //   label: '一级 1',
        //   children: [{
        //     label: '二级 1-1',
        //     children: [{
        //       label: '三级 1-1-1'
        //     }]
        //   }]
        // }, {
        //   label: '一级 2',
        //   children: [{
        //     label: '二级 2-1',
        //     children: [{
        //       label: '三级 2-1-1'
        //     }]
        //   }, {
        //     label: '二级 2-2',
        //     children: [{
        //       label: '三级 2-2-1'
        //     }]
        //   }]
        // }, {
        //   label: '一级 3',
        //   children: [{
        //     label: '二级 3-1',
        //     children: [{
        //       label: '三级 3-1-1'
        //     }]
        //   }, {
        //     label: '二级 3-2',
        //     children: [{
        //       label: '三级 3-2-1'
        //     }]
        //   }]
        // }
      ],
      menuList: [],
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
        // { label: '次序', key: 'orderNum' },
        { label: '领导', key: 'leader' },
        { label: '手机号码', key: 'phone' },
        { label: '电子邮箱', key: 'email' },
        { label: '状态', key: 'status' },
        { label: '创建方式', key: 'createBy' },
      ],
      groupTemp: {

      },
    }
  },
  computed: {
    btnStatus() {
      return false
    }
  },
  created() {
    this.getGroup()
    this.getList()
    // // 获取菜单tree
    this.selectMenuTree()
  },
  mounted() {
  },
  methods: {
    getList() {
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      roleApi.selectRoleData(params).then(res => {
        console.log(res, 'res');
        this.list = res.data.rows
        this.roleTotal = res.data.total
        this.tableLoading = false
      })
    },
    selectRoleByDeptId(val) {
      let param = {
        deptIds: [val],
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      roleApi.selectRoleByDeptId(param).then(res => {
        console.log(res, 'res');
        this.list = res.data
        // this.list = res.data.rows
        // this.roleTotal = res.data.total
        this.tableLoading = false
      })
    },
    // 
    selectMenuTree() {
      let param = { "params": { "userId": "1" } }
      roleApi.selectMenuTree(param).then(res => {
        console.log(res, 'res');
        this.menuList = res.data
        console.log(this.menuList, '8888777777777');
      })
    },
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
      this.page = 1
      this.selectGroupId = data.deptId
      this.selectGroup = data
      this.resetSelect()
      this.groupChildren = data.children ? data.children.length : 0
      // 获取节点
      this.level = node.level
      console.log(data, node, this.level, 'datatreezzzzzz')
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
      // if (this.level === 1) {
      // 	console.log(this.level,'sd666666666');
      //   this.getList()
      // } else {
      console.log(this.level, '555555555555');
      this.selectRoleByDeptId(this.selectGroupId)

      // }
    },
    handleCreateNode() {
      // this.kindOptions = this.getGroupKindOptions(this.level + 1)
      // console.log(this.kindOptions, 'kindOption')
      // this.resetTemp()
      // const { parentId, deptName, orderNum, leader, phone, email, status, createBy } = this.selectGroup
      this.groupTemp = {}
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
          this.groupTemp.parentId = this.selectGroupId
          console.log(this.groupTemp, 'groupTemp');
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

    // 删除角色
    deleteDataRole() {
      let params = this.selectRows.map(item => {
        return { roleId: item.roleId }
      })
      roleApi.deleteRoleData(params).then(res => {
        if (res.code == 200) {
          this.getList()
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
        }
        this.dialogDelRole = false

      })
    },
    searchUserList(row) {
      console.log(row, 'rowssssss');
      this.userParams = row.roleId

      this.dialogUser = true
    },
    // 分页查询
    handleCurrentChange(val) {
      this.page = val;
      console.log(val);
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val, 'handleSelectionChange');
      this.multipleSelection = val
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getList();
    },

    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.selectRows = []
      this.temp = {}
      this.$refs.multipleTable.clearSelection()
    },
    // 选中某行
    rowClick(row) {
      this.highlight = true
      this.temp = Object.assign({}, row)
      console.log(this.temp,);
    },
    // 行选中
    onTableSelect(rows, row) {
      this.selected = rows.length && rows.indexOf(row) !== -1
      var ele = document.getElementsByClassName('el-table__row')
      var domes = Array.prototype.slice.call(ele)
      var index = this.list.indexOf(row)
      // 如果是选中
      if (this.selected === true) {
        this.selectRows = rows
        console.log(this.selectRows, 'sssssssssssssssssss');
        setTimeout(() => {
          domes[index].classList.add('isactive')
        }, 100)
      } else {
        // 如果是取消
        this.selectRows = rows
        setTimeout(() => {
          domes[index].classList.remove('isactive')
        }, 100)
      }
    },
    // 新增角色
    addDialog() {
      this.highlight = false
      this.temp = {}
      this.resetSelect()
      this.dialogTitle = '新增角色'
      this.dialogStatus = 'create'
      this.dialogAdd = true
      console.log(this.dialogAdd,);

    },
    // 编辑
    handleUpdate() {
      if (this.multipleSelection.length > 1) return this.$message({
        message: '修改角色只能选择一个！',
        type: 'warning'
      })
      if (this.multipleSelection.length == 0) {
        return this.$message({
          message: '请选择修改的角色！',
          type: 'warning'
        })
      }
      this.temp = this.multipleSelection[0]
      if (Object.keys(this.temp).length > 0) {
        this.dialogTitle = '修改角色'
        this.dialogStatus = 'update'
        this.dialogAdd = true
        // 重置表格勾选
        this.selectRows = []
        this.$refs.multipleTable.clearSelection()

      } else {
        this.$message({
          message: '请选择要修改的角色！',
          type: 'warning'
        })
      }
    },
    // 删除角色
    handleStop() {
      if (Object.keys(this.selectRows).length > 0) {
        this.changeTxt = '是否删除角色'
        this.dialogDelRole = true
      } else {
        this.$message({
          message: '请勾选要删除的角色！',
          type: 'warning'
        })
      }
    },

  }
}
</script>
<style lang="scss">
.roleTableSty {
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

.el-table .change-row {
  background: #e4f4f3 !important;
}

.el-table .change-row-2 {
  background: #f9fafa !important;
}
</style>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  background-color: #f0f8f8;
}

.smallBtn {
  font-size: calc(100vw / 1920 * 16);
  padding: 5px 10px;
  height: auto;
}

.select {
  color: #909399;
  font: 12px;

  .select_label {
    display: inline-block;
    font-size: 14px;
    color: #666666;
    line-height: 24px;
    margin-right: 10px;
  }

  .select_box {
    .el-input--medium .el-input__inner {
      height: 24px;
      background: #ffffff;
      border: 2px solid #797f8d;
      border-radius: 15px;
    }
  }
}

/* 二次确认弹出框*/

.confirmDialog {
  .el-dialog__body {
    padding: 0px 10px !important;
  }

  .message {
    font-size: 16px;
    font-family: Microsoft YaHei;
    color: #666666;
    font-weight: bold;
  }

  .el-dialog {
    margin-top: 30vh !important;
    width: 330px;
    border-radius: 40px;

    .el-dialog__header {
      padding: 9px;
      border-radius: 32px 32px 0 0;
    }

    .el-dialog__title {
      // 标题
      color: #fff;
    }

    .el-dialog__headerbtn .el-dialog__close {
      // 右侧关闭按钮
      font-size: 20px;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0px 41px 10px 0px;
  }
}

.table_class {
  // overflow: scroll;
  background: #ffffff;
  border-radius: 8px;
  height: calc(100% - 3.9vh);
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
</style>

