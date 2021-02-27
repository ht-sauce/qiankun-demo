import { DefineComponent, App } from 'vue'
import Element from './Element'

const GuijiComponents: Array<DefineComponent> = []

const install = (app: App) => {
  // elementUI组件导入
  Element(app)
  // 项目自定义全局组件
  GuijiComponents.forEach((guiji) => {
    app.component(guiji.name, guiji)
  })
}

export default install
