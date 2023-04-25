<template>
  <div class="T-side-container">
    <el-menu
      :default-active="'1-1'"
      class="T-menu"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-sub-menu :index="item.id" v-for="item in menus" :key="item.id">
        <template #title>
          <el-icon><setting /></el-icon>
            <!-- <svg-icon :icon="item.icon" className="svgIcon"></svg-icon> -->
            <span>{{item.name}}</span>
        </template>
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.id">{{ subItem.name }}</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="collapse-icon" @click="handleMenu"> &lt; </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menus: [
        {
          id: '1',
          name: '安全管理',
          icon: 'bg-security',
          path: '/SecurityManagement',
          children: [
            {
              id: '1-1',
              name: '安全督察管理',
              path: '/SecurityManagement/management'
            },
            {
              id: '1-2',
              name: '安全分析统计',
              path: '/SecurityManagement/analyze'
            },
            {
              id: '1-3',
              name: '人员准入管理',
              path: '/SecurityManagement/admittance'
            }
          ]
        },
        {
          id: '2',
          name: '员工管理',
          icon: 'bg-security',
          path: '/PersonManagement'
        },
        {
          id: '3',
          name: '项目管理',
          icon: 'bg-security',
          path: '/ProjectManagement'
        },
      ]
    }
  },
  methods: {
    handleMenu() {
      this.isCollapse = !this.isCollapse
    },
  }
}
</script>

<style lang="scss" scoped>
.T-side-container{
  height: 100%;
  background: #fff;
  position: relative;
  overflow: visible;
  .T-menu{
    
  }
  .collapse-icon{
    width: 12px;
    height: 102px;
    line-height: 102px;
    position: absolute;
    z-index: 9;
    top: 50%;
    transform: translateY(-25px);
    right: -12px;
    cursor: pointer;
    text-align: center;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: linear-gradient(90deg,#f0f2fc,#fff);
    color: #666;
  }
}

</style>