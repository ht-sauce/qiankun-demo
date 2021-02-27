import Vue from 'vue'

const Store = Vue.observable({
  defaultImg: {
    defaultImgUrl: '',
    defaultWholeImgUrl: ''
  },
  materialCurrent: {}, // 当前物料信息
  interaction: 1, // 当前是否在互动模式下
  imageText: 1, // 是否图文模式
  capabilityPatternDTO: [] //交互设置队列
})

const Mutations = {
  setDefaultImg(data) {
    Store.defaultImg = { ...Store.defaultImg, ...data }
  },
  materialCurrent(data) {
    Store.materialCurrent = data
  },
  setInteraction(data) {
    // 设置是否显示互动设置
    const interactionData = data.filter((item) => {
      return item.isQA == 1
    }).length > 0
    interactionData ? Store.interaction = 1 : Store.interaction = 0
  },
  setImageText(data) {
    Store.imageText = data
  },
  setCapabilityPatternDTO(data) {
    Store.capabilityPatternDTO = data;
  }
}

const Action = {
}

export {
  Store,
  Mutations,
  Action
}
