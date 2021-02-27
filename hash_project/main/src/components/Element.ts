import { App } from 'vue'
import {
  ElIcon,
  ElDialog, // 弹窗是messagebox的前置条件,所以提前导入
} from 'element-plus'
import locale from 'element-plus/lib/locale'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'

const ElComponents = [ElIcon, ElDialog]
// const plugins = [ElMessageBox]

// 设置语言为中文
locale.use(lang)

const install = (app: App) => {
  // elementUI
  ElComponents.forEach((el) => {
    app.component(el.name, el)
  })
  // plugins.forEach((plugin: any) => {
  //   app.use(plugin)
  // })
}

export default install
