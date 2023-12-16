import { post, getDown } from "../utils/request";
// 获取流程图列表
export function getFlowList(params) {
  return post("/camunda/selectProcess", params);
}
// 创建流程
export function createFlow(params) {
  return post("/camunda/deployProcess", params);
}
// 下载流程图
export function downFlow(params) {
  return getDown("/camunda/downloadProcess", params);
}
// 查询流程节点;
export function getFlowNode(params) {
  return post("/camunda/selectProcessNode", params);
}
// 配置人员;
export function configuration(params) {
  return post("/camunda/updateProcessNode", params);
}
// 获取组织
export function getGroup(params) {
  return post("/SysDept/select", params);
}
// 获取用户
export function getUsers(params) {
  return post("/SysUser/select", params);
}
// 下载流程定义安装包
export function downPack(params) {
  return getDown("/camunda/downloadCamundaModeler", params);
}
// 下载模版
export function downTemplate() {
  return getDown("/camunda/downloadBpmn");
}
// 删除流程
export function deleteProcess(params) {
  return post("/camunda/deleteProcess", params);
}