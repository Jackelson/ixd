<template>
    <div>
        <el-table :data="props.tableList" style="width: 100%"
            :header-cell-style="{ background: '#11ac9b !important', color: '#ffffff', }">
            <el-table-column prop="appName" label="app名称" />
            <el-table-column prop="appDescribe" label="app描述" />
            <el-table-column prop="appIndexUrl" label="app首页地址" />
            <el-table-column prop="businessName" label="业务类型" />
            <el-table-column prop="createName" label="发起人" />
            <el-table-column prop="contactPerson" label="负责人" />
            <el-table-column prop="contactPersonTel" label="负责人联系方式" />
            <el-table-column prop="contactEmail" label="负责人邮箱" />
            <el-table-column prop="reasonRejection" label="驳回原因" v-if="state == 3"/>
        </el-table>
        <el-pagination style="margin-top: 20px;display: flex;justify-content: center;" background layout="prev, pager, next"
            :total="props.tableList.length" @current-change="handleCurrentChange" :current-change="pageNum" />

    </div>
</template>
<script setup>
import { defineProps, ref,defineEmits } from 'vue';

const props = defineProps({
    state: Number,
    tableList: Array
})

const emits = defineEmits(['currentChange'])

const pageNum = ref(1)

const handleCurrentChange = () => {
    emits('currentChange',pageNum.value)
}
</script>
<style lang="scss" scoped></style>