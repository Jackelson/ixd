/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-08-01 15:32:38
 */
import { createRouter,createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    redirect: '/dashBoard',
    component: () => import('@/views/MainPage/index'),
    children: [
      {
        path: '/dashBoard',
        name: 'DashBoard',
        component: () => import('@/views/dashBoard.vue'),
        meta:{title:"首页"}
      },
      {
        path: '/application',
        name: 'Application',
        component: () => import('@/views/ApplicationManagement/index.vue'),
        meta:{title:"应用信息管理"}
      },
      {
        path: '/approved',
        name: 'Approved',
        component: () => import('@/views/ApplicationManagement/index.vue'),
        meta:{title:"应用审批"}
      },
			{
        path: '/userManagement',
        name: 'UserManagement',
        component: () => import('@/views/SystemManagement/UserManagement.vue'),
        meta:{title:"用户管理"}
      },
			{
        path: '/roleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/SystemManagement/RoleManagement.vue'),
        meta:{title:"角色管理"}
      },
			{
        path: '/menuManagement',
        name: 'MenuManagement',
        component: () => import('@/views/SystemManagement/MenuManagement.vue'),
        meta:{title:"菜单管理"}
      },
			{
        path: '/rotationManagement',
        name: 'RotationManagement',
        component: () => import('@/views/SystemManagement/RotationManagement.vue'),
        meta:{title:"轮播图公告管理"}
      },
      {
        path: '/approved',
        name: 'Approved',
        component: () => import('@/views/Approved/index.vue'),
        meta:{title:"应用待办管理"}
      },

    ]
  },
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/login/index.vue'),
	},
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
