import { get, post, postDown } from "../utils/request";

export function insertData(params) {
  return post("/SysDept/insert", params);
}
// 获取组织
export function selectData(params) {
  return post("/SysDept/select", params);
}
export function updateData(params) {
  return post("/SysDept/update", params);
}

export function deleteData(params) {
  return post("/SysDept/delete", params);
}
// 获取日志列表

export function getLogList(params) {
  return post("/log/selectLogConfig", params);
}
// 获取日志详情

export function getselectLogReord(params) {
  return post("/log/selectLogReord", params);
}

// 接口信息查询

export function getPortInfo(params) {
  return get("/commonInfo/visitSwagger", params);
}
// 注册中心接口
export function getRegisterInfo(params) {
  return get("/commonInfo/visitEureka", params);
}

// 互联网大区服务监控展示

export function getAppScanInfo(params) {
  return post("/appVisit/selectAppScanInfo", params);
}
// 3.服务器资源监控
export function getServersInfo() {
  return post("/serverInfo/selectServerInfo");
}

// 子应用文件监控
export function getFileSelect(data) {
  return post("/file/select", data);
}

// 子应用文件下载
export function downFile(data) {
  return postDown("/file/selectFileStream", data);
}

// 子应用文件删除
export function deleteFile(data) {
  return post("/file/delete", data);
}



// 应用更新的列表
export function getUpdateList(data) {
  return post("/AppDefectLog/select", data);
}
// 新增更新
export function addUpdate(data) {
  return post("/AppDefectLog/insert", data);
}
//缺陷提交附加接口
// 新增更新
export function upDateEffect(data) {
  return post("/camunda/startProcessInstance", data);
}

// 修改
export function editUpdate(data) {
  return post("/AppDefectLog/update", data);
}
// 删除
export function deleteUpdate(data) {
  return post("/AppDefectLog/delete", data);
}
// 修改状态
export function editState(data) {
  return post("/AppDefectLog/updateState", data);
}
// 修改状态
export function getSelectAppInfo(data) {
  return post("/AppDefectLog/selectAppInfo", data);
}