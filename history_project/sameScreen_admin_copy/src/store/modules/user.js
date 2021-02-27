const state = {
  userName: '',
  permission: null,
}

const getters = {}

const actions = {
  initUser({ commit }, user) {
    commit('INIT', user)
  },
  setPermission({ commit }, permission) {
    commit('PERMISSION', permission)
  },
}

const mutations = {
  INIT(state, info) {
    //state.userName = info && info.user ? info.user.username : "";
    state.userName = info && info.user ? info.user.nickname : ''
  },
  PERMISSION(state, permission) {
    state.permission = permission
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
