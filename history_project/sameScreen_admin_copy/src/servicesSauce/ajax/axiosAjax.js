import axios from 'axios'

// axios函数封装
const ajax = ({
  url = '',
  loading = false, //加载拦截
  baseURL = '',
  data = {},
  headers = { 'Content-Type': 'application/json;charset=UTF-8' }, //头部信息处理
  method = 'get',
  timeout = 30 * 1000,
}) => {
  //接口全局加载提示
  let loadingInstance = ''
  if (loading !== false) {
    loadingInstance = Vue.prototype.$loading({
      lock: true,
      text: loading !== true ? loading : '加载中……',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.5)',
    })
  }
  const posts = ['put', 'post', 'patch'] // 使用data作为发送数据主体

  return new Promise((suc, err) => {
    // 预处理数据部分
    method = method.toLocaleLowerCase() //转化为小写

    //console.log(method, posts.includes(method))
    axios({
      url: url,
      baseURL: baseURL,
      headers: headers,
      method: method,
      [posts.includes(method) ? 'data' : 'params']: data,
      timeout: timeout,
    })
      .then(response => {
        loadingInstance && loadingInstance.close()
        suc(response)
      })
      .catch(e => {
        loadingInstance && loadingInstance.close()
        err(e)
      })
  })
}

export { ajax }
