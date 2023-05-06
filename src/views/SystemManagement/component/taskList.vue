<template>
  <!--弹框部分-->
  <el-dialog :title="title" v-model="groupVisible" class="editDialog" :close-on-click-modal="false"
    @close="closeGroupVisible">
    <el-form ref="dataform" label-width="120px" label-position="right" :rules="rules" :model="temp" class="editForm"
      v-if="groupVisible">
      <div v-for="(item, index) in formHeader" :key="index">
        <el-form-item :label="item.label" :prop="item.key">
          <el-input v-if="item.key === 'menu'" v-model="temp[item.key]" style="width:90%" />
          <el-radio-group v-else-if="item.key === 'menuCheckStrictly'" v-model="temp[item.key]">
            <el-radio :label="true">选择</el-radio>
            <el-radio :label="false">不选择</el-radio>
          </el-radio-group>
          <el-radio-group v-else-if="item.key === 'deptCheckStrictly'" v-model="temp[item.key]">
            <el-radio :label="true">选择</el-radio>
            <el-radio :label="false">不选择</el-radio>
          </el-radio-group>
          <el-select v-else-if="item.key === 'deptIds'" v-model="form.treeData" placeholder="请选择" multiple
            style="width: 90%;" @change="selectChange">
            <el-option :value="treeDataValue" style="height: auto;">
              <el-tree ref="tree" draggable :data="groupList" :props="defaultProps" :accordion="false" node-key="id"
                :auto-expand-parent="false" :highlight-current="true" :default-expand-all="true"
                :expand-on-click-node="false" :filter-node-method="filterNode"
                style="color:#666;font-family: Microsoft YaHei;" />
            </el-option>
          </el-select>
          <el-select v-else-if="item.key === 'menuIds'" v-model="form.menuTreeData" placeholder="请选择" multiple
            style="width: 90%;" @change="selectChange">
            <el-option :value="menuDataValue" style="height: auto;">
              <el-tree ref="tree" draggable :data="menuList" :props="defaultProps" :accordion="false" node-key="id"
                @node-click="handleMenuClick" :auto-expand-parent="false" :highlight-current="true"
                :default-expand-all="true" :expand-on-click-node="false" :filter-node-method="filterNode"
                style="color:#666;font-family: Microsoft YaHei;" show-checkbox @check-change="handleCheckChange"
                :check-strictly="true" />
            </el-option>
          </el-select>
          <el-input v-else v-model="temp[item.key]" style="width:90%" />
        </el-form-item>
      </div>
    </el-form>
    <div style="display: flex; justify-content: flex-end;" class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">提 交</el-button>
      <el-button v-if="dialogStatus === 'update'" type="primary" @click="updateData">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as roleApi from "@/api/role"

export default {
  name: 'TaskList',
  props: {
    temp1: {
      require: true,
      type: Object,
      default: null
    },
    groupList: {
      require: true,
      type: Array,
      default: null
    },
    menuList: {
      require: true,
      type: Array,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      require: true,
      default: ''
    },
    dialogStatus: {
      type: String,
      require: true,
      default: ''
    }
  },
  data() {
    return {
      groupVisible: this.show, // 引入页面弹窗的状态值一定要设置
      formHeader: [
        // { label: '角色编号', key: 'roleKey' },
        { label: '角色名称', key: 'roleName' },
        { label: '角色排序', key: 'roleSort' },
        // { label: '组织', key: 'deptIds' },
        { label: '菜单权限', key: 'menuIds' },
        // { label: '数据分数', key: 'dataScope' },
        // { label: '菜单选中', key: 'menuCheckStrictly' },
        // { label: '组织选中', key: 'deptCheckStrictly' },
        { label: '备注', key: 'remark' },
      ],
      rules: {
        roleName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 1, max: 16, message: '菜单名称长度1-16', trigger: 'blur' },
        ],
        roleSort: [
          { required: true, message: '请输入角色排序', trigger: 'blur' },
          // {
          //   required: true,
          //   pattern: "^[0-9]*$",//eslint-disable-line
          //   message: "排序只能输入数字",
          //   trigger: 'blur'
          // }
        ],
        menuIds: [
          { required: true, message: '请选择菜单权限', trigger: 'blur' },
        ],
      },
      temp: {
        // createBy: "123131313131",
        // createTime: "2023-04-12 10:53:10",
        // updateBy: "",
        // updateTime: null,
        // remark: "系统管理员",
        // roleName: "应用申请人员11",
        // roleKey: "ba66588b61496e2dee2dc7ee2629c68c",
        // roleSort: 1,
        // dataScope: "1",
        // menuCheckStrictly: true,
        // deptCheckStrictly: true,
        // menuIds: null,
        // deptIds: [
        //   1
        // ]
      },
      listQuery: {
        _page: 0,
        _page_size: 15
      },
      dialogTitle: '', // 弹框标题
      // dialogStatus: '',
      defaultProps: {
        children: "children",
        label: "label",
        id: 'id'
      },
      treeDataValue: "",
      menuDataValue: '',
      form: {
        treeData: [], // 多选
        treeId: [],
        menuTreeData: [], // 多选
        menuTreeId: []
      },
    }
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue
        this.temp = this.temp1
        if (this.dialogStatus == "update") {
          this.getRoleMenu(this.temp.roleId)
        }
        if (this.dialogStatus == "create") {
          this.temp = {}
        }
        console.log(this.dialogStatus, 'status')
      },
      deep: true
    }
  },
  created() {
  },
  mounted() { },
  methods: {
    //根据角色id查询角色菜单权限
    getRoleMenu(roleId) {
      const params = {
        roleId: roleId
      }
      roleApi.selectMenuTreeByRoleId(params).then(res => {
        if (res.code == 200) {
          // this.form.menuTreeData = res.data.checkedKeys
          this.temp.menuIds = res.data.checkedKeys
          this.getSelectValue(res.data.menus)
          this.selectChange();
        }
      })
    },
    //勾选树节点，获取id
    handleCheckChange() {
      this.temp.menuIds = this.$refs.tree[0].getHalfCheckedKeys().concat(this.$refs.tree[0].getCheckedKeys())
      this.form.menuTreeData = [];
      this.getSelectValue(this.menuList)
    },
    //递归去拿label拼接给下拉框展示
    getSelectValue(menuList) {
      menuList.forEach(item => {
        if (this.temp.menuIds.includes(item.id)) {
          this.form.menuTreeData.push(item.label)
        }
        if (item.children && item.children.length > 0) {
          this.getSelectValue(item.children)
        }
      })
    },
    //下拉框删除节点，树对应删除
    selectChange() {
      console.log(this.form.menuTreeData, 'ffff')
      const menuIds = [];
      this.menuList.forEach(item => {
        if (this.form.menuTreeData.includes(item.label)) {
          menuIds.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(v => {
            if (this.form.menuTreeData.includes(v.label)) {
              menuIds.push(v.id)
            }
          })
        }
      })
      this.$refs.tree[0].setCheckedKeys(menuIds, true)
      console.log(menuIds, 'menuIdsmenuIds')
    },
    //删除树对应节点的选中
    deleteCheckTree() {

    },
    // 点击树节点
    handleNodeClick(data, node, nodeData) {
      // select 多选（判重后添加到选择结果数组中）
      // this.treeDataValue = data
      // let num = 0;
      // this.form.treeData.forEach(item => {
      //   item == data.label ? num++ : num;
      // })
      // this.form.treeId.forEach(item => {
      //   item == data.deptId ? num++ : num;
      // })
      // if (num == 0) {
      //   this.form.treeData.push(data.label)
      //   this.form.treeId.push(data.deptId)
      // }
      console.log(data, node, nodeData, this.form, 'sssssssssss');

    },
    handleMenuClick(data, node, nodeData) {
      // select 多选（判重后添加到选择结果数组中）
      this.menuTreeDataValue = data
      let num = 0;
      this.form.menuTreeData.forEach(item => {
        item == data.label ? num++ : num;
      })
      this.form.menuTreeId.forEach(item => {
        item == data.id ? num++ : num;
      })
      if (num == 0) {
        this.form.menuTreeData.push(data.label)
        this.form.menuTreeId.push(data.id)
      }
      console.log(data, node, nodeData, this.form, 'sssssssssss');

    },

    closeGroupVisible() {
      this.$emit('update:show', false)
      if (this.dialogStatus === 'create') {
        this.resetSelect()
        this.groupVisible = false
      } else {
        this.groupVisible = false
        this.resetSelect()
      }
    },
    // 清空已选项数组，且置空所有选择
    resetSelect() {
      // this.selectRows = []
      this.temp = {}
    },
    // 取消新增
    cancelAdd() {
      if (this.dialogStatus === 'create') {
        this.resetSelect()
        this.groupVisible = false
      } else {
        this.groupVisible = false
      }
    },
    // 新增提交
    createData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          const uuid = require('uuid')
          data.roleKey = uuid.v1()
          // data.menuCheckStrictly = true
          // data.deptCheckStrictly = true
          // data.deptIds = this.form.treeId
          // data.menuIds = this.form.menuTreeId
          // data.updateTime = null
          // data.updateBy = ''
          // data.dataScope = '1'
          data.createBy = localStorage.getItem('createById')
          console.log(data, 'data')
          roleApi.insertRoleData(data).then(res => {
            if (res.code === 200) {
              this.$parent.getList()
              console.log(res, 'res');
              this.form = {
                treeData: [],
                treeId: []
              }
              this.groupVisible = false
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
            } else {
              this.groupVisible = false
              this.$message({
                message: res.msg,
                type: ''
              })
            }

          }).catch(err => {
            this.$message({
              message: err,
              // type: 'success'
            })
          })
        }
      })
    },
    // 编辑提交
    updateData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          // let { roleId, remark, roleName, roleKey, status, delFlag, update_by } = data
          // let params = { roleId, remark, roleName, roleKey, status, delFlag, update_by }
          let params = {
            roleId: data.roleId,
            roleName: data.roleName,
            update_by: localStorage.getItem("createById"),
            roleSort: data.roleSort,
            menuIds: data.menuIds,
            remark: data.remark
          }
          console.log(data, 'data')
          roleApi.updateRoleData(params).then(res => {
            this.$parent.getList()
            console.log(res, 'res');
            this.groupVisible = false
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
  }
}
</script>
<style lang="scss">
/*增加，编辑弹窗*/

.editDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }

  .el-dialog {
    width: 470px;
    border-radius: 32px;

    .el-dialog__header {
      height: 52px;
      background-color: #336699;
      border-radius: 32px 32px 0 0;
    }

    .el-dialog__title {
      // 标题
      color: #fff;
    }

    .el-dialog__headerbtn .el-dialog__close {
      // 右侧关闭按钮
      color: #fff !important;
      font-size: 20px;
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
      background: #336699;

      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #fff;
      }
    }
  }
}
</style>
