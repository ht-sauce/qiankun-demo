import vuex from '@/store'
import router from '@/router'
import service from '@/services'
import { ElMessage } from 'element-plus'
// 退出登陆
async function loginOut(orgid: number) {
  try {
    await service.UserApi.login.out({ orgid })
    vuex.commit('clear_data')
    router.replace('/login')
    return Promise.resolve()
  } catch (e) {
    return Promise.reject(e)
  }
}
// 轮询权限

class PollingAuth {
  orgid: number
  timeout: number
  constructor({ orgid, time = 5000 }: { orgid: number; time?: number }) {
    this.orgid = orgid
    this.timeout = time
  }
  timeint: number = 0
  runing: boolean = false
  start() {
    try {
      const orgid = this.orgid
      const timeout = this.timeout

      if (!orgid) return null

      this.runing = true

      let result: any
      let pollingAuthIn = false // 是否接口请求中

      const authquery = () => {
        if (!this.runing) return null
        this.timeint = window.setInterval(async () => {
          try {
            pollingAuthIn = true
            if (pollingAuthIn) result = await service.UserApi.login.pollingAuth({ error: false })
            // console.log(result)
            pollingAuthIn = false
          } catch (e) {
            pollingAuthIn = false
            // 错误则退出轮询
            ElMessage({ type: 'error', message: '您的账号在别处登陆' })
            clearTimeout(this.timeint)
            loginOut(orgid)
          }
        }, timeout)
      }
      authquery()
    } catch (e) {
      return Promise.reject(e)
    }
  }
  stop() {
    this.runing = false
    this.timeint && clearTimeout(this.timeint)
  }
}

export { loginOut, PollingAuth }
