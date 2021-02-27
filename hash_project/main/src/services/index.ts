// 暴露出去的接口地址
import { BaseApi, enhanceOpt } from './couplingAjax'
import vuex from '@/store/index'

import userApi from './apis/UserApi'

const SERVIVE = vuex.state.services

// 针对不同服务进行差异化定制
// https://172.16.103.12/user-api/doc.html#/home
const UserApi = (opt: enhanceOpt) =>
  BaseApi(opt, { prefix: SERVIVE.userApi, codeNum: 0, msgField: 'message', codeField: 'code' })

export default {
  UserApi: userApi(UserApi, SERVIVE),
}
