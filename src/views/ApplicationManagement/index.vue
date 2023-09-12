<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-08 10:25:38
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-11 09:43:54
-->
<template>
  <div class="applicationStyle">
    <el-row style="width: 99%; margin-left: 0.5%; height: calc(100% - 0vh)" class="switch-search">
      <el-card class="app-card">
        <el-row class="formRow">
          <el-col :span="24" class="formSty">
            <span>应用名称：</span>
            <el-input v-model="filterData.appName" style="width:200px"></el-input>
            <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">应用状态：</span>
            <!-- <el-input v-model="filterData.appCheckStatus" style="width:200px"></el-input> -->
            <el-select v-model="filterData.appCheckStatus" style="width:200px" clearable>
              <el-option label="删除" value="-1"></el-option>
              <el-option label="未提交" value="0"></el-option>
              <el-option label="提交审批" value="1"></el-option>
              <el-option label="上架" value="2"></el-option>
              <el-option label="审批驳回" value="3"></el-option>
              <el-option label="流程删除" value="4"></el-option>
              <el-option label="下架" value="5"></el-option>
              <el-option label="已撤销" value="6"></el-option>
              <el-option label="申请下架" value="7"></el-option>
              <el-option label="申请上架" value="8"></el-option>
            </el-select>
            <span style="font-size: calc(100vw / 1920 * 14);margin-left: 10px;">业务域：</span>

            <el-select v-model="filterData.businessType" filterable clearable placeholder="--请选择--" @change="enterSelect"
              style="width:22vh;">
              <el-option v-for="(item, index) in businessTypeList" :key="index" :label="item.optionName"
                :value="item.id"></el-option>
            </el-select>
            <el-button style="margin-left: 10px;" @click="searchList">查询</el-button>
          </el-col>
        </el-row>
        <div class="application-btn">
          <el-button type="primary" @click="handleAdd">应用注册</el-button>
          <el-button type="primary" @click="handleSubmit" :disabled="isSubmit">应用提交</el-button>
          <el-button type="primary" @click="handleRevoke" :disabled="isRevoke">撤销</el-button>
          <el-button type="primary" @click="handleGrounding" :disabled="isGrounding">应用上架</el-button>
          <el-button type="primary" @click="handleOff" :disabled="isOff">应用下架</el-button>
          <el-button type="primary" @click="handleDeleteApp" :disabled="multipleSelection.length == 0">删除应用</el-button>
          <el-button type="primary" @click="handleUpdateSave" :disabled="isOff">上传安全测试报告</el-button>
          <el-button type="primary" @click="handleDownSave" :disabled="isOff">下载安全测试报告</el-button>
          <el-button type="primary" @click="handleUpdateZip" :disabled="isOff">上传压缩包</el-button>
          <el-button type="primary" @click="handleDownZip" :disabled="isOff">下载压缩包</el-button>
          <el-button @click="handleDeleteFile" :disabled="multipleSelection.length == 0" type="primary">删除文件</el-button>

        </div>
        <el-table :data="tableList" v-loading="tableLoading"
          :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }" :row-class-name="tableRowClassName"
          style="width: 100%" size="mini" ref="table" class="appTableSty" @selection-change="handleSelectionChange"
          @select="handlerSelect" @row-click="rowClickHandle">
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" align="center" type="index" :index="recordFormat" width="80px" min-width="80px" />
          <el-table-column v-for="item in tableHeader" :key="item.key" :prop="item.key" :label="item.label"
            show-overflow-tooltip align="center" :min-width="item.minWidth" :width="item.width">
            <template v-slot="scope">
              <span v-if="item.key === 'operate'">
                <el-button type="text" @click="openShareDialog(scope.row)">
                  <el-icon>
                    <Share />
                  </el-icon>
                  <span>测试链接</span>
                </el-button>
                <el-button @click="getUserConfiguration(scope.row)" type="text">
                  <el-icon>
                    <Tools />
                  </el-icon>
                  <span>用户配置</span>
                </el-button>
              </span>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="width: 100%; display: flex; justify-content: flex-end;line-height: 44px">
          <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </el-row>
      </el-card>
    </el-row>

    <el-dialog title="应用节点信息" class="aboutDialog" v-model="dialogTableVisible" width="20%" height="50px"
      @close="closeDialog2">
      <ApplicationDialog ref="hostDetailPage" :tableData="tableData" />
    </el-dialog>

    <!--弹框部分-->
    <Configuration title="用户配置" v-model:show="dialogAdd" :temp1="temp" :menuList="menuList" :source="chooseNum" />

    <el-dialog :title="title" class="aboutDialog" v-model="addDialog" width="50%" @close="addDialog = false">
      <applicationAddDialong @handleCancel="handleCancel" @reFresh="reFresh" v-if="addDialog" />
    </el-dialog>
    <el-dialog title="上传安全测试报告" v-model="dialogUploadSave" width="30%">
      <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-change="handleAvatarSuccess"
        :on-remove="handleRemove" :on-exceed="handleExceed" accept=".pdf" :auto-upload="false" :show-file-list="false">
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            只能上传pdf格式
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog title="上传zip压缩包" v-model="dialogUploadZip" width="30%">
      <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-change="handleAvatarSuccessZip"
        :on-remove="handleRemove" :on-exceed="handleExceed" accept=".zip" :auto-upload="false" :show-file-list="false">
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            只能上传zip格式
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <el-dialog title="删除文件" v-model="dialogDelete" width="30%">
      <el-button :disabled="!multipleSelection[0].securityTestingFileId"
        @click="handleDelete('securityTestingFileId')">删除安全测试报告</el-button>
      <el-button :disabled="!multipleSelection[0].frontFileId" @click="handleDelete('frontFileId')">删除压缩包</el-button>
    </el-dialog>
  </div>
</template>

<script>
import * as roleApi from "@/api/role"
import * as userApi from "@/api/user"
import * as api from "@/api/dashBoard"
import { Share, Tools } from '@element-plus/icons-vue'
import ApplicationDialog from "./component/applicationDialog.vue";
import Configuration from "./component/configuration.vue";
import { ElMessageBox, ElMessage } from 'element-plus'
import applicationAddDialong from "./component/applicationAddDialong.vue";
import { startProcessInstance, updateState, revokeSubmit, uploadFile, updateApp, updateFile, downloadFile, deleteFile } from "@/api/application"
import moment from "moment"
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Application',
  components: {
    Share,
    Tools,
    ApplicationDialog,
    Configuration,
    applicationAddDialong
  },
  data() {
    return {
      title: "",
      tableLoading: true,
      dialogTableVisible: false,
      dialogUploadSave: false,
      dialogUploadZip: false,
      tableData: {},
      tableList: [
        // { appId: '11', status: '已上架', address: '无', leader: 'user4', phone: '', operate: '测试链接 用户配置' },
        // { appId: '12', status: '已上架', address: '无', leader: 'user2', phone: '', operate: '测试链接 用户配置' },
        // { appId: '13', status: '已上架', address: '无', leader: 'user1', phone: '', operate: '测试链接 用户配置' },
      ],
      total: 0,
      page: 1,
      pageSize: 10,
      tableHeader: [
        { label: '操作', key: 'operate', width: '200px' },
        { label: '应用ID', key: 'id' },
        { label: '名称', key: 'appName' },
        { label: '描述', key: 'appDescribe' },
        { label: '应用状态', key: 'state' },
        { label: '首页地址', key: 'appIndexUrl' },
        { label: '业务域', key: 'businessName' },
        { label: '所属部门', key: 'department' },
        { label: '应用检测状态', key: 'appCheckStatus' },
        { label: '是否离线', key: 'offLineApp' },
        { label: '应用管理员', key: 'contactPerson' },
        { label: '所属公司', key: 'appAffiliatedCompany' },
        { label: '负责人姓名', key: 'contactPerson' },
        { label: '联系方式', key: 'contactPersonTel' },
        { label: '电子邮箱', key: 'contactEmail' },
      ],
      filterData: {
        appName: "",
        appCheckStatus: "",
        businessType: "",
      },
      dialogAdd: false,
      temp: {},
      menuList: [],
      chooseNum: [],
      businessTypeList: [],
      businessType: '',
      addDialog: false,
      multipleSelection: [],
      isSubmit: true,
      isRevoke: true,
      isGrounding: true,
      isOff: true,
      isEdit: true,
      fileListPdf: [
      ],
      dialogDelete: false,
    }
  },
  watch: {

  },
  created() {
    this.requestData()
    this.SysSelectDictionary()
    // 获取菜单tree
    // this.selectMenuTree()
  },
  mounted() {
    // this.connectWebsocket();
  },
  methods: {
    handleDeleteApp() {
      console.log('mm',this.multipleSelection[0])
      if (this.multipleSelection[0].state == '上架') {
        return this.$message({
          type: 'warning',
          message: "app已上架,请先下架"
        })
      }
      let list = [
        {
          id: this.multipleSelection[0].id,
          state: -1,
        },
      ];
      updateState(list).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: "删除成功"
          })
          this.requestData()
        }
      });
    },
    connectWebsocket() {
      let websocket;
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        // let protocol = "ws";
        let url = "";
        // if (window.localtion.protocol == "https:") {
        //   protocol = "wss";
        // }
        // `${protocol}://window.location.host/echo`;
        url = `ws://localhost:9000/example1/ws`;

        // 打开一个websocket
        websocket = new WebSocket(url);
        // 建立连接
        websocket.onopen = () => {
          // 发送数据
          websocket.send("发送数据");
          console.log("websocket发送数据中");
        };
        // 客户端接收服务端返回的数据
        websocket.onmessage = evt => {
          console.log("websocket返回的数据：", evt.data);
        };
        // 发生错误时
        websocket.onerror = evt => {
          console.log("websocket错误：", evt);
        };
        // 关闭连接
        websocket.onclose = evt => {
          console.log("websocket关闭：", evt);
        };
      }
    },
    handleDelete(type) {
      const params = [
        this.multipleSelection[0][type]
      ]
      deleteFile(params).then((res) => {
        if (res.code == 200) {

          let params = {
            id: this.multipleSelection[0].id
          }
          params[type] = ''
          updateApp(params).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: '删除成功'
              })
            }
          })
          this.multipleSelection[0][type] = ''
        }
      })
    },
    handleDeleteFile() {
      if (this.multipleSelection.length == 0) {
        return this.$message({
          type: 'warning',
          message: "请选择app"
        })
      }
      this.dialogDelete = true;
    },
    handleDownSave() {
      if (!this.multipleSelection[0].securityTestingFileId || this.multipleSelection[0].securityTestingFileId == '') {
        this.$message({
          type: 'warning',
          message: '当前app没有上传安全测试报告'
        })
        return
      }
      const params = {
        fileId: this.multipleSelection[0].securityTestingFileId
      }
      downloadFile(params).then((res) => {
        const fileName = "安全测试报告. pdf";
        const blob = new Blob([res]);
        let dom = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        dom.href = url;
        dom.download = decodeURI(fileName);
        dom.style.display = "none";
        document.body.appendChild(dom);
        dom.click();
        dom.parentNode.removeChild(dom);
        window.URL.revokeObjectURL(url);
      })
    },
    handleDownZip() {
      if (!this.multipleSelection[0].frontFileId || this.multipleSelection[0].frontFileId == '') {
        this.$message({
          type: 'warning',
          message: '当前app没有上传压缩包'
        })
        return
      }
      const params = {
        fileId: this.multipleSelection[0].frontFileId
      }
      downloadFile(params).then((res) => {
        const fileName = this.multipleSelection[0].appIndexUrl.substring(0, this.multipleSelection[0].appIndexUrl.indexOf('/')) + ".zip";
        console.log(this.multipleSelection[0].appIndexUrl.substring(0, this.multipleSelection[0].appIndexUrl.indexOf('/')), '123123')
        const blob = new Blob([res]);
        let dom = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        dom.href = url;
        dom.download = decodeURI(fileName);
        dom.style.display = "none";
        document.body.appendChild(dom);
        dom.click();
        dom.parentNode.removeChild(dom);
        window.URL.revokeObjectURL(url);
      })
    },
    handleAvatarSuccessZip(file) {
      console.log('file', file)
      let fileType = file.name.substring(file.name.indexOf('.') + 1)
      let fileName = file.name.substring(0, file.name.indexOf('.'))
      let appUrl = this.multipleSelection[0].appIndexUrl.substring(0, this.multipleSelection[0].appIndexUrl.indexOf('/'))
      console.log(appUrl, 'appurl')
      if (fileType != 'zip') {
        return this.$message.warning('请上传zip文件')
      }
      if (appUrl != fileName) {
        return this.$message.warning('请根据首页地址更改压缩包名称')
      }
      let formData = new FormData()
      formData.set('userId', localStorage.getItem('createById'))
      formData.set('appId', this.multipleSelection[0].id)
      formData.set('uploadFile', file.raw)
      if (this.multipleSelection[0].frontFileId && this.multipleSelection[0].frontFileId != '') {
        formData.set("id", this.multipleSelection[0].id)
        updateFile(formData).then((res) => {
          if (res.code == 200) {
            const params = {
              frontFileId: this.multipleSelection[0].frontFileId,
              id: this.multipleSelection[0].id
            }
            updateApp(params).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: "上传成功"
                })
                this.dialogUploadZip = false
              }
            })
          }
        })
        return
      }
      uploadFile(formData).then((res) => {
        if (res.code == 200) {
          // this.fileId = res.data
          const params = {
            frontFileId: res.data,
            id: this.multipleSelection[0].id
          }
          updateApp(params).then((res) => {
            console.log(res, 'rs')
            this.$message({
              type: 'success',
              message: "上传成功"
            })
            this.dialogUploadZip = false
            this.requestData()
          })
        }
      })
    },
    handleAvatarSuccess(file) {
      console.log('file', file)
      let fileType = file.name.substring(file.name.indexOf('.') + 1)
      if (fileType != 'pdf') {
        return this.$message.warning('请上传pdf格式文件')
      }
      let formData = new FormData()
      formData.set('userId', localStorage.getItem('createById'))
      formData.set('appId', this.multipleSelection[0].id)
      formData.set('uploadFile', file.raw)
      if (this.multipleSelection[0].securityTestingFileId && this.multipleSelection[0].securityTestingFileId != '') {
        formData.set("id", this.multipleSelection[0].id)
        updateFile(formData).then((res) => {
          if (res.code == 200) {
            const params = {
              securityTestingFileId: this.multipleSelection[0].securityTestingFileId,
              id: this.multipleSelection[0].id
            }
            updateApp(params).then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: "上传成功"
                })
                this.dialogUploadSave = false
              }
            })
          }
        })
        return
      }
      uploadFile(formData).then((res) => {
        if (res.code == 200) {
          // this.fileId = res.data
          const params = {
            securityTestingFileId: res.data,
            id: this.multipleSelection[0].id
          }
          updateApp(params).then((res) => {
            console.log(res, 'rs')
            this.$message({
              type: 'success',
              message: "上传成功"
            })
            this.dialogUploadSave = false
            this.requestData()
          })
        }
      })
    },
    handleRemove(file, uploadFiles) {
      console.log(file, uploadFiles)
    },

    handlePreview(uploadFile) {
      console.log(uploadFile)
    },

    handleExceed(files, uploadFiles) {
      ElMessage.warning(
        `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
        } totally`
      )
    },

    beforeRemove(uploadFile, uploadFiles) {
      return ElMessageBox.confirm(
        `Cancel the transfer of ${uploadFile.name, uploadFiles} ?`
      ).then(
        () => true,
        () => false
      )
    },
    handleUpdateSave() {
      this.dialogUploadSave = true;
    },
    handleUpdateZip() {
      this.dialogUploadZip = true;
    },
    checkBtn() {
      this.isSubmit = this.multipleSelection.filter(item => {
        return item.state == '未提交'
      }).length > 0 ? false : true;
      this.isRevoke = this.multipleSelection.filter(item => {
        return item.state == '提交审批' || item.state == '申请下架'
      }).length > 0 ? false : true;
      this.isGrounding = this.multipleSelection.filter(item => {
        return item.state == '下架'
      }).length > 0 ? false : true;
      this.isOff = this.multipleSelection.filter(item => {
        return item.state == '上架'
      }).length > 0 ? false : true;
      this.isEdit = this.multipleSelection.filter(item => {
        return item.state == '审批驳回'
      }).length > 0 ? false : true;
    },
    handleRevoke() {
      let params = {
        businessId: this.multipleSelection[0].id,
      };
      let list = [
        {
          id: this.multipleSelection[0].id,
          state: 6,
        },
      ];
      revokeSubmit(params).then((res) => {
        if (res.code == 200) {
          updateState(list).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: "撤销成功"
              })
              this.requestData()
            }
          });
        }
      });
    },
    handleGrounding() {
      let data = {
        processName: "App_Registration_approval",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        senderId: localStorage.getItem("createById"),
        senderName: localStorage.getItem("userName"),
        map: {
          id: this.multipleSelection[0].id,
        },
      };
      startProcessInstance(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: "正在上架中..."
          })
          let params = this.multipleSelection.map((item) => {
            let obj = {
              id: item.id,
              state: 1,
            };
            return obj;
          });
          updateState(params).then((res) => {
            if (res.code == 200) {
              this.requestData()
            }
          });
        }
      });
    },
    handleOff() {
      let data = {
        processName: "Off_Shelf_approval",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        senderId: localStorage.getItem("createById"),
        senderName: localStorage.getItem("userName"),
        map: {
          id: this.multipleSelection[0].id,
        },
      };
      startProcessInstance(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: "正在下架中..."
          })
          let params = this.multipleSelection.map((item) => {
            let obj = {
              id: item.id,
              state: 7,
            };
            return obj;
          });
          updateState(params).then((res) => {
            if (res.code == 200) {
              this.requestData();
            }
          });
        }
      });
    },
    handleEdit() {
      this.title = '应用修改'
      this.addDialog = true;
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handlerSelect(selection, row) {

      // 清除 所有勾选项
      this.$refs.table.clearSelection()
      if (selection.length == 0) return
      this.$refs.table.toggleRowSelection(row, true)
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection = this.multipleSelection.length > 1 ? [this.multipleSelection[1]] : this.multipleSelection

      this.checkBtn()
    },
    rowClickHandle(row) {
      const selectData = this.multipleSelection;
      this.$refs.table.clearSelection();
      if (selectData.length == 1) {
        const [item] = selectData;
        const shouldSelect = item !== row;
        this.$refs.table.toggleRowSelection(row, shouldSelect);
      } else {
        this.$refs.table.toggleRowSelection(row, true);
      }
    },
    handleSubmit() {
      if (this.multipleSelection.length > 1) {
        return this.$message({
          type: 'warning',
          message: "只能选择一个app"
        })
      }
      let proceData = {
        processName: "App_Registration_approval",
        createTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        senderId: localStorage.getItem("createById"),
        senderName: localStorage.getItem("userName"),
        map: {
          id: this.multipleSelection[0].id,
        },
      };
      let list = [
        {
          id: this.multipleSelection[0].id,
          state: 1,
        },
      ];
      updateState(list).then(res => {
        if (res.code == 200) {
          startProcessInstance(proceData).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: "提交成功"
              })
              this.requestData()
            }
          })
        }
      })



    },
    reFresh() {
      this.requestData()
    },
    SysSelectDictionary() {
      let param = {
        selectFlag: "business_type"
      }
      api.SysSelectDictionary(param).then(res => {
        this.businessTypeList = res.data
        console.log(res);
      })
    },
    enterSelect() {

    },
    selectAppUsers(val) {
      let param = {
        appId: val
      }
      userApi.selectAppUsers(param).then(res => {
        // this.menuList = res.data
        // for (let n = 0; n < this.menuList.length; n++) {
        //   this.menuList[n].nickName = this.menuList[n].roleName
        // }
        const groupsData = res.data
        for (let n = 0; n < groupsData.length; n++) {
          groupsData[n].label = groupsData[n].roleName
        }
        this.menuList = this.dg(groupsData)
        console.log(this.menuList, this.chooseNum, '5555555555555');
      })
    },
    // 根据树结构节点id从树结构数据中获取节点数据
    dg(data) {
      let arr = []
      if (data) {
        data.forEach((item, index1) => {
          item.label = item.roleName
          if (item.userNames) {
            item.userNames.forEach((ele, index) => {
              ele.label = ele.nickName
              ele.id = ele.nickName + index1 + index
              if (ele.isBelong === 1) {
                this.chooseNum.push(ele.id)
              }
            })
          }
          arr.push(item)
        });
        return arr
      } else {
        return null
      }

    },
    selectMenuTree() {
      let param = { "params": { "userId": "1" } }
      roleApi.selectMenuTree(param).then(res => {
        console.log(res, 'res');
        this.menuList = res.data
      })
    },
    // 用户配置
    getUserConfiguration(val) {
      console.log(val, 'valll')
      this.temp = val
      this.selectAppUsers(val.id)
      // this.selectAppUsers('APPREGISTERN1a9fe648b8be422d86fc4bcf6efd0b7f')
      this.dialogAdd = true

    },
    // (-1删除，0 未提交，1 提交审批，2.上架状态(也就是审批通过)，3审批驳回 4 流程删除 5下架状态 6 已撤销 7 申请下架状态 8 申请上架状态
    getState(val) {
      if (val === '-1') return val = '删除'
      if (val === '0') return val = '未提交'
      if (val === '1') return val = '提交审批'
      if (val === '2') return val = '上架'
      if (val === '3') return val = '审批驳回'
      if (val === '4') return val = '流程删除'
      if (val === '5') return val = '下架'
      if (val === '6') return val = '已撤销'
      if (val === '7') return val = '申请下架'
      if (val === '8') return val = '申请上架'
    },
    getState2(val) {
      if (val === '删除') return val = '-1'
      if (val === '未提交') return val = '0'
      if (val === '提交审批') return val = '1'
      if (val === '上架') return val = '2'
      if (val === '审批驳回') return val = '3'
      if (val === '流程删除') return val = '4'
      if (val === '下架') return val = '5'
      if (val === '已撤销') return val = '6'
      if (val === '申请下架') return val = '7'
      if (val === '申请上架') return val = '8'
    },
    getoffLineApp(val) {
      if (val === 0) return val = '离线应用'
      if (val === 1) return val = '在线应用'
    },
    getappCheckStatus(val) {
      if (val === 0) return val = '未检测'
      if (val === 1) return val = '已检测'
    },
    searchList() {
      let param = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      !this.filterData.appName ? null : param.appName = this.filterData.appName
      // !this.filterData.appCheckStatus ? null : param.state = this.getState2(this.filterData.appCheckStatus)
      console.log(this.filterData, 'filterData')
      param.state = this.filterData.appCheckStatus
      !this.filterData.businessType ? null : param.businessType = this.filterData.businessType

      this.tableLoading = true
      api.getAppInfo(param).then(res => {
        this.tableList = Object.assign([], res.data.rows)
        this.tableList.forEach(ele => {
          ele.state = this.getState(ele.state)
          ele.offLineApp = this.getoffLineApp(ele.offLineApp)
          ele.appCheckStatus = this.getappCheckStatus(ele.appCheckStatus)
        })
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    requestData() {
      let params = {
        // "appName": "测试11",
        // "appDescribe": "1111",
        // "appSecretKey": "123123",
        // "appAffiliatedCompany": "1231231",
        // "contactPerson": "123123",
        // "contactPersonTel": "13951631328",
        // "contactEmail": "123@qq.com",
        // "dateStart": "2023-02-16 02:17:44",
        // "dateEnd": "2023-02-16 02:17:44"
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      api.getAppInfo(params).then(res => {
        this.tableList = Object.assign([], res.data.rows)
        this.tableList.forEach(ele => {
          ele.state = this.getState(ele.state)
          ele.offLineApp = this.getoffLineApp(ele.offLineApp)
          ele.appCheckStatus = this.getappCheckStatus(ele.appCheckStatus)
        })
        this.total = res.data.total
        this.tableLoading = false
      })
    },
    filterChange(val) {
      console.log(val);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.requestData();
    },
    handleSizeChange(pageSize) {
      this.page = 1;
      this.pageSize = pageSize;
      this.requestData();
    },
    openShareDialog() {
      // console.log(val, 'ssss');
      // this.tableData = val
      // this.dialogTableVisible = true
      ElMessageBox.alert('应用访问正常', '测试连接', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
        callback: () => {

        },
      })
    },
    closeDialog2() {
      // this.$refs.hostDetailPage.reloadDate()
      this.dialogTableVisible = false
    },
    handleAdd() {
      this.addDialog = true
      this.title = '应用注册'
    },
    handleCancel() {
      this.addDialog = false;
    }
  }
}
</script>
<style lang="scss">
.appTableSty {
  .el-table__inner-wrapper {
    height: 100% !important;
  }
}

.app-card {
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

/*关于 弹窗*/

.aboutDialog {
  .el-dialog__body {
    padding: 10px 20px;
    min-height: 120px;
  }

  .el-dialog {
    width: 470px;
    border-radius: 32px;

    .el-dialog__header {
      display: flex;
      align-items: center;
      height: 24px;
      background-color: #008b8bd9;
      border-radius: 32px 32px 0 0;
      padding: 20px;
    }

    .el-dialog__title {
      // 标题
      color: #fff;
      font-size: 20px;
      font-weight: 700;
    }

    .el-dialog__headerbtn {
      top: auto;
    }

    .el-dialog__headerbtn .el-dialog__close {
      // 右侧关闭按钮
      color: #fff !important;
      font-size: 20px;
      font-weight: 700;
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
      background: #008b8bd9;

      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        color: #fff;
      }
    }
  }
}

.aboutForm {
  .el-form-item__label {
    font-weight: 700;
    font-size: 16px;
  }

  .el-form-item__content {
    font-size: 16px;
  }
}
</style>

<style lang='scss' scoped>
.applicationStyle {
  width: 100%;
  height: 100%;
  background-color: #f0f8f8;
}

// 表单及表格部分
.switch-search {
  width: 100%;
  background-color: #f9fafa;
  box-shadow: 0px 0px 10px 0px rgba(105, 179, 175, 0.2);
  border-radius: 6px;
  border: solid 1px #c9e0df;
  box-sizing: border-box;

  // 表单
  .formRow {
    height: 5.5vh;
    width: 98%;
    margin-left: 1%;
    display: flex;
    align-items: center;

    .formSty {
      display: flex;
      align-items: center;
      padding: 0 !important;

      span:nth-child(1) {
        font-size: calc(100vw / 1920 * 14);
      }
    }
  }
}

.application-btn {
  margin: 20px;
}
</style>