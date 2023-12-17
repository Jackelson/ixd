<template>
  <div class="app-container">
    <el-row style="height: 40px; line-height: 40px" type="flex">
      <el-col :span="8">
        <span>搜索菜单：</span>
        <el-input
          :clearable="true"
          v-model="menuName"
          style="width: 70%"
        ></el-input>
      </el-col>
      <el-col class="edit" :span="14">
        <el-button @click="queryMenu">查询</el-button>
        <el-button @click="addDialog">新增菜单</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row style="height: calc(100% - 40px)">
      <el-card class="role-card">
        <el-table
          ref="multipleTable"
          :data="list"
          height="calc(100% - 5vh)"
          :header-cell-style="{
            background: '#11ac9b !important',
            color: '#ffffff',
          }"
          :highlight-current-row="highlight"
          style="width: 100%"
          row-key="menuId"
          @select="handerChange"
        >
          <el-table-column type="selection" width="55" />
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
              <span v-if="item.key === 'operate'">
                <el-button type="text" @click="openShareDialog(scope.row)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  <span>修改</span>
                </el-button>
                <el-button type="text" @click="deleteData(scope.row)">
                  <el-icon>
                    <Tools />
                  </el-icon>
                  <span>删除</span>
                </el-button>
              </span>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页查询-->
        <!-- <el-row style="width: 100%; display: flex; justify-content: flex-end;">
          <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="serviceTotal" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </el-row> -->
      </el-card>
    </el-row>

    <!--弹框部分-->
    <MenuDialog
      :title="dialogTitle"
      :dialog-status="dialogStatus"
      v-model:show="dialogAdd"
      :temp1="temp"
      source="task"
      :parentId="parentId"
    />

    <!--删除 角色 弹框部分-->
    <!-- <el-dialog title="删除角色" v-model="dialogDelRole" class="confirmDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">是否删除所选菜单</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDelRole = false">取 消</el-button>
        <el-button type="primary" @click="deleteDataRole">确 认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { Edit, Tools } from "@element-plus/icons-vue";
import MenuDialog from "./component/menuDialog.vue";
import * as menuApi from "@/api/menu";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "TaskDistribute",
  components: { MenuDialog, Edit, Tools },
  data() {
    return {
      menuName: "",
      menuId: "",
      serviceTotal: 0,
      filterData: {
        appName: "",
        appStatus: "",
      },
      userid: "",
      page: 1,
      pageSize: 10,
      selectRows: [], //勾选列表数据
      list: [
        // { component: '002', menuName: '张三', orderNum: '1', createTime: '2022-12-33' },
        // { component: '002', menuName: '李四', orderNum: '1', createTime: '2022-12-33' },
        // { component: '002', menuName: '张三', orderNum: '1', createTime: '2022-12-33' },
        // { component: '002', menuName: '张三', orderNum: '1', createTime: '2022-12-33' },
      ],
      tableHeader: [
        { label: "菜单名称", key: "menuName" },
        { label: "菜单排序", key: "orderNum" },
        { label: "菜单路径", key: "component" },
        { label: "创建时间", key: "createTime" },
        { label: "操作", key: "operate" },
      ],
      multipleSelection: [],
      statusOptions: [],
      temp: {},
      highlight: true,
      dialogDelRole: false,
      dialogTitle: "", // 弹框标题
      dialogStatus: "",
      dialogAdd: false,
      height: document.documentElement.clientHeight,
      parentId: 0,
    };
  },
  created() {
    this.userid = localStorage.getItem("createById");
    this.getList();
  },
  mounted() {},
  methods: {
    handerChange(row, select) {
      this.select = 0;
      if (select.parentId == 0) {
        if (this.parentId == select.menuId) {
          this.$refs.multipleTable.toggleRowSelection(select, false);
          this.parentId = 0;
          return;
        }
        this.parentId = select.menuId;
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(select, true);
        row.forEach((item) => {
          if (item.parentId != 0) {
            this.$refs.multipleTable.toggleRowSelection(item, false);
          }
        });
      } else {
        this.$refs.multipleTable.toggleRowSelection(select, false);
        this.$message({
          type: "warning",
          message: "不能选择二级菜单",
        });
      }
    },
    openShareDialog(val) {
      console.log(val, "ssss");
      this.temp = val;
      this.tableData = val;
      this.dialogAdd = true;
      this.dialogStatus = "update";
    },
    getList() {
      let params = {
        menuName: this.menuName,
      };
      menuApi.selectAllMenu(params).then((res) => {
        // this.list = res.data.rows;
        this.list = [];
        res.data.rows.forEach((item) => {
          if (item.parentId == 0) {
            this.list.push(item);
          } else {
            for (let i = 0; i < this.list.length; i++) {
              if (item.parentId == this.list[i].menuId) {
                this.list[i].children.push(item);
              }
            }
          }
        });
        this.menuId = res.data.rows.menuId;
        this.serviceTotal = res.data.total;
      });
    },
    queryMenu() {
      this.getList();
    },

    //删除
    deleteData(val) {
      this.dialogDelRole = true;
      this.menuId = val.menuId;
      ElMessageBox.confirm(`确定删除${val.menuName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDataRole();
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    deleteDataRole() {
      let params = {
        menuId: this.menuId,
      };
      // let params = {
      //   "menuId":menuId
      // }
      // console.log(menuId, 'params');
      menuApi.deleteMenuData(params).then((res) => {
        if (res.code == 200) {
          this.dialogDelRole = false;
          this.getList();
          this.$message({
            message: "删除成功！",
            type: "success",
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 分页查询
    handleCurrentChange(val) {
      console.log(val);
      this.getList();
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.requestData();
    },

    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.parentId = 0;
      this.selectRows = [];
      this.temp = {};
      this.$refs.multipleTable.clearSelection();
    },

    // 新增角色
    addDialog() {
      this.highlight = false;
      this.temp = {};
      this.dialogTitle = "新增菜单";
      this.dialogStatus = "create";
      this.dialogAdd = true;
    },
  },
};
</script>
<style lang="scss">
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
</style>
