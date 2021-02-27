import vuex from '@/store'
const baseConfig = require('../../config/config')
const { publicPath } = baseConfig
const production = vuex.state.production // 是否生产
const config = [
  {
    name: 'uc',
    entry: `${production ? 'https://172.16.103.12' : '//localhost:7788'}/uc/`,
    container: '#app-qiankun',
    activeRule: publicPath + '/#/uc',
    props: {
      mainPrefix: publicPath,
      vuex,
    },
  },
]

export default config
