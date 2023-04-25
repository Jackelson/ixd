import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    redirect: '/dashBoard',
    component: () => import('@/views/MainPage/index'),
    children: [
      {
        path: '/SecurityManagement/supervision',
        name: 'SecurityManagementSupervision',
        component: () => import('@/views/SecurityManagement/SupervisionManagement'),
      },
      {
        path: '/SecurityManagement/analysis',
        name: 'SecurityManagementAnalysis',
        component: () => import('@/views/SecurityManagement/AnalysisStatistics'),
      },
      {
        path: '/dashBoard',
        name: 'DashBoard',
        component: () => import('@/views/dashBoard.vue'),
      },
      {
        path: '/application',
        name: 'Application',
        component: () => import('@/views/ApplicationManagement/index.vue'),
      },
			{
        path: '/userManagement',
        name: 'UserManagement',
        component: () => import('@/views/SystemManagement/UserManagement.vue'),
      },
			{
        path: '/roleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/SystemManagement/RoleManagement.vue'),
      },
			{
        path: '/menuManagement',
        name: 'MenuManagement',
        component: () => import('@/views/SystemManagement/MenuManagement.vue'),
      },
			{
        path: '/rotationManagement',
        name: 'RotationManagement',
        component: () => import('@/views/SystemManagement/RotationManagement.vue'),
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
