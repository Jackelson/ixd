<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-07-28 14:39:53
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-01 16:09:14
-->
<template>
  <div>
    <el-table
      :data="props.tableList"
      style="width: 100%"
      :header-cell-style="{
        background: '#11ac9b !important',
        color: '#ffffff',
      }"
    >
      <el-table-column prop="taskName" label="审批类型" />
      <el-table-column prop="createTime" label="发起时间" />
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button @click="handleClick(scope.row)">审批</el-button>
        </template>
      </el-table-column>
      <el-table-column label="流程图">
        <template v-slot="scope">
          <el-button @click="viewFlow(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; display: flex; justify-content: center"
      background
      layout="prev, pager, next"
      :total="props.tableList.length"
      @current-change="handleCurrentChange"
      :current-change="pageNum"
    />

    <el-dialog v-model="dialogTable" title="审批" width="50%">
      <div class="approved">
        <el-form v-if="!isDefect" :disabled="true" label-width="150px">
          <el-form-item label="发起人">
            <el-input v-model="formData.createName" />
          </el-form-item>
          <el-form-item label="应用名称">
            <el-input v-model="formData.appName" />
          </el-form-item>
          <el-form-item label="应用描述">
            <el-input v-model="formData.appDescribe" />
          </el-form-item>
          <el-form-item label="应用图标">
            <img
              style="width: 50px; height: 50px"
              :src="`data:image/png;base64,${base64Image}`"
              alt="加载中"
            />
          </el-form-item>
          <el-form-item label="应用url">
            <el-input v-model="formData.appIndexUrl" />
          </el-form-item>
          <el-form-item label="应用下载地址">
            <el-input v-model="formData.applicationDownloadAddress" />
          </el-form-item>
          <el-form-item label="负责人姓名">
            <el-input v-model="formData.contactPerson" />
          </el-form-item>
          <el-form-item label="负责人联系方式">
            <el-input v-model="formData.contactPersonTel" />
          </el-form-item>
          <el-form-item label="负责人邮箱">
            <el-input v-model="formData.contactEmail" />
          </el-form-item>
        </el-form>
        <el-form
        v-if="isDefect"
            label-width="150px"
            :disabled="true"
          >
          <el-form-item label="应用ID" prop="appId">
          <el-select v-model="formData.appId" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.appName"
              :value="item.id"
            />
          </el-select>
          </el-form-item>
          <el-form-item label="缺陷描述" prop="defectDescription">
            <el-input type="textarea" v-model="formData.defectDescription" />
          </el-form-item>
          <el-form-item label="申请单位" prop="applicant">
            <el-input v-model="formData.applicant" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contacts">
            <el-input v-model="formData.contacts" />
          </el-form-item>
          <el-form-item label="申请包Id" prop="programPackageId">
            <el-input v-model="formData.programPackageId" />
          </el-form-item>
          <el-form-item label="发布时间" prop="releaseDate">
                 <el-date-picker
                 style="width: 100%"
                  v-model="formData.releaseDate"
                  type="datetime"
                  placeholder="请选择时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
          </el-form-item>
      </el-form>
        <div class="btn">
          <el-button type="primary" @click="handleSuccess">通过</el-button>
          <el-button
            type="danger"
            class="danger"
            style="background-color: #f56c6c; border-color: #f56c6c"
            @click="handleError"
            >驳回</el-button
          >
        </div>
      </div>
    </el-dialog>



    <showImg ref="imgRef" :src="flowSrc" />
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from "vue";
import showImg from "./showImg.vue";
import {
  getDetail,
  approvedTask,
  deleteTask,
  updateState,
  downloadFile,
} from "@/api/application";
import {  getUpdateList, editState } from "@/api/system";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps({
  state: Number,
  tableList: Array,
});

const emits = defineEmits(["currentChange", "handleList"]);

const pageNum = ref(1);

const formData = ref({});

const propData = ref({});

const dialogTable = ref(false);

const approvdText = ref("");

const rejectMessage = ref("");

const base64Image = ref("");

const isDefect = ref(false);
const handleClick =async (row) => {
  propData.value = row;
  const params = {
    pageNum: 1,
    pageSize: 10,
    id: row.businessId,
  };
  let res = null;
  if(row.businessId.includes('APPDEFECT')) {
    isDefect.value = true;
    res =  await getUpdateList(params);
  } else {
    isDefect.value = false;
    res = await getDetail(params);
  }
  if (res.code == 200 && res.data.rows.length != 0) {
    formData.value = res.data.rows[0];
    dialogTable.value = true;
    const params = {
      fileId: formData.value.appFileId,
    };
    downloadFile(params).then((res) => {
      filetoBase64(res.response);
    });
  }
};

const filetoBase64 = (file) => {
  const reader = new FileReader();
  // 读取 File 对象
  reader.readAsDataURL(file);
  // 加载完成后
  reader.onload = function () {
    // 将读取的数据转换为 base64 编码的字符串
    const base64String = reader.result.split(",")[1];
    // 解析为 Promise 对象，并返回 base64 编码的字符串
    //获得文件读取成功后的DataURL,也就是base64编码

    base64Image.value = base64String;
  };
};

const handleCurrentChange = () => {
  emits("currentChange", pageNum.value);
};

const handleSuccess = () => {
  approvdText.value = "审批通过";
  let params = {
    processName: propData.value.processDefinitionId.substring(
      0,
      propData.value.processDefinitionId.indexOf(":")
    ),
    processInstanceId: propData.value.processInstanceId,
    processDefinitionId: propData.value.processDefinitionId,
    senderId: localStorage.getItem("createById"),
    senderName: localStorage.getItem("userName"),
    receiverName: localStorage.getItem("userName"),
    receiverId: "a18a45867e8f11ed879f00ff0ec5aa85",
    createTime:
      formData.value.createTime && formData.value.createTime != ""
        ? formData.value.createTime
        : "",
    approvalComments: "审批通过",
    map: {
      id: formData.value.id,
    },
    taskId: propData.value.taskId,
    taskName: propData.value.taskName + "-" + propData.value.taskDefinitionKey,
  };
  approvedTask(params).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: "'审批成功'",
      });
      emits("handleFresh");
      dialogTable.value = false;
      if (res.data == "2") {
        changeState();
      }
    }
  });
};
const changeState = () => {
  let processName = propData.value.processDefinitionId.substring(
    0,
    propData.value.processDefinitionId.indexOf(":")
  );
  let state = 0;
  if (processName == "App_Registration_approval") {
    state = 2;
  }
  if (processName == "Off_Shelf_approval") {
    state = 5;
  }
  if (approvdText.value == "驳回") {
    state = 3;
  }
  let params = [
    {
      id: formData.value.id,
      state: state,
    },
  ];
  if (approvdText.value == "驳回") {
    params[0].reasonRejection = rejectMessage.value;
  }
  if(isDefect.value) {
    editState([{state: approvdText.value == '驳回' ?  4 : 3, id: formData.value.id}]).then(res => {
          console.log(res);
    });
   } else {
    updateState(params).then((res) => {
      console.log(res);
     });
   }

};

const handleError = () => {
  ElMessageBox.prompt("请输入驳回原因", "驳回", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      approvdText.value = "驳回";
      rejectMessage.value = value;
      let params = {
        processName: propData.value.processDefinitionId.substring(
          0,
          propData.value.processDefinitionId.indexOf(":")
        ),
        processInstanceId: propData.value.processInstanceId,
        processDefinitionId: propData.value.processDefinitionId,
        senderId: localStorage.getItem("createById"),
        senderName: localStorage.getItem("userName"),
        receiverName: "无",
        receiverId: "无",
        createTime:
          formData.value.createTime && formData.value.createTime != ""
            ? formData.value.createTime
            : "",
        map: {
          id: formData.value.id,
        },
        taskId: propData.value.taskId,
        taskName:
          propData.value.taskName + "-" + propData.value.taskDefinitionKey,
      };
      deleteTask(params).then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "'驳回成功'",
          });
          emits("handleFresh");
          dialogTable.value = false;
          changeState();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};

// 查看流程图
const imgRef = ref();
const flowSrc = ref("");
const viewFlow = (row) => {
  console.log(row);
  if (row.taskName == "app下架审批" || row.taskName == "应用下架审批") {
    flowSrc.value = require("../../../assets/unline.png");
  } else if (row.taskName == "app上架审批" || row.taskName == "应用上架审批") {
    flowSrc.value = require("../../../assets/online.jpg");
  } else {
    flowSrc.value = require("../../../assets/register.jpg");
  }
  imgRef.value.open();
};
</script>
<style lang="scss" scoped>
:deep(.el-pager li.is-active) {
  background-color: rgb(0, 128, 128) !important;
}

.approved {
  width: 100%;

  .btn {
    display: flex;
    justify-content: center;
  }
}

.danger:hover {
  background-color: #fab6b6 !important;
  border-color: #fab6b6 !important;
}
</style>
