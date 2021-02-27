const vueConfig = {
  publicPath: '/main',
  devServer: {
    port: 8000,
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        //additionalData: `@import '~@/styles/variables.scss';`,
      },
    },
  },
}

module.exports = vueConfig
