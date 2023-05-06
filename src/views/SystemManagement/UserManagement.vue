<template>
  <div class="applicationStyle">
    <el-row style=" height: calc(100% - 0vh)">
      <el-card class="role-card">
        <el-row style=" height: calc(100% - 0vh)">
          <!--左侧栏-->
          <el-col :span="5">
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

            <!-- <el-card class="table_class"> -->
            <el-tree
              ref="tree"
              draggable
              :data="groupList"
              :props="defaultProps"
              :accordion="false"
              :auto-expand-parent="false"
              :highlight-current="highlightBoolean"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              style="color:#666;font-family: Microsoft YaHei;"
              @node-click="handleNodeClick"
            />
            <!-- </el-card> -->
          </el-col>
          <!--右侧栏-->
          <el-col :span="19" style="border-left: 1px solid #ebeef5;">
            <el-row class="formRow">
              <el-col :span="24" class="formSty">
                <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">用户名：</span>
                <el-input v-model="filterData.userName" style="width:200px"></el-input>
                <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">角色：</span>
                <el-select
                  v-model="filterData.roleId"
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
                <!-- <el-input v-model="filterData.roleId" style="width:200px"></el-input> -->
                <el-button style="margin-left: 10px;" @click="searchList">查询</el-button>
              </el-col>
            </el-row>
            <el-row style="height:40px;line-height:40px;margin-left: 0.5%;" type="flex">
              <el-col class="edit" :span="16">
                <el-button :disabled="!selectGroupId" @click="addDialog">新增用户</el-button>
                <el-button @click="handleUpdate">修改用户</el-button>
                <el-button @click="handleStop">删除用户</el-button>
              </el-col>
            </el-row>
            <!-- 表格 -->
            <el-row style="width: 99%;margin-left: 0.5%; height: calc(100% - 40px)">
              <!-- <el-card class="role-card"> -->
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
              <!-- </el-card> -->
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-row>

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
        :rules="rulesGroup"
        class="editForm"
      >
        <el-form-item
          v-for="item in groupFormHeader"
          :key="item.key"
          :label="item.label"
          :prop="item.key"
        >
          <el-input
            v-if="item.key === 'deptId'||item.key === 'parentId' && groupDialogStatus==='create'"
            disabled
            v-model="groupTemp[item.key]"
            style="width:90%;"
          />
          <el-input
            v-else-if="item.key === 'orderNum'"
            v-model.number="groupTemp[item.key]"
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

    <el-dialog
      :title="dialogTitle"
      class="aboutDialog"
      v-model="dialogTableVisible"
      @close="dialogTableVisible = false"
    >
      <el-form ref="dataform" :rules="rulesForm" :model="temp" label-width="120px">
        <el-form-item
          v-for="(item, index) in formLabel"
          :key="index"
          :label="item.label"
          :prop="item.key"
        >
          <el-select
            v-model="temp[item.key]"
            v-if="item.key === 'roleId'"
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
          <!-- <el-select
            v-else-if="item.key === 'deptIds'"
            v-model="formList.treeData"
            placeholder="请选择"
            multiple
            collapse-tags
            class="search-select"
            @change="selectChange"
          >
            <el-option :value="treeDataValue" style="height: auto;">
              <el-tree
                ref="tree"
                draggable
                :data="groupList"
                :props="defaultProps"
                :accordion="false"
                node-key="id"
                @node-click="handleTreeClick"
                :auto-expand-parent="false"
                :highlight-current="true"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                style="color:#666;font-family: Microsoft YaHei;"
              />
            </el-option>
          </el-select>-->
          <el-radio-group v-else-if="item.key === 'sex'" v-model="temp[item.key]">
            <el-radio :label="'0'">男</el-radio>
            <el-radio :label="'1'">女</el-radio>
          </el-radio-group>
          <!-- <el-radio-group v-else-if="item.key === 'admin'" v-model="temp[item.key]">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>-->
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
import { transTree } from '@/api/transTree_.js'
import * as systemApi from "@/api/system"
import * as api from "@/api/user"
import * as roleApi from "@/api/role"
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
        // { userName: '张三', roleId: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
        // { userName: '张三', roleId: '管理员', address: '无', email: 'user4', phone: '', remark: '' },
      ],
      total: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '用户名', key: 'userName' },
        { label: '用户角色', key: 'roleName' },
        { label: '单位信息', key: 'address' },
        { label: '手机号码', key: 'phonenumber' },
        { label: '电子邮箱', key: 'email' },
        { label: '备注', key: 'remark' },
      ],
      filterData: {
        userName: "",
        roleId: "",
      },
      filterSelection: {
        appNameList: [],
        appStatusList: [],
      },
      formLabel: [
        { label: '用户名', key: 'userName' },
        { label: '用户角色', key: 'roleId', required: true },
        { label: '电子邮箱', key: 'email' },
        { label: '手机号码', key: 'phonenumber' },
        { label: '性别', key: 'sex' },
        { label: '密码', key: 'password' },
        { label: '备注', key: 'remark' },
      ],
      rulesForm: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        email: [{ required: true, message: '请输入正确的电子邮箱', trigger: 'blur', pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
        phonenumber: [{ required: true, message: '请输入正确的手机号码', trigger: 'blur', pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/ }]
      },
      rules: {},
      formList: {
        userName: '',
        treeData: [], // 多选
        treeId: [],
        roleId: '',
      },
      userTypeList: [],
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
      highlightBoolean: true,
      groupDialogStatus: null,
      resetStatus: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      groupFormHeader: [
        { label: '名称', key: 'deptName' },
        { label: '领导', key: 'leader' },
        { label: '手机号码', key: 'phone' },
        { label: '电子邮箱', key: 'email' },
      ],
      rulesGroup: {
        deptName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        leader: [{ required: true, message: '请输入领导', trigger: 'blur' }],
        email: [{ required: true, message: '请输入正确的电子邮箱', trigger: 'blur', pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ }],
        phone: [{ required: true, message: '请输入正确的手机号码', trigger: 'blur', pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/ }]
      },
      groupTemp: {},
      treeDataValue: "",
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
    this.getList()
    this.getRoleList()
  },
  mounted() {

  },
  methods: {
    // 点击树节点
    // handleTreeClick(data, node, nodeData) {
    //   // select 多选（判重后添加到选择结果数组中）
    //   this.treeDataValue = data
    //   let num = 0;
    //   this.formList.treeData.forEach(item => {
    //     item == data.label ? num++ : num;
    //   })
    //   this.formList.treeId.forEach(item => {
    //     item == data.deptId ? num++ : num;
    //   })
    //   if (num == 0) {
    //     this.formList.treeData.push(data.label)
    //     this.formList.treeId.push(data.deptId)
    //   }
    //   console.log(data, node, nodeData, this.formList, 'sssssssssss');

    // },
    searchList() {
      let param = {
        userName: this.filterData.userName,
        roleId: this.filterData.roleId,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      // 重置 左侧tree结构
      this.selectGroupId = null
      this.createNodeStatus = true,
        this.updataNodeStatus = true,
        this.deleteNodeStatus = true,
        this.highlightBoolean = false
      this.getList(param)
    },
    // 查询表单
    getList(val) {
      let param = val || {}
      param.pageNum = this.page
      param.pageSize = this.pageSize
      this.tableLoading = true
      api.selectUserData(param).then(res => {
        if (res.code === 200) {
          console.log(res, 'res');
          this.tableList = res.data.rows
          this.tableList.forEach(ele => {
            if (ele.roles[0]) {
              ele.roleName = ele.roles[0].roleName

            }
          })
          this.total = res.data.total
          this.tableLoading = false
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }

      })
    },
    selectUserByDeptId(val) {
      let param = {
        deptId: String(val),
        // pageNum: this.page,
        // pageSize: this.pageSize
      }
      this.tableLoading = true
      api.selectUserByDeptId(param).then(res => {
        if (res.code === 200) {
          console.log(res, 'res');
          this.tableList = res.data.rows
          this.tableList.forEach(ele => {
            if (ele.roles[0]) {
              ele.roleName = ele.roles[0].roleName

            }
          })
          this.total = res.data.total
          this.tableLoading = false
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }

      })
    },
    // 左侧tree结构
    getGroup() {
      let param = {}
      systemApi.selectData(param).then(res => {
        if (res.code === 200) {
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
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }

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
      this.highlightBoolean = true // 开启选择高亮
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
      this.selectUserByDeptId(this.selectGroupId)

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
          this.groupTemp.createBy = localStorage.getItem("createById")
          this.groupTemp.status = '0'
          console.log(this.groupTemp, 'groupTemp');
          systemApi.insertData(this.groupTemp).then(res => {
            if (res.code === 200) {
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
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }

          })
        }
      })
    },
    // 编辑部门
    updateGroup() {
      this.$refs['groupform'].validate((valid) => {
        if (valid) {
          this.groupTemp.status = '0'
          systemApi.updateData(this.groupTemp).then((res) => {
            if (res.code === 200) {
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
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    // 删除部门
    deleteDataNode() {
      systemApi.deleteData({ deptId: this.selectGroupId }).then(res => {
        if (res.code === 200) {
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
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }

      })
    },
    // 重置数据
    resetTemp() {
      this.temp = {}
      this.groupTemp = {

      }
    },

    // 查询角色
    getRoleList() {
      let params = {
        type: 1
      }
      roleApi.selectAllRole(params).then(res => {
        if (res.code === 200) {
          res.data.rows.forEach(ele => {
            this.userTypeList.push({ label: ele.roleName, key: ele.roleId })
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    filterChange(val) {
      console.log(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
			this.temp = Object.assign({}, this.multipleSelection[0])
      this.temp.roleId = this.temp.roles ? this.temp.roles[0].roleId : null
      console.log(this.multipleSelection, this.temp,'val');
    },
    // 选中某行
    rowClick(row) {
			console.log(row, 'ssssssss');
      // this.highlight = true
      // this.temp = Object.assign({}, row)
      // this.temp.roleId = this.temp.roles[0] ? this.temp.roles[0].roleId : null
      // console.log(this.temp, 'sssss');
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
      this.groupTemp = {}
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
      if (Object.keys(this.multipleSelection).length === 1) {
        this.dialogTitle = '修改用户'
        this.dialogStatus = 'update'
        this.dialogTableVisible = true
        // this.$refs.multipleTable.clearSelection()
      } else if(Object.keys(this.multipleSelection).length > 1){
        this.$message({
          message: '请勾选一条要删除的用户！',
          type: 'warning'
        })
      } else {
        this.$message({
          message: '请勾选要删除的用户！',
          type: 'warning'
        })
      }
      // if (Object.keys(this.temp).length > 0) {
      //   this.dialogTitle = '修改用户'
      //   this.dialogStatus = 'update'
      //   this.dialogTableVisible = true
      //   this.$refs.multipleTable.clearSelection()

      // } else {
      //   this.$message({
      //     message: '请选择要修改的用户！',
      //     type: 'warning'
      //   })
      // }
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
          data.deptId = this.selectGroupId
          data.delFlag = "0"
          data.status = "0"
          data.nickName = data.userName
          data.createBy = localStorage.getItem('createById')
          console.log(data, 'dfdfdfdfdfdf');
          api.insertUserData(data).then(res => {
            if (res.code === 200) {
              this.selectUserByDeptId(this.selectGroupId)
              console.log(res, 'res');
              this.dialogTableVisible = false
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
            } else {
              this.dialogTableVisible = false
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }

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
          let { userId, roleId, remark, userName, nickName, email, phonenumber, sex, status } = data
          let params = { userId, remark, userName, nickName, email, phonenumber, sex, status, roleId }
          console.log(data, 'data')
          api.updateUserData(params).then(res => {
            if (res.code === 200) {
              this.page = 1
              this.selectGroupId ? this.selectUserByDeptId(this.selectGroupId) : this.getList()
              console.log(res, 'res');
              this.dialogTableVisible = false
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }

          })
        }
      })
    },
    // 删除用户
    deleteDataRole() {
      let params = this.multipleSelection.map(item => item.userId)
      console.log(params, 'params');
      api.deleteUserData(params).then(res => {
        if (res.code === 200) {
          console.log(res, 'deleteData');
          this.dialogDelRole = false
          this.selectGroupId ? this.selectUserByDeptId(this.selectGroupId) : this.getList()

          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }

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

.smallBtn {
  font-size: calc(100vw / 1920 * 16);
  padding: 5px 10px;
  height: auto;
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