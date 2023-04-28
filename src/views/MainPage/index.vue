<template>
  <section class="T-container T-framework is-vertical">
    <header class="T-header">
      <div class="T-framework-logo-title">
        <svg-icon icon="gw_logo" class="T-framework-logo"></svg-icon>
        <span class="T-framework-title">i锡电综合管理应用</span>
      </div>
      <div class="right-pannel">
        <div class="user-info-container">
          <div class="user-action">
            <div>
              <svg-icon icon="电力公司" class="user-logo"></svg-icon>国网无锡电力
            </div>
            <div>
              <svg-icon icon="江苏电力公司" class="user-logo"></svg-icon>专责人员
            </div>
            <div @click="loginOut" style="cursor: pointer;">
              <svg-icon icon="退出" class="user-logo"></svg-icon>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main class="T-main">
      <el-container class="T-main-container">
        <el-aside :width="isCollapse? '64px' : '200px'" class="T-aSide">
          <div class="T-side-container">
            <el-menu
              :default-active="'1-4-1'"
              class="T-menu"
              :collapse="isCollapse"
              router
              @open="handleOpen"
              @close="handleClose"
            >
              <template v-for="item in menus" :key="item.id">
                <el-sub-menu v-if="item.children" :index="item.path">
                  <template #title>
                    <!-- <el-icon><setting /></el-icon> -->
                    <svg-icon :icon="item.icon" class="svgIcon"></svg-icon>
                    <span style="margin-left: 5px;">{{item.name}}</span>
                  </template>
                  <el-menu-item
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    :index="subItem.path"
                  >
                    <svg-icon :icon="subItem.icon" class="svgIcon"></svg-icon>
                    <span style="margin-left: 5px;">{{subItem.name}}</span>
                  </el-menu-item>
                </el-sub-menu>
                <el-menu-item class="firstMenu" v-if="!item.children" :index="item.path">
                  <svg-icon :icon="item.icon" class="svgIcon"></svg-icon>
                  <span style="margin-left: 5px;">{{item.name}}</span>
                </el-menu-item>
              </template>
            </el-menu>
            <div class="collapse-icon" @click="handleMenu">&lt;</div>
          </div>
        </el-aside>
        <el-main class="mainBox">
          <router-view></router-view>
        </el-main>
      </el-container>
    </main>
    <footer class="T-footer"></footer>
  </section>
</template>

<script>
// import MenuPart from './MenuPart.vue';
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
export default defineComponent({
  name: 'MainPage',
  setup() {
    const isCollapse = ref(false);
    const menus = [
      {
        id: '0',
        name: '首页',
        icon: '首页',
        path: '/dashBoard',
      },
      {
        id: '1',
        name: '应用管理',
        icon: '应用管理',
        path: '/application',
        // children: [
        //   {
        //     id: '1-1',
        //     name: '应用管理',
        //     path: '/application'
        //   },
        // ]
      },
      {
        id: '2',
        name: '系统管理',
        icon: '系统管理',
        path: '/userManagement',
        children: [
          {
            id: '2-1',
            name: '用户管理',
            icon: '用户管理',
            path: '/userManagement'
          },
          {
            id: '2-2',
            name: '角色管理',
            icon: '角色管理',
            path: '/roleManagement'
          },
          {
            id: '2-3',
            name: '菜单管理',
            icon: '菜单管理',
            path: '/menuManagement'
          },
          {
            id: '2-4',
            name: '轮播图管理',
            icon: '轮播图管理',
            path: '/rotationManagement'
          }
        ]
      },
    ]
    const handleMenu = () => {
      isCollapse.value = !isCollapse.value
    }
		const router = useRouter()
		console.log(router, 'router');
		function loginOut() {
			localStorage.clear('createById')
			router.push({path:'/login'})
		}
		onMounted(() => {
			// console.log(this.$route, 'sssssssssss')
		})
    return {
      isCollapse,
      menus,
			loginOut,
      handleMenu
    }
  }
})
</script>

<style lang="scss">
::v-deep {
  .el-menu {
    border-right: none;
  }
}
.T-container {
  display: flex;
  box-sizing: border-box;
  .T-header {
    height: 66px;
    background: #0d8678;
    position: relative;
    padding: 0 15px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .T-framework-logo-title {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 16px;
      text-align: center;
      position: absolute;
      width: auto;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
      z-index: 2;
      .T-framework-logo {
        width: 60px !important;
        height: 60px !important;
        vertical-align: middle;
        line-height: 60px;
      }
      .T-framework-title {
        margin-left: 15px !important;
        color: #fff;
        font-weight: 700;
        white-space: nowrap;
        font-size: 24px;
        display: inline-block;
        vertical-align: middle;
        line-height: 60px;
      }
    }
    .right-pannel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      white-space: nowrap;
      .user-info-container {
        padding-left: 50px;
        position: relative;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 0;
          height: 0;
          bottom: 0;
          left: 0;
          border: 50px solid transparent;
          border-bottom-color: #d4f0ee;
        }
        .user-action {
          display: flex;
          align-items: center;
          border-radius: 0 4px 4px 0;
          height: 50px;
          background: #d4f0ee;
          > div {
            position: relative;
            font-size: 16px;
            padding: 0 8px;
            margin: 0 7px;
            border-bottom-width: 2px;
            border-bottom-style: solid;
            border-bottom-color: transparent;
            .user-logo {
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
          }
        }
      }
    }
  }
  .T-main {
    box-sizing: border-box;
    flex: 1;
    flex-basis: auto;
    padding: 12px 12px 12px 0;
    overflow: hidden;
    &-container {
      height: 100%;
      .mainBox {
        padding: 0 !important;
        padding-left: 12px !important;
      }
      .T-aSide {
        transition: all 0.2s ease 0s;
        box-shadow: 0 0 6px rgba(82, 106, 222, 0.4);
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        overflow: inherit;
        .T-side-container {
          .el-menu-item {
            color: #fff;
          }
          .el-menu-item.is-active {
            color: #0d8678;
            background: #e2f3f0;
          }
          .el-menu-item:hover {
            color: #0d8678;
            background: #e2f3f0;
          }
          .el-sub-menu__title {
            color: #fff;
            &:hover {
              color: #0d8678;
              background: #e2f3f0;
            }
          }
          height: 100%;
          background: #0d8678;
          position: relative;
          overflow: visible;
          .T-menu {
            background: #0d8678;
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
          .el-menu {
            background: #0d8678;
          }
          .el-sub-menu {
            display: grid;
          }
        }
      }
    }
  }
  .T-footer {
    box-sizing: border-box;
    height: 40px;
    background: #fff;
    padding: 0 20px;
    flex-shrink: 0;
  }
}
.T-framework {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.is-vertical {
  flex-direction: column;
}
</style>