const state = {
  opened: false,
  status: "" //电话当前状态 ring、dialing、established
}

const getters = {}

const actions = {
  setOpen({ commit }, status) {
    commit("SET_OPEN", status);
  },
  setStatus({ commit }, status) {
    commit("SET_STATUS", status);
  }
}

const mutations = {
  SET_OPEN(state, status) {
    state.opened = status;
  },
  SET_STATUS(state, status) {
    state.status = status;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}