const baseConfig = require('./config/config')

const { publicPath } = baseConfig

const TARGET = 'https://172.16.103.12'

const vueConfig = {
  publicPath: publicPath,
  devServer: {
    port: 8000,
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    },
    proxy: {
      '/user-api': {
        target: TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/nfs": {
        target: TARGET,
      },
      "/organization-api": {
        target: TARGET,
        changeOrigin: true,
        secure: false,
      },
      "/robot-ss-api": {
        target: TARGET,
        changeOrigin: true,
        secure: false,
      },
      '/material-server-api': {
        target: TARGET,
        changeOrigin: true,
        secure: false,
      },
    },
  },
}

module.exports = vueConfig
