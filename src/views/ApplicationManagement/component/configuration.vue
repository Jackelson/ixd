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
      <div v-for="(item, index) in formHeader" :key="index">
        <el-form-item :label="item.label" :prop="item.key">
          <el-input
            v-if="item.key === 'menu'"
            v-model="temp[item.key]"
            style="width: 90%"
          />
          <el-radio-group
            v-else-if="item.key === 'menuCheckStrictly'"
            v-model="temp[item.key]"
          >
            <el-radio :label="true">选择</el-radio>
            <el-radio :label="false">不选择</el-radio>
          </el-radio-group>
          <el-radio-group
            v-else-if="item.key === 'deptCheckStrictly'"
            v-model="temp[item.key]"
          >
            <el-radio :label="true">选择</el-radio>
            <el-radio :label="false">不选择</el-radio>
          </el-radio-group>
          <el-select
            v-else-if="item.key === 'deptIds'"
            v-model="form.treeData"
            placeholder="请选择"
            multiple
            style="width: 90%"
            collapse-tags
            @change="selectChange"
          >
            <el-option :value="treeDataValue" style="height: auto">
              <el-tree
                ref="tree"
                draggable
                :data="groupList"
                :props="defaultProps"
                :accordion="false"
                node-key="id"
                @node-click="handleNodeClick"
                :auto-expand-parent="false"
                :highlight-current="true"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                style="color: #666; font-family: Microsoft YaHei"
              />
              <el-tree
                ref="tree"
                class="deptTreeSty"
                draggable
                :data="groupList"
                :props="defaultProps"
                :accordion="false"
                node-key="id"
                @node-click="handleNodeClick"
                :auto-expand-parent="false"
                :highlight-current="true"
                :default-expand-all="true"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                style="color: #666; font-family: Microsoft YaHei"
              />
            </el-option>
          </el-select>
          <!-- <el-select
            v-else-if="item.key === 'menuIds'"
            v-model="form.menuTreeData"
            placeholder="请选择"
            multiple
            style="width: 90%;"
            collapse-tags
            @change="selectChange"
          >
          <el-option :value="menuDataValue" style="height: auto;">-->
          <el-tree
            ref="tree"
            draggable
            v-else-if="item.key === 'menuIds'"
            node-key="userId"
            :default-checked-keys="source"
            :data="menuList"
            :props="defaultProps"
            :accordion="false"
            show-checkbox
            @node-click="handleMenuClick"
            :auto-expand-parent="false"
            :highlight-current="true"
            :default-expand-all="true"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            style="color: #666; font-family: Microsoft YaHei; width: 100%"
          />
          <!-- <el-tree ref="tree" draggable v-else-if="item.key === 'menuIds'" class="menuIdsTreeSty" empty-text="暂无人员配置"
            node-key="id" :default-checked-keys="source" :data="menuList" :props="defaultProps" :accordion="false"
            show-checkbox @node-click="handleMenuClick" :auto-expand-parent="false" :highlight-current="true"
            :default-expand-all="true" :expand-on-click-node="false" :filter-node-method="filterNode"
            style="color:#666;font-family: Microsoft YaHei;" /> -->
          <!-- </el-option>
          </el-select>-->
          <el-input
            v-else
            v-model="temp[item.key]"
            style="width: 90%"
            :disabled="item.disabled"
          />
        </el-form-item>
      </div>
    </el-form>
    <div style="display: flex; justify-content: flex-end" class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button type="primary" @click="createData">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as roleApi from "@/api/role";

export default {
  name: "TaskList",
  props: {
    temp1: {
      require: true,
      type: Object,
      default: null,
    },
    menuList: {
      require: true,
      type: Array,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
    source: {
      type: Array,
      default: null,
    },
    title: {
      type: String,
      require: true,
      default: "",
    },
    dialogStatus: {
      type: String,
      require: true,
      default: "",
    },
  },
  data() {
    return {
      groupVisible: this.show, // 引入页面弹窗的状态值一定要设置
      formHeader: [
        { label: "应用ID", key: "id", disabled: true },
        { label: "名称", key: "appName", disabled: true },
        { label: "应用状态", key: "state", disabled: true },
        { label: "用户权限", key: "menuIds", disabled: false },
      ],
      rules: {},
      temp: {},
      dialogTitle: "", // 弹框标题
      // dialogStatus: '',
      defaultProps: {
        children: "userNames",
        label: "label",
        id: "id",
      },
      treeDataValue: "",
      menuDataValue: "",
      form: {
        treeData: [], // 多选
        treeId: [],
        menuTreeData: [], // 多选
        menuTreeId: [],
      },
    };
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue;
        this.temp = this.temp1;
      },
      deep: true,
    },
    menuList: {
      handler() {
        console.log(this.menuList, "menuList");
        const keys = [];
        this.menuList.forEach((item) => {
          if (item.userNames && item.userNames.length > 0) {
            item.userNames.forEach((v) => {
              console.log(v, "vvvvvvvv");
              if (v.isBelong) {
                keys.push(v.userId);
              }
            });
          }
        });
        this.$refs.tree[0].setCheckedKeys(keys, true);
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 点击树节点
    handleNodeClick(data, node, nodeData) {
      // select 多选（判重后添加到选择结果数组中）
      this.treeDataValue = data;
      let num = 0;
      this.form.treeData.forEach((item) => {
        item == data.label ? num++ : num;
      });
      this.form.treeId.forEach((item) => {
        item == data.deptId ? num++ : num;
      });
      if (num == 0) {
        this.form.treeData.push(data.label);
        this.form.treeId.push(data.deptId);
      }
      console.log(data, node, nodeData, this.form, "sssssssssss");
    },
    handleMenuClick(data, node, nodeData) {
      // select 多选（判重后添加到选择结果数组中）
      this.menuTreeDataValue = data;
      let num = 0;
      this.form.menuTreeData.forEach((item) => {
        item == data.label ? num++ : num;
      });
      this.form.menuTreeId.forEach((item) => {
        item == data.id ? num++ : num;
      });
      if (num == 0) {
        this.form.menuTreeData.push(data.label);
        this.form.menuTreeId.push(data.id);
      }
      console.log(data, node, nodeData, this.form, "sssssssssss");
    },
    filterNode() {},
    closeGroupVisible() {
      this.$emit("update:show", false);
      if (this.dialogStatus === "create") {
        this.resetSelect();
        this.groupVisible = false;
      } else {
        this.groupVisible = false;
        this.resetSelect();
      }
    },
    // 清空已选项数组，且置空所有选择
    resetSelect() {
      // this.selectRows = []
      this.temp = {};
    },
    // 取消新增
    cancelAdd() {
      if (this.dialogStatus === "create") {
        this.resetSelect();
        this.groupVisible = false;
      } else {
        this.groupVisible = false;
      }
    },
    // 新增提交
    createData() {
      this.groupVisible = false;
      const menus = this.$refs.tree[0].getCheckedKeys();
      const params = [];
      this.menuList.forEach((item) => {
        if (item.userNames && item.userNames.length > 0) {
          item.userNames.forEach((v) => {
            if (menus.includes(v.userId)) {
              const obj = {
                userId: v.userId,
                roleId: item.roleId,
                appId: this.temp.id,
              };
              params.push(obj);
            }
          });
        }
      });
      console.log(params, "paramsparams");
      roleApi.updateUserRole(params).then((res) => {
        console.log(res, "res");
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "更新成功",
          });
        } else {
          return this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
      // this.$refs['dataform'].validate((valid) => {
      //   if (valid) {
      //     const data = Object.assign({}, this.temp)
      //     data.menuCheckStrictly = true
      //     data.deptCheckStrictly = true
      //     data.deptIds = this.form.treeId
      //     data.menuIds = this.form.menuTreeId
      //     data.updateTime = null
      //     data.updateBy = ''
      //     data.dataScope = '1'
      //     data.createBy = localStorage.getItem('createById')
      //     roleApi.insertRoleData(data).then(res => {
      //       this.$parent.getList()
      //       console.log(res, 'res');
      //       this.form = {
      //         treeData: [],
      //         treeId: []
      //       }
      //       this.groupVisible = false
      //       this.$message({
      //         message: '更新成功！',
      //         type: 'success'
      //       })
      //     })
      //     console.log(data);
      //   }
      // })
    },
    // 编辑提交
    updateData() {
      this.$refs["dataform"].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp);
          let {
            roleId,
            remark,
            roleName,
            roleKey,
            status,
            delFlag,
            update_by,
          } = data;
          let params = {
            roleId,
            remark,
            roleName,
            roleKey,
            status,
            delFlag,
            update_by,
          };
          console.log(data, "data");
          roleApi.updateRoleData(params).then((res) => {
            this.$parent.getList();
            console.log(res, "res");
            this.groupVisible = false;
            this.$message({
              message: "更新成功！",
              type: "success",
            });
          });
        }
      });
    },
  },
};
</script>
<style lang="scss">
.menuIdsTreeSty {
  .el-tree__empty-text {
    position: inherit !important;
  }
}

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

::v-deep .el-tree {
  width: 100% !important;
}

::v-deep .el-tree__empty-text {
  position: static !important;
  left: 0 !important;
}
</style>
