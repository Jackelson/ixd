import { post, get } from "../utils/request";
export const getSelAppList = () => {
  return get("/AppRequestInfo/selectAppNameAndId");
};
export const getList = (params) => {
  return post("/AppRequestInfo/select", params);
};
