<template>
  <div class="app-container">
    <el-row style="height:40px;line-height:40px;" type="flex">
      <el-col class="edit" :span="16">
        <el-button @click="addDialog">新增</el-button>
        <el-button @click="handleUpdate">修改</el-button>
        <el-button @click="handleStop">删除</el-button>
        <el-button @click="getNotice">查询</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row style="height: calc(50% - 40px)">
      <el-card class="role-card">
        <el-table
          ref="multipleTable"
          v-loading="tableLoading"
          :data="tableList"
          height="calc(100% - 5vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          :highlight-current-row="highlight"
          style="width: 100%"
          :row-style="rowStyle"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
                  <!-- @select="onTableSelect" -->
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
                <el-button type="text" @click="openImage(scope.row)">
                  <span>查看</span>
                </el-button>
              </span>
              <span>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页查询-->
        <el-row style="width: 100%; display: flex; justify-content: flex-end;">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="serviceTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </el-row>

    <!-- <el-row>
      <el-form :model="form">
        <el-form-item label="公告标题">
          <el-input v-model="form.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="form.noticeContent"></el-input>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="form.region">
            <el-option label="公告" value="1"></el-option>
            <el-option label="通知" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>      
    </el-row> -->

    <!--弹框部分-->
    <RotationDialog
      :title="dialogTitle"
      :dialog-status="dialogStatus"
      v-model:show="dialogAdd"
      :temp1="temp"
      source="task"
    />

    <!--终止、下发、结单 弹框部分-->
    <el-dialog title="删除" v-model="dialogDel" class="confirmDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">{{ deleteTxt }}</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="stopData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
  <div class="app-container">
    <el-row style="height:40px;line-height:40px;" type="flex">
      <el-col class="edit" :span="16">
        <el-button @click="addNoticeDialog">新增</el-button>
        <el-button @click="noticeUpdate">修改</el-button>
        <el-button @click="deleteNo">删除</el-button>
        <el-button @click="getNotice">查询</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-row style="height: calc(50% - 40px)">
      <el-card class="role-card">
        <el-table
          ref="multipleTable"
          v-loading="noticeLoading"
          :data="noticeList"
          height="calc(100% - 5vh)"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }"
          :highlight-current-row="highlight"
          style="width: 100%"
          :row-style="rowStyle"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
                  <!-- @select="onTableSelect" -->
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
              <span>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页查询-->
        <el-row style="width: 100%; display: flex; justify-content: flex-end;">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="serviceTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </el-row>

    <!-- <el-row>
      <el-form :model="form">
        <el-form-item label="公告标题">
          <el-input v-model="form.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea" v-model="form.noticeContent"></el-input>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="form.region">
            <el-option label="公告" value="1"></el-option>
            <el-option label="通知" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>      
    </el-row> -->

    <!--弹框部分-->
    <NoticeDialog
      :title="dialogTitle"
      :dialogStatus="dialogNoticeStatus"
      v-model:show="dialogNotice"
      :temp1="temp"
      source="task"
    />

    <!--删除公告-->
    <el-dialog title="删除" v-model="dialogDel" class="confirmDialog" :close-on-click-modal="false">
      <el-row type="flex" justify="center">
        <div class="img-tip" />
      </el-row>
      <el-row type="flex" justify="center" style="margin:20px 0">
        <span class="message">{{ deleteTxt }}</span>
      </el-row>
      <div class="dialog-footer">
        <el-button @click="dialogDel = false">取 消</el-button>
        <el-button type="primary" @click="stopNotice">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as api from "@/api/appCarousel";
import RotationDialog from "./component/rotationDialog.vue";
import NoticeDialog from "./component/noticeDialog.vue";
export default {
  name: 'TaskDistribute',
  components: { 
    RotationDialog,
    NoticeDialog 
    },
  data() {
    return {
      tableLoading: true,
      noticeLoading:true,
      serviceTotal: 0,
      page: 1,
      pageSize: 10,
      form:{
        noticeTitle:'',
        noticeContent:'',
      },
      tableList: [
        // { sn: '002', name: '张三', isShow: '1', remark: '' },
        // { sn: '002', name: '张三', isShow: '1', remark: '' },
        // { sn: '002', name: '张三', isShow: '1', remark: '' },
        // { sn: '002', name: '张三', isShow: '1', remark: '' },
      ],
      noticeList:[],
      noticeHeader:[
        { label: '类别', key: 'noticeType' },
        { label: '顺序', key: 'sort' },
        { label: '名称', key: 'noticeTitle' },
        { label: '是否展示', key: 'status' },
        { label: '备注', key: 'remark' },
      ],
      tableHeader: [
        { label: '顺序', key: 'sort' },
        { label: '名称', key: 'imageName' },
        { label: '是否展示', key: 'state' },
        { label: '查看', key: 'operate' },
        { label: '创建时间', key: 'createTime' },
        { label: '创建人', key: 'createBy' },
      ],
      selectRows: [], // 批量操作时选中的所有行数组
      multipleSelection: [],
      statusOptions: [],
      temp: {},
      highlight: true,
      dialogTitle: '', // 弹框标题
      dialogStatus: '',
      dialogNoticeStatus:'',
      dateStart:'',
      dateEnd:'',
      updateBy:'',
      remark:'',
      dialogAdd: false,
      dialogNotice:false,
      dialogDel: false,
      deleteTxt: '',
      adjustVisible: false, // 侧拉弹窗
      height: document.documentElement.clientHeight
    }
  },
  created() {
    this.getList()
    this.getNotice()
  },
  mounted() {
  },
  methods: {
    changeVal(val) {
      if(val == '-1') {
        return val = '删除'
      }else if(val == '0'){
        return val = '待发布'
      }else{
        return val = '发布'
      }
    },
    changeNoticeVal(val) {
      if(val == '0') {
        return val = '待发布'
      }else if(val == '1'){
        return val = '发布'
      }else if(val == '2'){
        return val = '撤回'
      }else{
        return val = '删除'
      }
    },
    //查询公告
    getNotice(){
      const params = Object.assign({},this.form)
        params.dateStart = this.dateStart,
        params.dateEnd =  this.dateEnd,
        params.updateBy = this.updateBy,
        params.remark = this.remark,
      api.selectNews(params).then(res => {
        console.log(res, 'res');
        this.noticeList = res.data
        console.log('555555555555',this.noticeList)
        this.noticeList.forEach(ele => {
          ele.status = this.changeNoticeVal(ele.status)
        })
        // this.total = res.data.total
        this.noticeLoading = false
      })
    },

    // 查询表单
    getList() {
			let params = {
        // pageNum: this.page,
        // pageSize: this.pageSize
      }
      this.tableLoading = true
      api.selectData(params).then(res => {
        console.log(res, 'res');
        this.tableList = res.data.rows
        this.tableList.forEach(ele => {
          ele.state = this.changeVal(ele.state)
        })
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    //删除
    stopData(){
      let params = this.multipleSelection.map(item => item.id)
      console.log(params, 'params');
      api.deleteData(params).then(res => {
        console.log(res, 'deleteData');
        this.dialogDel = false
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    //删除公告
    stopNotice(){
      let params = this.multipleSelection.map(item => item.id)
      console.log(params, 'params');
      api.deleteNews(params).then(res => {
        console.log(res, 'deleteNews');
        this.dialogDel = false
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getNotice()
      })
    },
    // 分页查询
    handleCurrentChange(page) {
      this.page = page;
      console.log(page);
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val, 'handleSelectionChange');
      this.multipleSelection = val
    },
    recordFormat(index) {
      const page = this.page;
      const pagesize = this.pageSize;
      return (page - 1) * pagesize + index + 1;
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.getList();
    },

    // 清空已选项数组，且置空所有选择
    resetSelect() {
      this.selectRows = []
      this.temp = {}
      this.$refs.multipleTable.clearSelection()
    },
    // 选中某行
    rowClick(row) {
      this.highlight = true
      this.temp = Object.assign({}, row)
      console.log(this.temp,);
    },
    // 行选中
    // onTableSelect(rows, row) {
    //   this.selected = rows.length && rows.indexOf(row) !== -1
    //   var ele = document.getElementsByClassName('el-table__row')
    //   var domes = Array.prototype.slice.call(ele)
    //   var index = this.list.indexOf(row)
    //   // 如果是选中
    //   if (this.selected === true) {
    //     this.selectRows = rows
    //     setTimeout(() => {
    //       domes[index].classList.add('isactive')
    //     }, 100)
    //   } else {
    //     // 如果是取消
    //     this.selectRows = rows
    //     setTimeout(() => {
    //       domes[index].classList.remove('isactive')
    //     }, 100)
    //   }
    // },
    //新增通告
    addNoticeDialog() {
      this.highlight = false
      // this.temp = {}
      this.resetSelect()
      this.dialogTitle = '新增公告'
      this.dialogNoticeStatus = 'create'
      this.dialogNotice = true
      console.log(this.dialogNotice,);
    },
    // 新增角色
    addDialog() {
      this.highlight = false
      // this.temp = {}
      this.resetSelect()
      this.dialogTitle = '新增角色'
      this.dialogStatus = 'create'
      this.dialogAdd = true
      console.log(this.dialogAdd,);
    },
    // 编辑
    handleUpdate() {
      if (Object.keys(this.multipleSelection).length > 0) {
        this.dialogTitle = '修改角色'
        this.dialogStatus = 'update'
        this.dialogAdd = true

      } else {
        this.$message({
          message: '请选择要修改的角色！',
          type: 'warning'
        })
      }
    },
    //编辑公告
    noticeUpdate() {
      if (Object.keys(this.multipleSelection).length > 0) {
        this.dialogTitle = '修改公告'
        this.dialogNoticeStatus = 'update'
        this.dialogNotice = true

      } else {
        this.$message({
          message: '请选择要修改的公告！',
          type: 'warning'
        })
      }
    },
    // 删除角色
    handleStop() {
      // if (this.selectRows.length === 0) {
      //   this.$message({
      //     message: '请勾选要删除的数据！',
      //     type: 'warning'
      //   })
      // } else if (this.selectRows.length === 1) {
      //   this.deleteTxt = '是否删除该数据？'
      //   this.dialogDel = true
      // } else if (this.selectRows.length > 1) {
      //   // 勾选多条数据
      //   this.deleteTxt = '是否删除多条数据？'
      //   this.dialogDel = true
      // }
      if (Object.keys(this.multipleSelection).length > 0) {
        this.deleteTxt = '是否删除用户'
        this.dialogDel = true
      } else {
        this.$message({
          message: '请勾选要删除的用户！',
          type: 'warning'
        })
      }
    },
    //删除公告
    deleteNo() {
      if (Object.keys(this.multipleSelection).length > 0) {
        this.deleteTxt = '是否删除公告'
        this.dialogDel = true
      } else {
        this.$message({
          message: '请勾选要删除的公告！',
          type: 'warning'
        })
      }
    },

  }
}
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
  height: 70%;
}
.app-bottom{
  height: 30%;
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

