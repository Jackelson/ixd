import {
    // get, 
    post,
    uploadFileHttp
} from '../utils/request';

//业务域
export async function getBusinessType(params) {
    return await post('SysSelectDictionary/select', params)
}

//上传文件
export async function uploadFile(params) {
    return await post('file/uploadFile', params)
}

//注册app
export async function appInsert(params) {
    return await post("AppRegisterInfo/insert", params)
}

//启动流程
export async function startProcessInstance(params) {
    return await post("camunda/startProcessInstance", params)
}

//更新app
export async function updateState(params) {
    return await post("AppRegisterInfo/updateState", params)
}

//撤销提交
export async function revokeSubmit(params) {
    return await post("camunda/retractProcess", params)
}
//app列表页
export async function appList(params) {
    return await post("AppRegisterInfo/select", params)
}

//查询待办事项
export async function approvedList(params) {
    return await post("camunda/queryTask", params)
}
//待办详情
export async function getDetail(params) {
    return await post("AppRegisterInfo/select", params)
}

//审批
export async function approvedTask(params) {
    return await post("camunda/completeTask", params)
}

//驳回
export async function deleteTask(params) {
    return await post("camunda/deleteTask", params)
}

//下载文件
export async function downloadFile(params) {
    return await uploadFileHttp("file/downLoadFile", params)
}

//更新app
export async function updateApp(params) {
    return await post("AppRegisterInfo/update", params)
}

//更新文件
export async function updateFile(params) {
    return await post("file/updateFile", params)
}

////删除文件
export async function deleteFile(params) {
    return await post("file/delete", params)
}