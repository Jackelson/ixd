<template>
  <!--弹框部分-->
  <el-dialog :title="title" v-model="groupVisible" class="editDialog" :close-on-click-modal="false"
    @close="closeGroupVisible">
    <el-form ref="dataform" label-width="120px" label-position="right" :rules="rules" :model="temp" class="editForm">
      <div v-for="(item, index) in formHeader" :key="index">
        <el-form-item :label="item.label" :prop="item.key">
          <el-upload v-if="item.key === 'file' && dialogStatus == 'create'" class="upload-demo" action="#" :on-preview="handlePreview"
            :on-remove="handleRemove" :file-list="fileList" :http-request="upload" list-type="picture" limit="1"
            accept=".jpg,.png,.jpeg,.gif">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <img :src="'data:image/png;base64,'+this.temp.base64Image" v-else-if="item.key === 'file' && dialogStatus == 'update' "/>
          <el-select v-else-if="item.key == 'state'" v-model="temp[item.key]">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-else-if='item.key == "imageDesc"' type='textarea' v-model="temp[item.key]" style="width:90%" />
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
import * as api from "@/api/appCarousel";
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
        { label: '图片名称', key: 'imageName' },
        { label: '图片介绍', key: 'imageDesc' },
        // { label: '状态', key: 'state' },
        { label: '排序', key: "sort" },
        // { label: '描述', key: 'imageDesc' },
        // { label: '排序', key: 'sort' },
        // { label: '状态', key: 'state' },
        // { label: '创建id', key: 'createId' },
        // { label: 'createName', key: 'createName' },
        { label: '文件', key: 'file' },
      ],
      stateList: [
        { label: '未发布', value: 0 },
        { label: '已发布', value: 1 },
      ],
      rules: {
      },
      temp: {},
      // file:'',
      createId: '',
      createName: '',
      listQuery: {
        _page: 0,
        _page_size: 15
      },
      dialogTitle: '', // 弹框标题
      fileList: []
    }
  },
  watch: {
    show: {
      handler(newValue) {
        this.groupVisible = newValue
        if (Object.keys(this.temp1).length > 0) {
          this.temp = this.temp1
        }
        if (this.dialogStatus == 'create') {
          this.temp = {}
          this.fileList = []
        }else{
          const img =  this.base64ToFile(this.temp.base64Image, 'picture.png', 'image/png')
          this.fileList.push(img)
        }
        console.log(this.temp)
      },
      deep: true
    }
  },
  created() {
    this.createId = localStorage.getItem('userId')
    this.createName = localStorage.getItem('userName')
  },
  mounted() { },
  methods: {
    base64ToFile(base64, filename, contentType) {
      // let arr = base64.split(',')  //去掉base64格式图片的头部
      let bstr = atob(base64)   //atob()方法将数据解码
      let leng = bstr.length
      let u8arr = new Uint8Array(leng)
      while (leng--) {
        u8arr[leng] = bstr.charCodeAt(leng) //返回指定位置的字符的 Unicode 编码
      }
      return new File([u8arr], filename, { type: contentType })
    },
    upload(file) {
      console.log(file,'ffff')
      const fileType = file.file.name.substring((file.file.name.indexOf(".") + 1))
      if (fileType == 'png' || fileType == 'jpg' || fileType == 'jpeg' || fileType == 'gif') {
        this.fileList.push(file.file)
        console.log(this.fileList,'uuuuuuuu')
      } else {
        this.$message({
          message: '只能上传图片!',
          type: 'warning'
        })
      }
      // this.fileList.push({
      //   name: file.file.name,
      //   raw: file.file,
      //   url: URL.createObjectURL(file.file)
      // })
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
          const data = Object.assign({}, this.temp);
          let fileData = new FormData()
          // fileData.append("file",this.fileList[0])
          // console.log("444444444",fileData)
          //  debugger
          // this.fileList.forEach((item)=>{
          //   let blob = URL.createObjectURL(item.raw);
          //   let file = new File([blob], item.name)
          //   fileData.append('file', file)
          // })
          console.log(this.$store.state, 'statata')
          fileData.append("file", this.fileList[0])
          fileData.append("imageName", data.imageName)
          fileData.append("imageDesc", data.imageDesc)
          fileData.append("state", 0)
          fileData.append("createName", localStorage.getItem("userName"))
          fileData.append("createId", localStorage.getItem("createById"))
          fileData.append("sort", data.sort)
          // fileData.append("file",this.fileList[0])
          // fileData.append("imageName",data.imageName)
          // fileData.append("imageDesc",data.imageDesc)
          // fileData.append("state",data.state)
          // fileData.append("createName",this.createName)
          // fileData.append("createId",this.createId)
          // data.file = fileData;
          this.groupVisible = false
          api.insertData(fileData).then(res => {
            if (res.code == 200) {
              this.$parent.getList()
              console.log(res, 'res');
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 编辑提交
    updateData() {
      this.$refs['dataform'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          let fileData = new FormData()
          fileData.append("file", this.fileList[0])
          fileData.append("imageName", data.imageName)
          fileData.append("imageDesc", data.imageDesc)
          fileData.append("id", data.id)
          fileData.append("createBy", data.createBy)
          fileData.append("createId", data.createId)
          fileData.append("createName", data.createName)
          fileData.append("createTime", data.createTime)
          fileData.append("sort", data.sort)
          fileData.append("remark", data.remark)
          console.log(data, 'data')
          this.groupVisible = false
          api.updateData(fileData).then(res => {
            console.log("222222")
            this.$parent.getList()
            console.log(res, 'res');
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file, 'ff');
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
