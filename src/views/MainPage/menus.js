/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-06 20:32:21
 * @LastEditors: hjw
 * @LastEditTime: 2023-05-08 09:33:07
 */
export const menuList = [
    {
        id: '0',
        name: '首页',
        icon: '首页',
        path: '/dashBoard',
    },
    {
        id: '2',
        name: '应用管理',
        icon: '应用管理',
        path: '/application',
        children: []
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
                name: '轮播图管理',
                icon: '轮播图管理',
                path: '/rotationManagement'
            }
        ]
    },
]