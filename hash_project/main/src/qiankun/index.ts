import { registerMicroApps, start, addGlobalUncaughtErrorHandler } from 'qiankun'
import config from './config'
import { ElMessage } from 'element-plus'

function startQiankun() {
  registerMicroApps(config)
  start()

  addGlobalUncaughtErrorHandler((event) => {
    const { msg } = event as any
    // 加载失败时提示
    if (msg && msg.includes('died in status LOADING_SOURCE_CODE')) {
      ElMessage.error('微应用加载失败，请检查应用是否可运行')
    }
  })
}
export default startQiankun
