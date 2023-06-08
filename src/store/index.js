/*
 * @Description: 
 * @Version: 2.0
 * @Autor: hjw
 * @Date: 2023-05-05 20:17:30
 * @LastEditors: hjw
 * @LastEditTime: 2023-05-18 21:21:01
 */
import { createStore } from 'vuex'

export default createStore({
  state: {
    userDetail: null,
    menuTitle: "首页",
    breadcrumb: []
  },
  getters: {
    getUserDetail: state => state.userDetail
  },
  mutations: {
    setUserDetail(state, newData) {
      state.userDetail = newData
    },
    SET_MENU_TITLE(state, menuName) {
      state.menuTitle = menuName
    },
    SET_BREADCRUMB(state, breadcrumb) {
      state.breadcrumb = breadcrumb
    }
  },
  actions: {
  },
  modules: {
  },
})
