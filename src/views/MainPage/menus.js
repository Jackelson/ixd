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
        id: '2',
        name: '应用管理',
        icon: '应用管理',
        path: '/applicationManage',
        children: [
            {
                id: '114',
                name: '应用信息管理',
                icon: '轮播图管理',
                path: '/application'
            },
            {
                id: '201',
                name: '应用待办管理',
                icon: '轮播图管理',
                path: '/approved'
            },
        ]
    },
    {
        id: '1',
        name: '系统管理',
        icon: '系统管理',
        path: '/userManagement',
        children: [
            {
                id: '100',
                name: '用户管理',
                icon: '用户管理',
                path: '/userManagement'
            },
            {
                id: '101',
                name: '角色管理',
                icon: '角色管理',
                path: '/roleManagement'
            },
            {
                id: '102',
                name: '菜单管理',
                icon: '菜单管理',
                path: '/menuManagement'
            },
            {
                id: '103',
                name: '轮播图公告管理',
                icon: '轮播图管理',
                path: '/rotationManagement'
            }
        ]
    },
]