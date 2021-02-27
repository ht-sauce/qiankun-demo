import { ajax, ajxOptions, AxiosResponse } from './ajax/axiosAjax'
import Tips from './ajax/tips'
import { handlerToken } from './tools'

interface enhanceOpt extends ajxOptions {
  error?: boolean | string
  success?: boolean | string
  [key: string]: any // 任意扩展参数
}
// 业务接口
async function BaseApi(
  opt: enhanceOpt,
  { prefix = '', codeNum = 0, codeField = 'codeField', msgField = 'message' } = {},
) {
  const error = opt.error ?? true // 错误提醒
  const success = opt.success ?? false // 成功提醒
  //opt.baseURL = ''
  opt.url = handlerToken(prefix + opt.url)
  try {
    const result = (await ajax(opt)) as AxiosResponse
    const { data } = result as AxiosResponse
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
export { BaseApi, enhanceOpt }
