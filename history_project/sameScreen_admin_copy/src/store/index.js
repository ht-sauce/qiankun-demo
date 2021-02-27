import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate' // 对vuex数据持久化存储，避免独立操作storege

import tree from './modules/tree.js'
import phone from './modules/phone.js'
import user from './modules/user.js'
import setting from './modules/setting.js'
Vue.use(Vuex)

const state = {
  config: null, // 这里的配置文件信息由public下面的config写入
  // 用户信息存储
  userInfo: {
    user: null,
    corpid: null,
    token: null,
  },
}
const InitState = JSON.parse(JSON.stringify(state)) // 保存初始数据
const mutations = {
  // 数据统一修改，避免多操作函数情况，缺陷：无法精细化操作变量，操作方式类似微信小程序操作
  set_data(state, data) {
    for (let key in data) {
      // console.log(typeof data[key])
      if (Array.isArray(data[key])) {
        state[key] = data[key]
      } else if (typeof data[key] === 'object') {
        state[key] = { ...state[key], ...data[key] } // 保证差异更新
      } else {
        state[key] = data[key]
      }
    }
  },
  // vuex清除数据
  clear_data(state) {
    localStorage.clear()
    const stateArr = Object.keys(state)
    stateArr.forEach(key => {
      state[key] = InitState[key]
    })
  },
}

const actions = {}

export default new Vuex.Store({
  modules: {
    tree: tree,
    phone: phone,
    user: user,
    setting,
  },
  state,
  mutations,
  plugins: [
    createPersistedState({
      key: 'sameScreenAdmin', // 增加缓存环境避免冲突
      storage: {
        getItem: key => sessionStorage.getItem(key),
        setItem: (key, value) => sessionStorage.setItem(key, value),
        removeItem: key => sessionStorage.removeItem(key),
      },
    }),
  ],
})
