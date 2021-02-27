const path = require('path')
const target = 'https://172.16.103.12'
//const target = "http://192.168.6.247:8080";

//const target = "https://new.guiji.ai";
const projectName = 'samescreen' // 项目前缀
const publicPath =
  process.env.NODE_ENV === 'production' ? '/samescreen' : 'http://localhost:8001/samescreen'
module.exports = {
  publicPath: '/samescreen',
  outputDir: 'dist',
  devServer: {
    port: 8001,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/organization-api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      '/user-api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      '/robot-ss-api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'bot-core': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'robot-assist-api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'robot-data-api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'robot-outbound-pilot': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      kbr: {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'resource-manage': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      'knowledge-factory': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
      '/fs-router-admin': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  configureWebpack: {
    output: {
      library: `${projectName}-[name]`,
      libraryTarget: 'umd', // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${projectName}`,
    },
  },
  chainWebpack: config => {
    // 静态资源字体打包后404
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
  },
}
