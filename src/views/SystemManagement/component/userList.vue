<template>
  <!--弹框部分-->
  <el-dialog
    title="用户列表"
    width="80%"
    v-model="groupVisible"
    class="editDialog"
    :close-on-click-modal="false"
    @close="closeGroupVisible"
  >
    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="userList"
      height="calc(100% - 7vh)"
      :header-cell-style="{
        background: '#11ac9b !important',
        color: '#ffffff',
      }"
      style="width: 100%"
      class="roleTableSty"
    >
      <el-table-column
        label="序号"
        align="center"
        type="index"
        width="80px"
        min-width="80px"
      />
      <el-table-column
        v-for="item in userTableHeader"
        :key="item.key"
        :label="item.label"
        show-overflow-tooltip
        align="center"
        :min-width="item.minWidth"
        :width="item.width"
      >
        <template v-if="item.key == 'sex'" v-slot="scope">
          <span>{{ scope.row[item.key] == "1" ? "女" : "男" }}</span>
        </template>
        <template v-else v-slot="scope">
          <span>{{ scope.row[item.key] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页查询-->
    <el-row
      style="
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        margin-top: 5px;
      "
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
  </el-dialog>
</template>
<script>
import * as userApi from "@/api/user";

export default {
  name: "TaskList",
  props: {
    temp1: {
      require: true,
      type: Object,
      default: null,
    },
    userParams: {
      require: true,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      groupVisible: this.show, // 引入页面弹窗的状态值一定要设置
      total: 0,
      page: 1,
      pageSize: 10,
      tableLoading: true,
      userList: [],
      userTableHeader: [
        { label: "用户名", key: "userName", minWidth: "80px" },
        { label: "性别", key: "sex", minWidth: "80px" },
        { label: "手机号码", key: "phonenumber", minWidth: "80px" },
        { label: "电子邮箱", key: "email", minWidth: "80px" },
        // { label: '备注', key: 'remark', minWidth: '80px' },
      ],
      dialogUser: false,
      rules: {},
      temp: {},
    };
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue;
        console.log(newValue, this.userList, "sdfsdddddd");
        if (Object.keys(this.temp1).length > 0) {
          this.temp = this.temp1;
        }
      },
      deep: true,
    },
    userParams: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getList() {
      let param = {
        roleId: this.userParams,
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.tableLoading = true;
      userApi.selectUserByRoleId(param).then((res) => {
        console.log(res);
        this.userList = res.data.rows;
        this.total = res.data.total;
        this.tableLoading = false;
      });
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getList();
    },
    closeGroupVisible() {
      this.$emit("update:show", false);
      this.resetSelect();
      this.groupVisible = false;
    },
    // 清空已选项数组，且置空所有选择
    resetSelect() {
      // this.selectRows = []
      this.temp = {};
    },
  },
};
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
