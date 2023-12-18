import { post } from "../utils/request";

// 列表
export const getBottomBuildLog = (params) => {
  return post("/BottomBuildLog/select", params);
};

// 配置信息查询
export const getCInfo = (params) => {
  return post("/commonInfo/selectConfigInfo", params);
};
