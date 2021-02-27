
// 消息提示
const Tips = {
  success({ title = '', msg = '' }) {
    Vue.prototype.$notify({
      title,
      message: msg,
      type: 'success',
    })
  },
  error({ title = '', msg = '' }) {
    Vue.prototype.$notify({
      title,
      message: msg,
      type: 'error',
    })
  },
}

export default Tips
