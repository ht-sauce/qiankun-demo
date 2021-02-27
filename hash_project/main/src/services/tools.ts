import vuex from '@/store/index'

// 口令封装处理
const handlerToken = (url = '') => {
  const token = vuex.state.user.token
  if (url.indexOf('?') != -1) url = `/${url}&token=${token}`
  else url = `/${url}?token=${token}`
  return url
}

export { handlerToken }
