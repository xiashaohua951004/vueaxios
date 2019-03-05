export default {
  //设置加载状态
  setload({commit}, platefrom) {
    commit(SET_LOAD, platefrom)
  },

  //设置登录状态
  setlogin({commit}, platefrom) {
    commit(SET_LOGIN, platefrom)
  }
}
