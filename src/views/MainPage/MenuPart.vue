<template>
  <div class="T-side-container">
    <el-menu
      :default-active="'1-1'"
      class="T-menu"
      :collapse="isCollapse"
      @open="handleOpen"
    >
      <!-- @close="handleClose" -->
      <el-sub-menu :index="item.id" v-for="item in menus" :key="item.id">
        <template #title>
          <el-icon><setting /></el-icon>
          <!-- <svg-icon :icon="item.icon" className="svgIcon"></svg-icon> -->
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.id"
          :index="subItem.id"
          >{{ subItem.name }}</el-menu-item
        >
      </el-sub-menu>
    </el-menu>
    <div class="collapse-icon" @click="handleMenu">&lt;</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menus: [],
    };
  },
  methods: {
    handleMenu() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style lang="scss" scoped>
.T-side-container {
  // height: 100%;
  max-height: 100vh !important;
  overflow: scroll !important;
  background: #fff;
  position: relative;
  // overflow: visible;
  .T-menu {
  }
  .collapse-icon {
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
    background: linear-gradient(90deg, #f0f2fc, #fff);
    color: #666;
  }
}
</style>
