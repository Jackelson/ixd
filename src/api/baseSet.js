import { post } from "../utils/request";

// 列表
export const getBottomBuildLog = (params) => {
  return post("/BottomBuildLog/select", params);
};
