import { ajax } from './ajax/axiosAjax'
import Tips from './ajax/tips'
import { handlerToken } from './tools'

// 业务接口
const BaseApi = async (
  opt,
  { prefix = '', codeNum = 0, codeField = 'codeField', msgField = 'message' },
) => {
  const error = opt.error || true // 错误提醒
  const success = opt.success || false // 成功提醒
  //opt.baseURL = ''
  opt.url = handlerToken(prefix + opt.url)
  opt.baseURL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8001/'
  try {
    const result = await ajax(opt)

    const { data } = result
    const code = result.data[codeField]
    const message = result.data[msgField]

    if (code === codeNum) {
      success && Tips.success({ msg: success !== true ? success : message ? message : '成功' })

      return Promise.resolve(data)
    } else {
      error && Tips.error({ msg: error !== true ? error : message ? message : '失败' })

      return Promise.reject(result)
    }
  } catch (e) {
    const message = e[msgField]
    error && Tips.error({ msg: error !== true ? error : message ? message : '失败' })

    return Promise.reject(e)
  }
}
export { BaseApi }
