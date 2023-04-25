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
          <el-upload
            v-if="item.key === 'image'"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
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
        { label: '轮播图顺序', key: 'sn' },
        { label: '名称', key: 'name' },
        { label: '图片', key: 'image' },
      ],
      rules: {
      },
      temp: {},
      listQuery: {
        _page: 0,
        _page_size: 15
      },
      dialogTitle: '', // 弹框标题
			fileList: [{
				name: 'food.jpeg', 
				url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
			]
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
          console.log(data);
        }
      })
    },
    // 编辑提交
    updateData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          console.log(data, 'data')
        }
      })
    },
		handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
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
