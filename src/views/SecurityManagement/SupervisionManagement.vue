<template>
  <div class="gridWrapper">
    <div class="gridWrapper__title">安全督察管理</div>
    <div class="gridWrapper__box">
      <TrsForm size="mini" :maxShow="3" @search="search" @reset="reset">
        <el-form-item label="班组">
          <el-select v-model="formData.group" placeholder="请选择班组">
            <el-option v-for="(item, index) in groupList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="施工单位">
          <el-select v-model="formData.constructionUnit" placeholder="请选择施工单位">
            <el-option v-for="(item, index) in constructionUnitList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任单位">
          <el-select v-model="formData.responsibelUnit" placeholder="请选择责任单位">
            <el-option v-for="(item, index) in responsibelUnitList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="督察层级">
          <el-select v-model="formData.supervisionLevel" placeholder="请选择督察层级">
            <el-option v-for="(item, index) in supervisionLevelList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="督察方式">
          <el-select v-model="formData.supervisionMethod" placeholder="请选择督察方式">
            <el-option v-for="(item, index) in supervisionMethodList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="违章等级">
          <el-select v-model="formData.violationLevel" placeholder="请选择违章等级">
            <el-option v-for="(item, index) in violationLevelList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width: auto"> </el-date-picker>
        </el-form-item>
      </TrsForm>
      <!-- <el-form :model="formData" label-position="right" label-width="120">
        <el-row :gutter="20">
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            
          </el-col>
          <el-col :span="6">
            
          </el-col>
        </el-row>
      </el-form> -->
    </div>
  </div>
</template>

<script setup>
import TrsForm from '@/components/TrsForm/index.vue'
import { reactive } from 'vue';
const formData = reactive({
        group: '',
        constructionUnit: '',
        responsibelUnit: '',
        supervisionLevel: '',
        supervisionMethod: '',
        violationLevel: '',
        date: [],
    })
    const groupList = [
      {label:'111', value: '11'},
      {label:'222', value: '22'},
    ]
    const constructionUnitList = [
      {label:'111', value: '11'},
    ]
    const responsibelUnitList = []
    const supervisionLevelList = []
    const supervisionMethodList = []
    const violationLevelList = []
// export default defineComponent({
//   setup() {
//     const formData = reactive({
//         group: '',
//         constructionUnit: '',
//         responsibelUnit: '',
//         supervisionLevel: '',
//         supervisionMethod: '',
//         violationLevel: '',
//     })
//     const groupList = [
//       {label:'111', value: '11'},
//       {label:'222', value: '22'},
//     ]
//     const constructionUnitList = [
//       {label:'111', value: '11'},
//     ]
//     const responsibelUnitList = []
//     const supervisionLevelList = []
//     const supervisionMethodList = []
//     const violationLevelList = []
//     return {
//       formData,
//       groupList,
//       constructionUnitList,
//       responsibelUnitList,
//       supervisionLevelList,
//       supervisionMethodList,
//       violationLevelList,
//     }
//   }
// })
</script>

<style lang="scss">
.gridWrapper__box{
  ::v-deep{
    .el-form{
      display: flex!important;
      width: 100%;
      .el-form-item{
        flex: 1;
      }
    }
  }
}
  
</style>