<template>
  <div>
    <el-form
      :model="formData"
      label-width="140px"
      style="width: 500px"
      ref="ruleFormRef"
      :rules="rules"
    >
      <el-form-item prop="appName" label="app名称:">
        <el-input v-model="formData.appName" placeholder="请输入app名称" />
      </el-form-item>
      <el-form-item prop="appDescribe" label="app描述:">
        <el-input
          v-model="formData.appDescribe"
          placeholder="请输入app描述"
          type="textarea"
          rows="3"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="app图标:">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="handleAvatarSuccess"
          accept=".jpg,.png,.jpeg"
          action="#"
          :auto-upload="false"
        >
          <img
            v-if="imageUrl"
            :src="`${imageUrl}`"
            class="avatar"
            style="width: 50px; height: 50px"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item prop="appSecretKey" label="密钥:">
        <el-input v-model="formData.appSecretKey" placeholder="请输入密钥" />
      </el-form-item>

      <el-form-item prop="appAffiliatedCompany" label="所属公司:">
        <el-input
          v-model="formData.appAffiliatedCompany"
          placeholder="请输入所属公司"
        />
      </el-form-item>
      <el-form-item prop="appIndexUrl" label="首页地址:">
        <el-input
          v-model="formData.appIndexUrl"
          placeholder="请输入首页地址"
          disabled
        />
      </el-form-item>
      <el-form-item prop="applicationDownloadAddress" label="下载地址:">
        <el-input
          v-model="formData.applicationDownloadAddress"
          placeholder="请输入下载地址"
        />
      </el-form-item>
      <el-form-item prop="cardiacTestingUrl" label="测试链接地址:">
        <el-input
          v-model="formData.cardiacTestingUrl"
          placeholder="请输入测试链接地址"
        />
      </el-form-item>
      <el-form-item prop="department" label="所属部门:">
        <el-input v-model="formData.department" placeholder="请输入所属部门" />
      </el-form-item>
      <el-form-item prop="appCheckStatus" label="应用检测状态:">
        <el-select
          v-model="formData.appCheckStatus"
          placeholder="请选择应用检测状态"
          style="width: 100%"
        >
          <el-option
            v-for="(v, k) in stateNameOptions"
            :key="k"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="offLineApp" label="是否离线:">
        <el-select
          v-model="formData.offLineApp"
          placeholder="请选择应用是否离线"
          style="width: 100%"
        >
          <el-option
            v-for="(v, k) in offLineOptions"
            :key="k"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="appPersonContact" label="是否关联用户:">
        <el-radio-group v-model="formData.appPersonContact" class="ml-4">
          <el-radio label="0" size="large">是</el-radio>
          <el-radio label="1" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="businessType" label="业务域:">
        <el-select
          v-model="formData.businessType"
          placeholder="请选择应用是否离线"
          style="width: 100%"
        >
          <el-option
            v-for="(v, k) in bussinessTypeOptions"
            :key="k"
            :label="v.label"
            :value="v.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="contactPerson" label="负责人姓名:">
        <el-input
          v-model="formData.contactPerson"
          placeholder="请输入负责人姓名"
        />
      </el-form-item>
      <el-form-item prop="contactPersonTel" label="负责人联系方式:">
        <el-input
          v-model="formData.contactPersonTel"
          placeholder="请输入负责人联系方式"
        />
      </el-form-item>
      <el-form-item prop="contactEmail" label="负责人邮箱:">
        <el-input
          v-model="formData.contactEmail"
          placeholder="请输入负责人邮箱"
        />
      </el-form-item>
      <el-form-item
        prop="reasonRejection"
        label="驳回理由:"
        v-if="formData.state == '审批驳回'"
      >
        <el-input
          :disabled="true"
          v-model="formData.reasonRejection"
          rows="3"
          type="textarea"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div class="dialog-btn">
      <el-button type="primary" @click="handleSave($refs.ruleFormRef)"
        >保存</el-button
      >
      <el-button type="info" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import {
  getBusinessType,
  uploadFile,
  appInsert,
  downloadFile,
} from "@/api/application";
import moment from "moment";
export default {
  props: {
    appData: {
      required: false,
      type: Object,
    },
  },
  data() {
    const isMobilePhone = (rule, value, callback) => {
      if (!value) {
        return new Error("请输入电话号码");
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error("手机号码格式错误"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入电话号码"));
        }
      }
    };
    const isEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        const reg =
          /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        const email = reg.test(value);
        if (!email) {
          callback(new Error("邮箱格式错误"));
        } else {
          callback();
        }
      }
    };
    const JudgeHttp = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入下载地址"));
      } else if (value.length <= 6) {
        callback(new Error("请输入完整的下载地址"));
      } else {
        if (value.indexOf("http") == 0 || value.indexOf("https") == 0) {
          callback();
        } else {
          callback(new Error("下载地址必须是http或者https开头"));
        }
      }
    };
    const JudgeTestingUrl = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入测试链接地址"));
      } else if (value.length <= 6) {
        callback(new Error("请输入完成测试链接地址"));
      } else {
        if (value.indexOf("http") == 0 || value.indexOf("https") == 0) {
          callback();
        } else {
          callback(new Error("测试链接地址必须是http或者https开头"));
        }
      }
    };
    const judgeZh = (rule, value, callback) => {
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 255) {
          callback(new Error("密钥不能是中文"));
          return;
        }
      }
      callback();
    };
    return {
      formData: {
        appFileId: "",
      },
      imageUrl: "",
      stateNameOptions: [
        { label: "已检测", value: "1" },
        { label: "未检测", value: "0" },
      ],
      offLineOptions: [
        { label: "在线应用", value: "1" },
        { label: "离线应用", value: "0" },
      ],
      bussinessTypeOptions: [],
      rules: {
        appName: [
          { required: true, message: "请输入app名称", trigger: "blur" },
        ],
        appDescribe: [
          { required: true, message: "请输入app描述", trigger: "blur" },
        ],
        appSecretKey: [
          { required: true, message: "请输入密钥", trigger: "blur" },
          { validator: judgeZh, trigger: "blur" },
        ],
        appAffiliatedCompany: [
          { required: true, message: "请输入所属公司", trigger: "blur" },
        ],
        appIndexUrl: [
          { required: true, message: "请输入首页地址", trigger: "blur" },
        ],
        cardiacTestingUrl: [
          { required: true, validator: JudgeTestingUrl, trigger: "change" },
        ],
        applicationDownloadAddress: [
          { required: true, validator: JudgeHttp, trigger: "change" },
        ],
        department: [
          { required: true, message: "请输入所属部门", trigger: "blur" },
        ],
        appCheckStatus: [
          { required: true, message: "请输入应用检测状态", trigger: "change" },
        ],
        offLineApp: [
          { required: true, message: "请输入是否离线", trigger: "change" },
        ],
        businessType: [
          { required: true, message: "请输入业务域", trigger: "change" },
        ],
        contactPerson: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
        ],
        appPersonContact: [
          { required: true, message: "请选择是否关联用户", trigger: "blur" },
        ],
        contactPersonTel: [
          { required: true, message: "请输入负责人联系方式", trigger: "blur" },
          { validator: isMobilePhone, trigger: "blur" },
        ],
        contactEmail: [
          { required: true, message: "请输入负责人邮箱", trigger: "blur" },
          { validator: isEmail, trigger: "blur" },
        ],
      },
      fileId: "",
    };
  },
  methods: {
    getImg() {
      const params = {
        fileId: this.formData.appFileId,
      };
      downloadFile(params).then((res) => {
        this.filetoBase64(res);
      });
      console.log("123123");
    },
    filetoBase64(file) {
      const reader = new FileReader();
      // 读取 File 对象
      reader.readAsDataURL(file);
      // 加载完成后
      reader.onload = function () {
        // 将读取的数据转换为 base64 编码的字符串
        const base64String = reader.result.split(",")[1];
        // 解析为 Promise 对象，并返回 base64 编码的字符串
        //获得文件读取成功后的DataURL,也就是base64编码
        this.imageUrl = "data:image/png;base64," + base64String;
      };
    },

    handleAvatarSuccess(file) {
      let imgType = file.name.substring(file.name.indexOf(".") + 1);
      if (!["jpeg", "jpg", "png"].includes(imgType)) {
        return this.$message.warning("请上传jpeg、jpg、png格式图片");
      }
      this.imageUrl = URL.createObjectURL(file.raw);
      let formData = new FormData();
      formData.set("userId", localStorage.getItem("createById"));
      formData.set("appId", 1);
      formData.set("uploadFile", file.raw);
      uploadFile(formData).then((res) => {
        console.log(res, "ress");
        if (res.code == 200) {
          this.fileId = res.data;
        }
      });
    },
    handleSave(formEl) {
      console.log("formEl", formEl);
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          this.handleAdd();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    handleAdd() {
      if (this.fileId && this.fileId == "") {
        return this.$message.warning("请上传图标");
      }
      const params = { ...this.formData };
      params.appFileId = this.fileId;
      params.createId = localStorage.getItem("createById");
      params.createName = localStorage.getItem("userName");
      appInsert(params).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: "注册成功",
          });
          this.$emit("reFresh");
          this.$emit("handleCancel");
        }
      });
    },
    handleCancel() {
      this.$emit("handleCancel");
    },
    getBusType() {
      const params = {
        selectFlag: "business_type",
      };
      getBusinessType(params).then((res) => {
        if (res.code == 200) {
          this.bussinessTypeOptions = res.data.map((item) => {
            return { value: item.optionId, label: item.optionName };
          });
        }
      });
    },
  },
  created() {
    this.getBusType();
    this.formData.appIndexUrl =
      moment(new Date()).format("YYMMDDHHmmss") + "/index.html";
    if (this.appData && this.appData.id != "") {
      this.formData = this.appData;
      this.getImg();
    }
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader {
  border: 1px dashed #dcdfe6 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: #409eff !important;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  text-align: center;
}

.dialog-btn {
  width: 100%;
  height: 50px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style>
