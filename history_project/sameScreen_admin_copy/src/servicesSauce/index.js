// 暴露出去的接口地址
import { BaseApi } from './couplingAjax'
import vuex from '@/store/index'

import RobotSsApi from './apis/RobotSsApi'
import File from './apis/File' // 文件上传服务，比较特殊，暂无特殊定义
import Speechcraft from './apis/Speechcraft' // 话术市场

const SERVIVE = vuex.state.config.service
const services = {
  organization: SERVIVE.organization,
  user: SERVIVE.user,
  rs: SERVIVE['robot-ss'],
  MSA: SERVIVE['material-server-api'],
}

// 针对不同服务进行差异化定制
// https://172.16.103.12/robot-ss-api/doc.html#/home
// robot服务接口，根据接口返回格式进行划分
const RS = opt =>
  BaseApi(opt, { prefix: services.rs, codeNum: true, codeField: 'success', msgField: 'message' })
const Sc = opt =>
  BaseApi(opt, { prefix: services.rs, codeNum: 0, codeField: 'code', msgField: 'message' })

export default {
  RS: RobotSsApi(RS, {}),
  File: File(services),
  Sc: Speechcraft(Sc, {}),
}
