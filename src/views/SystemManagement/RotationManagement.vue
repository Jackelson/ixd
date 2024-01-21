<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-06 17:25:25
 * @LastEditors: hjw
 * @LastEditTime: 2023-06-18 19:15:50
-->
<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="图片名称">
          <el-input v-model="imgQuery.imageName" clearable />
        </el-form-item>
        <el-form-item label="图片状态">
          <el-select v-model="imgQuery.state" clearable>
            <el-option value="0" label="待展示"></el-option>
            <el-option value="1" label="已展示"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="imgQuery.createName" clearable />
        </el-form-item>
        <el-form-item label="图片介绍">
          <el-input v-model="imgQuery.imageDesc" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="getList('query')">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="height: 40px; line-height: 40px" type="flex">
      <el-col class="edit" :span="16">
        <el-button @click="addDialog">新增</el-button>
        <!-- <el-button @click="handleUpdate">修改</el-button> -->
        <el-button @click="handleStop(-1)">删除</el-button>
        <el-button @click="handleUpdateStatus(1)">展示</el-button>
        <el-button @click="handleUpdateStatus(0)">取消展示</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row>
      <el-card class="role-card">
        <el-table
          ref="multipleTable1"
          :data="tableList"
          height="450px"
          :header-cell-style="{
            background: '#11ac9b !important',
            color: '#ffffff',
          }"
          :highlight-current-row="highlight"
          style="width: 100%"
          @select="handerChange1"
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
              <span v-if="item.key === 'operate'">
                <el-button @click="openImage(scope.row)">
                  <span>查看</span>
                </el-button>
              </span>
              <span>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页查询-->
        <el-row justify="end">
          <el-col :span="8">
            <el-pagination
              :current-page="page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="imgTotal"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <!--弹框部分-->
    <RotationDialog
      :title="dialogTitle"
      :dialog-status="dialogStatus"
      v-model:show="dialogAdd"
      :temp1="temp"
      source="task"
    />

    <!--终止、下发、结单 弹框部分-->
    <el-dialog
      title="删除"
      v-model="dialogDel"
      class="confirmDialog"
      :close-on-click-modal="false"
    >
      <el-row type="flex" justify="center">
        <div class="img-tip"></div>
      </el-row>
      <el-row type="flex" justify="center" style="margin: 20px 0">
        <span class="message">{{ deleteTxt }}</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="stopData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
  <el-row style="margin-top: 60px">
    <el-form :inline="true">
      <el-form-item label="公告标题">
        <el-input v-model="form.noticeTitle" clearable />
      </el-form-item>
      <el-form-item label="公告状态">
        <el-select v-model="form.status" clearable>
          <el-option value="0" label="待发布"></el-option>
          <el-option value="1" label="已发布"></el-option>
          <el-option value="2" label="撤回"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="创建人">
        <el-input v-model="form.createName" clearable/>
      </el-form-item> -->
      <el-form-item label="公告类别">
        <el-select v-model="form.noticeType" clearable>
          <el-option value="2" label="公告"></el-option>
          <el-option value="1" label="通知"></el-option>
          <el-option value="3" label="新闻资讯"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getNotice('query')">查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
  <div class="app-container">
    <el-row style="height: 40px; line-height: 40px" type="flex">
      <el-col class="edit" :span="16">
        <el-button @click="addNoticeDialog">新增</el-button>
        <el-button @click="noticeUpdate">修改</el-button>
        <el-button @click="fabuNotice">发布</el-button>
        <el-button @click="chNotice">撤回</el-button>
        <el-button @click="deleteNo">删除</el-button>
        <!-- <el-button @click="getNotice">查询</el-button> -->
      </el-col>
    </el-row>
    <!-- 表格 -->
    <!-- 公告 -->
    <el-row>
      <el-card class="role-card">
        <el-table
          ref="multipleTable2"
          :data="noticeList"
          height="450px"
          :header-cell-style="{
            background: '#11ac9b !important',
            color: '#ffffff',
          }"
          :highlight-current-row="highlight"
          style="width: 100%"
          @select="handerChange2"
        >
          <!-- @row-click="rowClick"
          @selection-change="handleSelectionChange2" -->
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
            v-for="item in noticeHeader"
            :key="item.key"
            :label="item.label"
            show-overflow-tooltip
            align="center"
            :min-width="item.minWidth"
            :width="item.width"
          >
            <template v-slot="scope">
              <span v-if="item.key == 'noticeType'">{{
                scope.row[item.key] == 1
                  ? "通知"
                  : scope.row[item.key] == 2
                  ? "公告"
                  : scope.row[item.key] == 3
                  ? "新闻资讯"
                  : ""
              }}</span>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row justify="end">
          <el-col :span="8">
            <el-pagination
              :current-page="notPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="notSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="noticeTotal"
              @size-change="handleSizeChang2"
              @current-change="handleCurrentChange2"
            />
          </el-col>
        </el-row>
      </el-card>
    </el-row>

    <!--弹框部分-->
    <NoticeDialog
      :title="dialogTitle"
      :dialogStatus="dialogNoticeStatus"
      v-model:show="dialogNotice"
      :temp1="currrentRow2"
      source="task"
    />

    <!--删除公告-->
    <el-dialog
      title="删除"
      v-model="dialogDel"
      class="confirmDialog"
      :close-on-click-modal="false"
    >
      <el-row type="flex" justify="center">
        <div class="img-tip"></div>
      </el-row>
      <el-row type="flex" justify="center" style="margin: 20px 0">
        <span class="message">{{ deleteTxt }}</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="stopNotice">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看图片"
      v-model="dialogShow"
      :close-on-click-modal="false"
      style="width: 500px"
    >
      <img
        v-if="dialogShow"
        :src="imgSrc"
        style="width: 460px; height: 300px"
      />
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/api/appCarousel";
import RotationDialog from "./component/rotationDialog.vue";
import NoticeDialog from "./component/noticeDialog.vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "TaskDistribute",
  components: {
    RotationDialog,
    NoticeDialog,
  },
  data() {
    return {
      dialogShow: false,
      imgSrc: "",
      tableLoading: true,
      noticeLoading: true,
      serviceTotal: 0,
      imgTotal: 0,
      noticeTotal: 0,
      page: 1,
      pageSize: 10,
      notPage: 1,
      notSize: 10,
      form: {
        noticeTitle: "",
        status: "",
        createName: "",
        noticeType: "",
      },
      imgQuery: {
        imageName: "",
        state: "",
        createName: "",
        imageDesc: "",
      },
      tableList: [],
      noticeList: [],
      noticeHeader: [
        { label: "类别", key: "noticeType" },
        // { label: '顺序', key: 'sort' },
        { label: "名称", key: "noticeTitle" },
        { label: "公告内容", key: "noticeContent" },
        { label: "是否展示", key: "status" },
        { label: "备注", key: "remark" },
      ],
      tableHeader: [
        { label: "顺序", key: "sort" },
        { label: "名称", key: "imageName" },
        { label: "是否展示", key: "state" },
        { label: "图片介绍", key: "imageDesc" },
        { label: "查看", key: "operate" },
        { label: "创建时间", key: "createTime" },
        { label: "创建人", key: "createName" },
      ],
      currrentRow1: {},
      currrentRow2: {},
      selectRows: [], // 批量操作时选中的所有行数组
      multipleSelection: [],
      multipleSelection2: [],
      statusOptions: [],
      temp: {},
      highlight: true,
      dialogTitle: "", // 弹框标题
      dialogStatus: "",
      dialogNoticeStatus: "",
      dateStart: "",
      dateEnd: "",
      updateBy: "",
      remark: "",
      dialogAdd: false,
      dialogNotice: false,
      dialogDel: false,
      deleteTxt: "",
      adjustVisible: false, // 侧拉弹窗
      height: document.documentElement.clientHeight,
    };
  },
  created() {
    this.getList();
    this.getNotice();
  },
  mounted() {},
  methods: {
    fabuNotice() {
      if (!this.currrentRow2.id) {
        this.$message({ type: "warning", message: "请选择要发布的数据" });
        return;
      }
      if (!this.currrentRow2.status == "发布") {
        this.$message({ type: "warning", message: "该条数据已经发布" });
        return;
      }
      ElMessageBox.confirm(`是否发布公告?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const obj = {
            id: this.currrentRow2.id,
            status: 1,
          };
          api.updateStatus([obj]).then((res) => {
            if (res.code == 200) {
              this.getNotice();
              this.currrentRow2 = {};
              return this.$message({ type: "success", message: "发布成功" });
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
    chNotice() {
      if (!this.currrentRow2.id) {
        this.$message.warning("请选择要撤回的数据");
        return;
      }
      if (
        this.currrentRow2.status == "撤回" ||
        this.currrentRow2.status == "待发布"
      ) {
        this.$message.warning("待发布或者已撤回不能撤回");
        return;
      }
      ElMessageBox.confirm(`是否撤回公告?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const obj = {
            id: this.currrentRow2.id,
            status: 2,
          };
          api.updateStatus([obj]).then((res) => {
            if (res.code == 200) {
              this.getNotice();
              return this.$message({ type: "success", message: "撤回成功" });
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
    openImage(row) {
      this.dialogShow = true;
      this.imgSrc = "data:image/png;base64," + row.base64Image;
    },
    changeVal(val) {
      if (val == "-1") {
        return (val = "删除");
      } else if (val == "0") {
        return (val = "待展示");
      } else {
        return (val = "展示");
      }
    },
    changeNoticeVal(val) {
      if (val == "0") {
        return (val = "待发布");
      } else if (val == "1") {
        return (val = "发布");
      } else if (val == "2") {
        return (val = "撤回");
      } else {
        return (val = "删除");
      }
    },
    handerChange1(v, r) {
      if (r.id == this.currrentRow2.id) {
        this.$refs.multipleTable1.toggleRowSelection(r, false);
        this.currrentRow1 = {};
      } else {
        this.$refs.multipleTable1.toggleRowSelection(this.currrentRow1, false);
        this.$refs.multipleTable1.toggleRowSelection(r, true);
        this.currrentRow1 = r;
      }
    },
    handerChange2(v, r) {
      if (r.id == this.currrentRow2.id) {
        this.$refs.multipleTable2.toggleRowSelection(r, false);
        this.currrentRow2 = {};
      } else {
        this.$refs.multipleTable2.toggleRowSelection(this.currrentRow2, false);
        this.$refs.multipleTable2.toggleRowSelection(r, true);
        this.currrentRow2 = r;
      }
    },
    //查询公告
    getNotice(type) {
      const params = Object.assign({}, this.form);
      params.pageNum = this.notPage;
      params.pageSize = this.notSize;
      params.userId = localStorage.getItem("createById");
      if (type == "query") {
        params.pageNum = 1;
      }
      api.selectNews(params).then((res) => {
        this.noticeList = res.data.rows;
        this.noticeList.forEach((ele) => {
          ele.status = this.changeNoticeVal(ele.status);
        });
        this.serviceTotal = res.data.total;
        // this.noticeLoading = false
        this.noticeTotal = res.data.total;
        this.noticeLoading = false;
      });
    },
    // 查询表单
    getList(type) {
      let params = {
        pageNum: this.page,
        ...this.imgQuery,
        pageSize: this.pageSize,
      };
      params.userId = localStorage.getItem("createById");
      // this.tableLoading = true
      if (type == "query") {
        params.pageNum = 1;
      }
      api.selectData(params).then((res) => {
        console.log(res, "res");
        this.tableList = res.data.rows;
        this.tableList.forEach((ele) => {
          ele.state = this.changeVal(ele.state);
        });
        this.imgTotal = res.data.total;
        // this.tableLoading = false
        this.serviceTotal = res.data.total;
        this.tableLoading = false;
      });
    },
    //删除公告数据
    stopData() {
      let params = this.multipleSelection.map((item) => item.id);
      console.log(params, "params");
      api.deleteData(params).then((res) => {
        console.log(res, "deleteData");
        this.dialogDel = false;
        this.$message({
          message: "删除成功！",
          type: "success",
        });
        this.getList();
      });
    },
    //删除公告
    stopNotice() {
      api.deleteNotice([this.currrentRow2.id]).then((res) => {
        this.dialogDel = false;
        if (res.code == 200) {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.currrentRow2 = {};
          this.getNotice();
        }
      });
    },
    // 分页查询
    handleCurrentChange(page) {
      this.page = page;
      this.getList();
    },
    handleCurrentChange2(page) {
      this.notPage = page;
      this.getNotice();
    },
    handleSelectionChange(val) {
      this.$refs.multipleTable.toggleRowSelection(val[0], false);
      this.multipleSelection = val;
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getNotice();
    },
    handleSizeChang2(pageSize) {
      this.notPage = 1;
      this.notSize = pageSize;
      this.getNotice();
    },

    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.selectRows = [];
      this.temp = {};
      this.currrentRow2 = {};
      this.currrentRow1 = {};
      this.$refs.multipleTable1.clearSelection();
      this.$refs.multipleTable2.clearSelection();
    },
    //新增通告
    addNoticeDialog() {
      this.highlight = false;
      // this.temp = {}
      this.resetSelect();
      this.dialogTitle = "custom";
      this.dialogNoticeStatus = "create";
      this.dialogNotice = true;
    },
    // 新增角色
    addDialog() {
      this.highlight = false;
      // this.temp = {}
      this.resetSelect();
      // this.dialogTitle = "新增图片";
      this.dialogTitle = "新增轮播图";
      this.dialogStatus = "create";
      this.dialogAdd = true;
      console.log(this.dialogAdd);
    },
    // 编辑
    handleUpdate() {
      if (this.multipleSelection.length > 1) {
        return this.$message({
          message: "只能选择一条修改",
          type: "warning",
        });
      }
      if (Object.keys(this.multipleSelection).length > 0) {
        this.dialogTitle = "修改图片";
        this.dialogTitle = "修改轮播图";
        this.dialogStatus = "update";
        this.dialogAdd = true;
        this.temp = this.multipleSelection[0];
      } else {
        this.$message({
          message: "请选择要修改的轮播图！",
          type: "warning",
        });
      }
    },
    //编辑公告
    noticeUpdate() {
      if (this.currrentRow2.id) {
        if (this.currrentRow2.status == "发布") {
          this.$message.warning("请先撤回,再进行编辑");
          return;
        }
        this.dialogTitle = "修改";
        if (this.currrentRow2.noticeType == "3") {
          this.dialogTitle += "新闻资讯";
        } else if (this.currrentRow2.noticeType == "2") {
          this.dialogTitle += "公告";
        } else {
          this.dialogTitle += "通知";
        }
        this.dialogNoticeStatus = "update";
        this.dialogNotice = true;
      } else {
        this.$message({
          message: "请选择要修改的公告！",
          type: "warning",
        });
      }
    },
    // 删除轮播图
    handleStop(status) {
      if (!this.currrentRow1.id) {
        this.$message.warning("请选择要删除的轮播图");
        return;
      }
      if (this.currrentRow1.state == "展示") {
        this.$message.warning("请先取消展示");
        return;
      }
      ElMessageBox.confirm(
        `是否${status == 1 ? "发布" : "删除"}轮播图?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          api.deleteData([this.currrentRow1.id]).then((res) => {
            if (res.code == 200) {
              this.getList();
              return this.$message({ type: "success", message: "删除成功" });
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleUpdateStatus(status) {
      if (!this.currrentRow1.id) {
        this.$message.warning("请选择轮播图");
        return;
      }
      if (status == 1) {
        if (this.currrentRow1.state == "展示") {
          this.$message.warning("轮播图已展示");
          return;
        }
      } else {
        if (this.currrentRow1.state == "待展示") {
          this.$message.warning("轮播图已是待展示状态");
          return;
        }
      }

      ElMessageBox.confirm(
        `是否${status == 1 ? "展示" : "取消展示"}轮播图?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // const params = [];
          const obj = {
            id: this.currrentRow1.id,
            state: status,
          };
          api.updateState([obj]).then((res) => {
            if (res.code == 200) {
              this.getList();
              return this.$message({
                type: "success",
                message: "状态修改成功",
              });
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
    //删除公告
    deleteNo() {
      if (this.currrentRow2.status == "发布") {
        this.$message({
          message: "请先撤回，再进行删除",
          type: "warning",
        });
        return;
      }
      if (Object.keys(this.currrentRow2).length > 0) {
        this.deleteTxt = "是否删除公告";
        this.dialogDel = true;
      } else {
        this.$message({
          message: "请勾选要删除的公告！",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  // height: 70%;
}

// .app-bottom {
//   height: 30%;
// }

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
</style>
<style lang="scss">
.role-card {
  width: 100%;
  // .el-card__body {
  //   padding: 5px;
  //   height: 100%;
  // }
}

.el-table .change-row {
  background: #e4f4f3 !important;
}

.el-table .change-row-2 {
  background: #f9fafa !important;
}
</style>
