<template>
  <!--弹框部分-->
  <el-dialog
    :title="title"
    v-model="groupVisible"
    class="editDialog"
    :close-on-click-modal="false"
    @close="closeGroupVisible"
  >
    <el-form
      ref="dataform"
      label-width="120px"
      label-position="right"
      :rules="rules"
      :model="temp"
      class="editForm"
    >
      <div v-for="(item,index) in formHeader" :key="index">
        <el-form-item :label="item.label" :prop="item.key">
          <el-input v-if="item.key === 'menu'" v-model="temp[item.key]" style="width:90%" />
          <el-radio-group v-else-if="item.key === 'menuCheckStrictly'" v-model="temp[item.key]">
            <el-radio :label= true>选择</el-radio>
            <el-radio :label=false>不选择</el-radio>
          </el-radio-group>
          <el-radio-group v-else-if="item.key === 'deptCheckStrictly'" v-model="temp[item.key]">
            <el-radio :label= true>选择</el-radio>
            <el-radio :label=false>不选择</el-radio>
          </el-radio-group>
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
        { label: '角色编号', key: 'roleKey' },
        { label: '角色名称', key: 'roleName' },
        { label: '角色排序', key: 'roleSort' },
        { label: '菜单权限', key: 'menuIds' },
        // { label: '更新方式', key: 'updateBy' },
        // { label: '更新时间', key: 'updateTime' },
        { label: '数据分数', key: 'dataScope' },
        { label: '菜单选中', key: 'menuCheckStrictly' },
        { label: '组织选中', key: 'deptCheckStrictly' },
        { label: '组织ID', key: 'deptIds' },
        { label: '备注', key: 'remark' },
      ],
      rules: {
      },
      temp: {
        createBy: "123131313131",
        createTime: "2023-04-12 10:53:10",
        updateBy: "",
        updateTime: null,
        remark: "系统管理员",
        roleName: "应用申请人员11",
        roleKey: "ba66588b61496e2dee2dc7ee2629c68c",
        roleSort: 1,
        dataScope: "1",
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        menuIds: null,
        deptIds: [
          1
        ]
      },
      listQuery: {
        _page: 0,
        _page_size: 15
      },
      dialogTitle: '', // 弹框标题
      // dialogStatus: '',
      userOptions: [], // 人员下拉选择
      stationOptions: [], // 集输站下拉选择
      wellOptions: [], // 油井下拉选择
      truckOptions: [], // 车辆下拉选择
      driverOptions: [], // 司机下拉选择
      keyOptions: [] // 钥匙下拉选择
    }
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue
        console.log(newValue, 'sdfsdddddd');
        if (Object.keys(this.temp1).length > 0) {
          this.temp = this.temp1
        }
      },
      deep: true
    }
  },
  created() {
  },
  mounted() { },
  methods: {
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
          // let params = {
          //   createBy: "123131313131",
          //   createTime: "2023-04-12 10:53:10",
          //   updateBy: "",
          //   updateTime: null,
          //   remark: "系统管理员",
          //   roleName: "应用申请人员11",
          //   roleKey: "ba66588b61496e2dee2dc7ee2629c68c",
          //   roleSort: 1,
          //   dataScope: "1",
          //   menuCheckStrictly: true,
          //   deptCheckStrictly: true,
          //   menuIds: null,
          //   deptIds: [
          //     1
          //   ]
          // }
          roleApi.insertRoleData(data).then(res => {
            this.$parent.getList()
            console.log(res, 'res');
            this.groupVisible = false
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
          let { roleId, remark, roleName, roleKey, status, delFlag, update_by } = data
          let params = { roleId, remark, roleName, roleKey, status, delFlag, update_by }
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
