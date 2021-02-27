import './public-path'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'
import storage from '@/api/storage.js'
import { getConfig, getPermission } from '@/api/jsondata.js'
import config from '@/api/config.js'
import './plugins/iview.js'
import { queryCurrentUser } from '@/api/user.js'
import { getQueryParam } from '@/utils/dom.js'
import '@/common/stylus/style.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.prototype._ = _
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.prototype.$config = config
Vue.prototype.$storage = storage
Vue.prototype.$event = new Vue()

// 微应用改造
let instance = null
function render(props = {}) {
  const { container } = props
  // console.log(container.querySelector('#samescreen'))
  function init() {
    console.log(1111)
    instance = new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount(container ? container.querySelector('#samescreen') : '#samescreen')
  }

  Promise.all([getConfig(), getPermission()]).then(values => {
    let conf = values[0]
    console.log(values)
    config.init(conf)
    // 新的配置文件写入方式
    store.commit('set_data', {
      config: conf,
    })
    const token = getQueryParam(window.location.hash, 'token')
    const p = getQueryParam(window.location.hash, 'p')
    if (token) {
      storage.setUserInfo({
        token,
      })
      queryCurrentUser().then(resp => {
        if (!resp.data) {
          new Vue().$alert('您的账户登录已过期，请重新登录', '登录校验', {
            confirmButtonText: '关 闭',
            callback: action => {
              window.close()
            },
          })
        } else {
          let user = resp.data
          storage.setUserInfo({
            user: user,
            corpid: user ? user.organizationId : '',
          })
          if (!p) {
            storage.setPermission({
              menu: ['/speech/design'],
            })
          }
          storage.setUserInfo({
            user: resp.data,
          })
          init()
        }
      })
    } else {
      init()
    }
  })
}
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}
export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}
export async function mount(props) {
  console.log('[vue] props from main framework', props)
  render(props)
}
export async function unmount() {
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
  router = null
}
