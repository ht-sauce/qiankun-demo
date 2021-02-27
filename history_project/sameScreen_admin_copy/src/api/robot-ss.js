import http from './http.js'

import API from "@/api/index"

const SERVICE = "robot-ss";

function getUrl(apiUrl) {
	return http.formatUrl(SERVICE, apiUrl);
}
//查询产品列表
export function queryProductListByPage(param = {}) {
	return http.get(getUrl(API.robot_ss.queryProductListByPage), param);
}
//修改状态
export function modifyStatus(id, status) {
	return http.post(getUrl(API.robot_ss.modifyStatus.replace("{id}", id).replace("{status}", status)));
}
//新增产品
export function createProduct(param = {}) {
	return http.put(getUrl(API.robot_ss.createProduct), param);
}
//修改产品
export function modifyProduct(param = {}) {
	return http.patch(getUrl(API.robot_ss.modifyProduct), param);
}

//删除产品
export function delProduct(id) {
	return http.delete(getUrl(API.robot_ss.delProduct.replace("{id}",id)))
}

//查询产品分类
export function queryType(param = {}) {
	return http.get(getUrl(API.robot_ss.queryType), param);
}
//创建产品分类
export function createType(param = {}) {
	return http.put(getUrl(API.robot_ss.createType), param);
}
//删除产品分类
export function delType(id) {
	return http.delete(getUrl(API.robot_ss.delType.replace("{id}", id)));
}
//查询物料
export function queryMaterial(param = {}) {
	return http.get(getUrl(API.robot_ss.queryMaterial), param);
}
//查询对应的销售人员数
export function getProductUserRelList(id) {
	return http.post(getUrl(API.robot_ss.getProductUserRelList.replace("{id}", id)))
}
//提交相应的人数
export function batchModifyProductUserRel(operationType,param = {}) {
	return http.post(getUrl(API.robot_ss.batchModifyProductUserRel.replace("{operationType}", operationType)), param);
}
//重新排序
export function reorder(id, ord) {
	return http.patch(getUrl(API.robot_ss.reorder.replace("{id}", id).replace("{ord}", ord)));
}

//查询用户中心的产品管理
export function getProductUserList(username) {
	return http.get(getUrl(API.robot_ss.getProductUserList.replace("{username}", username)));
}

//查询用户中心的产品管理
export function queryAllProductList(param = {}) {
	return http.get(getUrl(API.robot_ss.queryAllProductList),param);
}






