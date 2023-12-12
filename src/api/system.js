import {
  // get,
  post,
} from "../utils/request";

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
