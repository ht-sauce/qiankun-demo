import vuex from '@/store/index'

// 口令封装处理
const handlerToken = (url = '') => {
  const token = vuex.state.userInfo.token
  url = `/${url}?token=${token}`
  return url
}

export {
  handlerToken
}
