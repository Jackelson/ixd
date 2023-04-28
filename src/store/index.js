import { createStore } from 'vuex'

export default createStore({
  state: {
    userDetail: null
  },
  getters: {
    getUserDetail: state => state.userDetail
  },
  mutations: {
    setUserDetail(state,newData){
      state.userDetail = newData
  }
  },
  actions: {
  },
  modules: {
  },
})
