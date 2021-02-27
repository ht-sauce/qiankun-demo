const state = {
  tags: [],
  subList: []
}

const getters = {}

const actions = {
  setTags({
    commit
  }, tags) {
    commit("SET_TAGS", tags);
  },
  removeTag({
    commit
  }, id) {
    commit("REMOVE_TAG", id);
  },
  appendTag({
    commit
  }, item) {
    commit("APPEND_TAG", item);
  },
  setSubList({
    commit
  }, subList) {
    commit("SET_SUBLIST", subList);
  },
}

const mutations = {
  SET_TAGS(state, data) {
    state.tags = data;
  },
  REMOVE_TAG(state, id) {
    const index = state.tags.findIndex(e => e.id === id)
    state.tags.splice(index, 1)
  },
  APPEND_TAG(state, item) {
    state.tags.push(item)
  },
  SET_SUBLIST(state, data) {
    state.subList = data;
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}