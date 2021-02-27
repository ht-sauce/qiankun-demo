import http from './http.js'

import API from "@/api/index"
import storage from "./storage.js";
const SERVICE = "robot-data";

function getUrl(apiUrl) {
  return http.formatUrl(SERVICE, apiUrl);
}

export function queryRobotData(param = {}) {
  return http.post(getUrl(API.robot_data.query), param);
}

export function queryInteract(param = {}) {
  return http.post(getUrl(API.robot_data.queryInteract), param);
}

export function addDownTask(param = {}) {
  return http.post(getUrl(API.robot_data.addDownTask), param);
}

export function deleteDownTask(param = {}) {
  return http.post(getUrl(API.robot_data.deleteDownTask), param);
}

export function queryDownTask(param = {}) {
  return http.post(getUrl(API.robot_data.queryDownTask), param);
}

/*
 * 首页数据
 */
export function indexData(param = {}) {
  return http.post(getUrl(API.robot_data.index), param);
}

/*
 * 交互统计
 */
export function interactStatistics(param = {}) {
  return http.post(getUrl(API.robot_data.interactStatistics), param);
}

// 产品列表统计
export function queryProdOverView(params = {}) {
  return http.post(getUrl(API.robot_data.queryProdOverView), Object.assign({}, params, {
    token: storage.getToken("token")
  }))
}

// 产品详情统计数据
export function queryProdOverviewDetail(params = {}) {
  return http.post(getUrl(API.robot_data.queryProdOverviewDetail), params)
}
// 用户统计
export function queryCustomerStatistic(params = {}) {
  return http.post(getUrl(API.robot_data.queryCustomerStatistic), params)
}
// 分布
export function queryDistributionStatistic(params = {}) {
  return http.post(getUrl(API.robot_data.queryDistributionStatistic), params)
}