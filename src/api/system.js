import { get, post } from "../utils/request";

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
