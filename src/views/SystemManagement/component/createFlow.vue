<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    destroy-on-close
    width="40%"
  >
    <el-form
      ref="ruleFormRef"
      :model="formState"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item label="流程中文名称" prop="bpmnName">
        <el-input clearable v-model="formState.bpmnName" />
      </el-form-item>
      <el-form-item label="流程英文名称" prop="bpmnEnglishName">
        <el-input clearable v-model="formState.bpmnEnglishName" />
      </el-form-item>
      <el-form-item label="创建人" prop="createName">
        <el-input clearable v-model="formState.createName" />
      </el-form-item>
      <el-form-item label="流程附件" prop="file">
        <el-upload
          accept=".bpmn"
          ref="uploadRef"
          class="upload-demo"
          :auto-upload="false"
          :on-change="change"
          :limit="1"
          :on-remove="remove"
        >
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
          <!-- <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template> -->
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import { createFlow } from "@/api/flow";
const title = ref("创建流程");
const dialogVisible = ref(false);

const formState = ref({
  bpmnName: "",
  bpmnEnglishName: "",
  bpmnFileName: "",
  createId: "",
  file: "",
});
const emits = defineEmits(["success"]);
const change = (file) => {
  console.log(file);
  formState.value.bpmnFileName = file.name;
  formState.value.file = file.raw;
};
const rules = ref({
  bpmnName: [{ required: true, message: "流程中文名称", trigger: "change" }],
  bpmnEnglishName: [
    { required: true, message: "流程英文名称", trigger: "change" },
  ],
  createName: [{ required: true, message: "请输入创建人", trigger: "change" }],
  file: [{ required: true, message: "请上传bpmn附件", trigger: "change" }],
});
const ruleFormRef = ref();
const submit = () => {
  ruleFormRef.value.validate(async (v) => {
    if (v) {
      const createId = localStorage.getItem("createById");
      debugger;
      const formData = new FormData();
      formData.append("file", formState.value.file);
      formData.append("bpmnName", formState.value.bpmnName);
      formData.append("createName", formState.value.createName);
      formData.append("bpmnEnglishName", formState.value.bpmnEnglishName);
      formData.append("bpmnFileName", formState.value.bpmnFileName);
      formData.append("createId", createId);
      const res = await createFlow(formData).catch((err) => {
        console.log(err);
        // Elmessage.error(err.message, err.)
      });
      if (res.code == 200) {
        dialogVisible.value = false;
        emits("success");
      }
    }
  });
};
const remove = () => {
  formState.value.bpmnFileName = "";
  formState.value.file = "";
};
const open = () => {
  formState.value = {
    bpmnName: "",
    bpmnEnglishName: "",
    bpmnFileName: "",
    createId: "",
    file: "",
  };
  dialogVisible.value = true;
};
defineExpose({ open });
</script>

<style lang="scss" scoped></style>
