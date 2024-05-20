<template>
 <el-card>
      <el-form :inline="true">
      <!-- v-if="isCheckString.indexOf('appId') >= 0" -->
      <el-form-item label="应用">
        <el-select v-model="searchForm.appId">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.appName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请单位">
        <el-input v-model="searchForm.applicant"></el-input>
      </el-form-item>
        <el-form-item label="联系方式">
        <el-input v-model="searchForm.contacts" placeholder="请填写联系人手机号"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="searchForm.date"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
        <el-form-item label="状态">
              <el-select v-model="searchForm.state" style="width: 100%">
                 <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            </el-select>
        </el-form-item>
      <el-form-item label="">
        <el-button @click="getData">查询</el-button>
        <el-button @click="resetData">清空</el-button>
        <!--  v-if="isCheckString != ''"   
          v-if="isCheckString != ''"
          -->
        <!-- <el-button @click="checkSeach">筛选搜索框</el-button> -->
      </el-form-item>
    </el-form>
    <el-space>
      <el-button @click="handelAdd">新增</el-button>
      <el-button @click="handelEditStatus">提交</el-button>
      <!-- <el-button type="danger" @click="handelDelete">删除</el-button> -->
    </el-space>
    <el-table  v-loading="loading" ref="tableRef" :data="tableData" style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="sort" label="序号" align="center" width="80">
        <template #default="{ $index }">
          <span>
            {{ $index + 1 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="appId" label="应用ID" align="center" width="140" />
      <el-table-column prop="createId" label="创建人Id" align="center" />
      <el-table-column
        prop="defectDescription"
        label="缺陷描述"
        align="center"
      />
      <el-table-column prop="applicant" label="申请单位" align="center" />
      <el-table-column prop="contacts" label="联系人" align="center" />
      <!-- <el-table-column prop="minCreateTime" label="开始时间" align="center" />
      <el-table-column prop="maxCreateTime" label="结束时间" align="center" /> -->
      <el-table-column prop="state" label="状态" align="center" width="80">
        <template #default="{ row }">
          <div class="status">
            <span>{{status.filter(s => s.value == row.state)[0] && status.filter(s => s.value == row.state)[0].label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="80">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handelEdit(row)">
            修改
          </el-button>
          <el-button type="danger" @click="deleteRaio(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; float: right; margin-bottom: 10px"
      v-model:current-page="searchForm.pageNum"
      v-model:page-size="searchForm.pageSize"
      :page-sizes="[10, 15, 20, 30]"
      small="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeChange"
      @current-change="pageChange"
    />

    <el-dialog :title="title" v-model="showDialog" @close="close">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <div v-if="title == '修改状态'">
          <el-form-item label="" prop="state">
            <el-select v-model="ruleForm.state" style="width: 100%">
                 <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label="应用ID" prop="appId">
          <el-select v-model="ruleForm.appId" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.appName"
              :value="item.id"
            />
          </el-select>
          </el-form-item>
          <el-form-item label="缺陷描述" prop="defectDescription">
            <el-input type="textarea" v-model="ruleForm.defectDescription" />
          </el-form-item>
          <el-form-item label="申请单位" prop="applicant">
            <el-input v-model="ruleForm.applicant" />
          </el-form-item>
          <el-form-item label="联系方式" prop="contacts">
            <el-input v-model="ruleForm.contacts" />
          </el-form-item>
          <el-form-item label="申请包Id" prop="programPackageId">
            <el-input v-model="ruleForm.programPackageId" />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="state">
             <el-select v-model="ruleForm.state" style="width: 100%">
                 <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            </el-select>
          </el-form-item> -->
          <el-form-item label="发布时间" prop="releaseDate">
                 <el-date-picker
                 style="width: 100%"
                  v-model="ruleForm.releaseDate"
                  type="datetime"
                  placeholder="请选择时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button :loading="loading"  v-if="title == '修改状态'" type="primary" @click="saveStatus">
            保存
          </el-button>
          <el-button :loading="loading" v-else type="primary" @click="submitAdd">
            {{ title == '修改' ?  '修改' : '保存' }} 
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
// getList  
import {  editState, deleteUpdate, getUpdateList, addUpdate, editUpdate, getSelectAppInfo, upDateEffect } from "@/api/system";
import { ElMessage } from "element-plus";
const total = ref(0);


const effectData = ref({
    processName:"App_Defect_approval",
    senderId:localStorage.getItem("createById") || '', //这个当前登录人id
    senderName: localStorage.getItem("userName"),     
})

// 获取选择框内容
const getSelects = async () => {
  const res = await getSelectAppInfo({userId:  effectData.value.senderId,});
  if (res.code == 200) {
    options.value = res.data;
  }
};

const status = ref([
  // {
  //   label: '删除',
  //   value: -1,
  // },
  {
    label: '保存',
    value: 1,
  },
  {
    label: '提交',
    value: 2,
  },
  {
    label: '通过',
    value: 3,
  },
  {
    label: '驳回',
    value: 4,
  }
])

const loading = ref(false);
const options = ref([]);
// 搜索条件
const searchForm = ref({
  pageNum: 1,
  pageSize: 10,
});
const tableData = ref([]);
// 获取数据
const getData = async (params) => {
  if (params) {
    searchForm.value.pageNum = params.pageNum;
    searchForm.value.pageSize = params.pageSize;
  }
  if(searchForm.value.date) {
     searchForm.value.minCreateTime = searchForm.value.date[0];
     searchForm.value.maxCreateTime = searchForm.value.date[1];
  }
  delete searchForm.value.date;
  loading.value = true;
  const res = await getUpdateList(searchForm.value);
  if (res.code == 200) {
    loading.value = false;
    total.value = res.data.total;
    tableData.value = res.data.rows;
  }
};
getSelects();
getData();
// 分页改变
const sizeChange = (size) => {
  searchForm.value.pageSize = size;
  getData();
};
const pageChange = (page) => {
  searchForm.value.pageNum = page;
  getData();
};
// 多选
const selects = ref([]);
const handleSelectionChange = (value) => {
  selects.value = value;
};
const tableRef = ref();
const clearSelect = () => {
  tableRef.value.clearSelection();
};
// 修改状态
const handelEditStatus =async () => {
  if(selects.value.length === 0) {
    ElMessage.warning("请勾选要修改的数据");
    return;
  }
  const data = selects.value.map(item => {
    return {state: 2, id: item.id}
  });
  const res = await editState(data);
  if(res.code == 200) {
    ElMessage.success('状态修改成功');
    showDialog.value = false;
    getData();
    clearSelect();
  } 
  // title.value = '修改状态'
  // showDialog.value = true;
};
const saveStatus = async () => {
  const v =  await ruleFormRef.value.validate();
  if(!v) return;
  const data = selects.value.map(item => {
    return {state: ruleForm.value.state, id: item.id}
  });
  const res = await editState(data);
  if(res.code == 200) {
    ElMessage.success('状态修改成功');
    showDialog.value = false;
    getData();
    clearSelect();
  } 
}
// 弹窗部分
const title= ref('');
const showDialog = ref(false);
// 关闭弹窗
const close = () => {
  ruleFormRef.value.clearValidate();
  ruleForm.value = {};
  clearSelect();
}
//新增部分
const ruleForm = ref({
  appId: ''
});

const isMobilePhone = (rule, value, callback) => {
      if (!value) {
        return new Error("请填写联系方式");
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error("联系方式格式错误"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入联系方式"));
        }
      }
};
const ruleFormRef = ref()
const rules = ref({
  state: [
    {required: true, message: '请选择状态', trigger: 'blur'}
  ],
  appId: [
    {required: true, message: '请填写应用id', trigger: 'blur'}
  ],
  programPackageId: [
    {required: true, message: '请选择状态', trigger: 'blur'}
  ],
  contacts: [
    {required: true, message: '请填写联系方式' , trigger: 'blur'},
    { validator: isMobilePhone, trigger: "blur" },
  ],
  applicant: [
    {required: true, message: '请填写申请单位', trigger: 'blur'}
  ],
  defectDescription: [
    {required: true, message: '请填写缺陷描述', trigger: 'blur'}
  ],
  releaseDate: [
    {required: true, message: '请填写发布时间', trigger: 'blur'}
  ]
});
const handelAdd = () => {
  title.value = '新增'
  showDialog.value = true;
};
const submitAdd =async () => {
  const v =  await ruleFormRef.value.validate();
  if(!v) return;
  loading.value = true;
  let res = {};
  const data = {...ruleForm.value, createId: localStorage.getItem("createById")};
  if(title.value == '修改') {
    res = await editUpdate(data).catch(() => loading.value = false);
    await upDateEffect({map:{id: ruleForm.value.id}, ...effectData.value }).catch(() => loading.value = false);
  } else {
    res = await addUpdate(data, {...data, status: 1 }).catch(() => loading.value = false);
    await upDateEffect({map:{id: ruleForm.value.id}, ...effectData.value }).catch(() => loading.value = false);
  }
  loading.value = false;
  if(res.code == 200) {
    ElMessage.success('新增成功');
    showDialog.value = false;
    getData();
  } else {
    loading.value = false;
     ElMessage.success(res.msg || '新增失败');
  }
}

// 修改部分
const handelEdit = (row) => {
  if(row.state == 2 || row.state == 3 || row.state == 4) {
    ElMessage.warning('状态为提交、通过、驳回的数据不能修改');
    return
  }
  ruleForm.value.state = row.state || '';
  ruleForm.value.appId = row.appId || '';
  ruleForm.value.programPackageId = row.programPackageId || '';
  ruleForm.value.contacts = row.contacts || '';
  ruleForm.value.applicant = row.applicant || '';
  ruleForm.value.defectDescription = row.defectDescription || '';
  ruleForm.value.id = row.id || '';
  ruleForm.value.releaseDate = row.releaseDate || '';
  title.value = '修改'
  showDialog.value = true;
  clearSelect();
};
// 删除部分
// const handelDelete = async () => {
//   if(selects.value.length == 0) {
//     ElMessage.warning('请选择要删除的数据');
//     return
//   }
//   for(let i = 0; i < selects.value.length ; i++ ) {
//     if(selects.value[i].state != 1) {
//       ElMessage.warning('只有保存状态的数据可以删除');
//       return;
//     }
//   }
//   const data = selects.value.map(i => i.id);
//   loading.value = true;
//    const res = await deleteUpdate(data);
//   loading.value = false;
//   if(res.code == 200) {
//     ElMessage.success('删除成功');
//     getData();
//     clearSelect();
//   } else {
//     ElMessage.warning(res.msg);
//   }
// }

// 删除部分
const deleteRaio = async (row) => {
  if(row.state != 1) {
    ElMessage.warning('只有保存状态的数据可以删除');
    return;
  }
  loading.value = true;
   const res = await deleteUpdate([row.id]);
  loading.value = false;
  if(res.code == 200) {
    ElMessage.success('删除成功');
    getData();
    clearSelect();
  } else {
    ElMessage.warning(res.msg);
  }
}

// 查询框
const resetData = () => {
  searchForm.value = {
    pageNum: 1,
    pageSize: 10,
  };
  getData();
};
</script>

<style lang="scss" scoped>
.el-table {
  overflow-x: scroll;
}
</style>
