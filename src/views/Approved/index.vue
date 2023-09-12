<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-07-26 14:38:31
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-01 14:17:08
-->
<template>
    <div class="approved">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="待审批" name="first">
                <ApprovedList :state="state" :tableList="tableList" @currentChange="currentChange" @handleFresh="handleList"/>
            </el-tab-pane>
            <el-tab-pane label="已通过" name="second">
                <AppList :state="state" :tableList="tableList" @currentChange="currentChange" />
            </el-tab-pane>
            <el-tab-pane label="已驳回" name="third">
                <AppList :state="state" :tableList="tableList" @currentChange="currentChange" />
            </el-tab-pane>
            <el-tab-pane label="已撤销" name="fourth">
                <AppList :state="state" :tableList="tableList" @currentChange="currentChange" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import ApprovedList from "./components/approvedList.vue"
import AppList from "./components/appList.vue"
import { appList, approvedList } from "@/api/application"
const activeName = ref('first')
const state = ref(1)
const stateObj = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 6
}
const param = ref({
    createId: localStorage.getItem("createById"),
    pageNum: 1,
    pageSize: 10,
    state: 1,
})

const tableList = ref([])
const handleClick = (tab) => {
    state.value = stateObj[tab.props.name]
    activeName.value = tab.props.name
    console.log(tab,'name')
    param.value.pageNum = 1
    param.value.state = state.value
    handleList()
}

const currentChange = (pageNum) => {
    param.value.pageNum = pageNum
    handleList()
}

const handleList = () => {
    if (activeName.value == 'first') {
        let params = {
            processInstanceId: "",
            businessKey: "",
            assignee: localStorage.getItem('userName'),
            pageNum: param.value.pageNum,
            pageSize: "10",
        }
        approvedList(params).then((res) => {
            tableList.value = res.data.list
        })
        return
    }
    appList(param.value).then(res => {
        tableList.value = res.data.rows
    })
}

onMounted(() => {
    handleList()
})
</script>
<style scoped lang="scss"></style>