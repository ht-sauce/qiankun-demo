import Vue from 'vue'

const Store = Vue.observable({
  AllVideo: new Map(), // 所有视频，性能优化, 存在数据情况这里取数据
  AllDrama: new Map(), // 所有剧本，性能优化
})

export {
  Store
}
