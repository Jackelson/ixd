/*
 * @Description:
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-06 20:32:21
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-01 14:46:03
 */
export const menuList = [
  {
    id: "2",
    name: "应用管理",
    icon: "应用管理",
    path: "/applicationManage",
    children: [
      {
        id: "104",
        name: "应用信息管理",
        icon: "轮播图管理",
        path: "/application",
      },
      {
        id: "105",
        name: "应用待办管理",
        icon: "轮播图管理",
        path: "/approved",
      },
    ],
  },
  {
    id: "1",
    name: "系统管理",
    icon: "系统管理",
    path: "/userManagement",
    children: [
      {
        id: "100",
        name: "用户管理",
        icon: "用户管理",
        path: "/userManagement",
      },
      {
        id: "101",
        name: "角色管理",
        icon: "角色管理",
        path: "/roleManagement",
      },
      {
        id: "102",
        name: "菜单管理",
        icon: "菜单管理",
        path: "/menuManagement",
      },
      {
        id: "212",
        name: "流程管理",
        icon: "流程管理",
        path: "/flowMange",
      },
      {
        id: "236",
        name: "日志管理",
        icon: "日志管理",
        path: "/logMange",
      },
      {
        id: "216",
        name: "底层建设管理",
        icon: "底层建设管理",
        path: "/baseBuild",
      },
      {
        id: "237",
        name: "请求监控管理",
        icon: "请求监控管理",
        path: "/monitor",
      },
      {
        id: "239",
        name: "其他信息管理",
        icon: "其他信息管理",
        path: "/elseInfo",
      },
      {
        id: "103",
        name: "轮播图公告管理",
        icon: "轮播图管理",
        path: "/rotationManagement",
      },
      {
        id: "1090",
        name: "项目管理",
        icon: "项目管理",
        path: "/projectMan",
      },
      {
        id: "1092",
        name: "监控展示",
        icon: "监控展示",
        path: "/areaShow",
      },
    ],
  },
];
