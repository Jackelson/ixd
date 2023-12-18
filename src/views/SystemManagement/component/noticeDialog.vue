<template>
  <!--弹框部分-->
  <el-dialog
    :title="dialogTitle"
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
      <div v-for="(item, index) in formNoticeHeader" :key="index">
        <template v-if="!item.hidden">
          <el-form-item :label="item.label" :prop="item.key">
            <el-upload
              v-if="item.key === 'file'"
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :http-request="upload"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <!-- <el-date-picker
            v-model="temp[item.key]"
            v-if="item.key == 'dateStart'"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
          <el-date-picker
            v-model="temp[item.key]"
            v-else-if="item.key == 'dateEnd'"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker> -->
            <el-select
              v-else-if="item.key == 'noticeType'"
              v-model="temp[item.key]"
              style="width: 90%"
              :disabled="item.disabled"
            >
              <el-option value="2" label="公告"></el-option>
              <el-option value="1" label="通知"></el-option>
              <el-option value="3" label="新闻咨询"></el-option>
            </el-select>
            <el-input
              v-else-if="item.key == 'noticeContent'"
              v-model="temp[item.key]"
              type="textarea"
              style="width: 90%"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
            <!-- </el-upload> -->
            <!-- <el-input type="textarea" v-if="item.key == 'noticeContent'" v-model="temp[item.key]" style="width:90%" /> -->
            <el-select
              v-else-if="item.key == 'appId'"
              v-model="temp[item.key]"
              style="width: 90%"
              :disabled="item.disabled"
            >
              <el-option
                v-for="item in appList"
                :key="item.id"
                :label="item.app_name"
                :value="item.id"
              />
            </el-select>
            <el-input v-else v-model="temp[item.key]" style="width: 90%" />
          </el-form-item>
        </template>
      </div>
      <div></div>
    </el-form>
    <div style="display: flex; justify-content: flex-end" class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button
        v-if="dialogStatus === 'create'"
        type="primary"
        @click="createData"
        >提 交</el-button
      >
      <el-button
        v-if="dialogStatus === 'update'"
        type="primary"
        @click="updateData"
        >提 交</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/api/appCarousel";
export default {
  name: "TaskList",
  props: {
    temp1: {
      require: true,
      type: Object,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "",
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
      options: [
        {
          value: "Option1",
          label: "123",
        },
        {
          value: "Option2",
          label: "12312",
        },
      ],
      appList: [],
      value1: "",
      groupVisible: this.show, // 引入页面弹窗的状态值一定要设置
      createId: "",
      createName: "",
      rules: {},
      temp: {
        noticeType: "2",
      },
      // file:'',
      listQuery: {
        _page: 0,
        _page_size: 15,
      },
      fileList: [],
    };
  },
  computed: {
    dialogTitle: function () {
      if (this.title == "custom") {
        if (this.temp.noticeType == "1") {
          return "新增通知";
        } else if (this.temp.noticeType == "3") {
          return "新增新闻资讯";
        } else {
          return "新增公告";
        }
      } else {
        return this.title;
      }
    },
    formNoticeHeader: function () {
      return [
        { label: "标题", key: "noticeTitle" },
        {
          label: this.labelName,
          key: "noticeContent",
        },
        {
          label: "类别",
          key: "noticeType",
          disabled: this.title.indexOf("修改") >= 0,
        },
        { label: "备注", key: "remark" },
        {
          label: "app名称",
          key: "appId",
          hidden: this.temp.noticeType == "2" || this.temp.noticeType == "3",
          disabled: this.title.indexOf("修改") >= 0,
        },
        // { label: '开始时间', key: 'dateStart' },
        // { label: '结束时间', key: 'dateEnd' },
      ];
    },
    labelName: function () {
      if (this.temp.noticeType == "1") {
        return "通知内容";
      } else if (this.temp.noticeType == "2") {
        return "公告内容";
      } else {
        return "新闻资讯";
      }
    },
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue;
        // if (Object.keys(this.temp1).length > 0) {
        // }
        this.temp = JSON.parse(JSON.stringify(this.temp1));
        if (this.dialogStatus == "create") {
          this.temp = {
            noticeType: "2",
          };
        }
      },
      deep: true,
    },
  },
  created() {
    this.getSelect();
    // this.createId = localStorage.getItem('userId')
    // this.createName = localStorage.getItem('userName')
  },
  mounted() {},
  methods: {
    upload(file) {
      console.log(file);
      // this.fileList.push({
      //   name: file.file.name,
      //   raw: file.file,
      //   url: URL.createObjectURL(file.file)
      // })
      this.fileList.push(file.file);
    },
    closeGroupVisible() {
      this.$emit("update:show", false);
      if (this.dialogNoticeStatus === "create") {
        this.resetSelect();
        this.groupVisible = false;
      } else {
        this.groupVisible = false;
        this.resetSelect();
      }
      debugger;
      this.temp = {};
    },
    // 清空已选项数组，且置空所有选择
    resetSelect() {
      // this.selectRows = []
      this.temp = {};
    },
    // 取消新增
    cancelAdd() {
      if (this.dialogNoticeStatus === "create") {
        this.resetSelect();
        this.groupVisible = false;
      } else {
        this.groupVisible = false;
      }
    },
    // 新增提交
    createData() {
      this.$refs["dataform"].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp);
          data.noticeType =
            !data.noticeType || data.noticeType == "" ? "2" : data.noticeType;
          console.log(this.temp, "temp");
          console.log(data, "datata");
          data.status = 0;
          // data.createName = localStorage.getItem("userName");
          data.createBy = localStorage.getItem("createById");
          // const data = Object.assign({}, this.temp);
          data.createId = this.createId;
          data.createName = this.createName;
          this.groupVisible = false;
          api.insertNews(data).then((res) => {
            if (res.code == 200) {
              this.$parent.getNotice();
              console.log(res, "res");
              this.$message({
                message: "更新成功！",
                type: "success",
              });
            }
          });
        }
      });
    },
    // 编辑提交
    updateData() {
      this.$refs["dataform"].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp);
          console.log(data, "data");
          // let fileData = new FormData()
          // fileData.append("file", this.fileList[0])
          // fileData.append("imageName", data.imageName)
          // fileData.append("imageDesc", data.imageDesc)
          // fileData.append("id", data.id)
          // console.log(data, 'data')
          const params = {
            id: data.id,
            isAsc: data.isAsc,
            noticeContent: data.noticeContent,
            noticeId: data.noticeId,
            noticeTitle: data.noticeTitle,
            noticeType: data.noticeType,
            orderBy: data.orderBy,
            remark: data.remark,
            state: data.status == "待发布" ? 0 : data.status == "发布" ? 1 : 2,
            appId: data.appId,
          };
          this.groupVisible = false;
          api.updateNotice(params).then((res) => {
            if (res.code == 200) {
              this.$parent.getList();
              this.$message({
                message: "更改成功！",
                type: "success",
              });
            }
          });
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    async getSelect() {
      const res = await api.getSelectContent({
        userId: localStorage.getItem("createById"),
      });
      if (res.code == 200) {
        this.appList = res.data;
      }
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
