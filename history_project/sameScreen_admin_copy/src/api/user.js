import http from "./http.js";

import API from "@/api/index";

import storage from "./storage.js";
const SERVICE = "user";

function getUrl(apiUrl, urlExtraParam) {
	return http.formatUrl(SERVICE, apiUrl, urlExtraParam);
}

export function login(param = {}) {
	return http.post(getUrl(API.user.login), param);
}

// 查询当前登陆人
export function queryCurrentUser() {
	return http.post(getUrl(API.user.queryCurrentUser));
}

//新增组织
export function addOrganizationInfo(param = {}) {
	return http.post(getUrl(API.user.addOrganizationInfo), param);
}

//查询组织
export function queryAllOrganization(param = {}) {
	return http.post(getUrl(API.user.queryAllOrganization), param);
}
//删除组织
export function deleteOrganizationInfo(param = {}) {
	return http.delete(getUrl(API.user.deleteOrganizationInfo), param);
}

//修组织信息
export function modifyOrganizationInfo(param = {}) {
	return http.post(getUrl(API.user.modifyOrganizationInfo), param);
}

//查询用户列表
export function queryUserListByPage(param = {}) {
	return http.post(getUrl(API.user.queryUserListByPage), param);
}

//新增用户信息
export function createUser(param = {}) {
	return http.put(getUrl(API.user.createUser), param);
}

//新增用户信息
export function modifyUser(param = {}) {
	return http.patch(getUrl(API.user.modifyUser), param);
}

//删除用户信息

export function deleteUser(param = {}) {
	return http.delete(getUrl(API.user.deleteUser), param);
}

//查询组织结构
export function queryAllUserOrganization(param = {}) {
	return http.post(getUrl(API.user.queryAllUserOrganization), param);
}

//获取图片
export function pictureVerify(param = {}) {
	return http.ajax(getUrl(API.user.pictureVerify), "get", param, {
		responseType: "blob",
	});
}

//登录新接口
export function verifyLogin(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.verifyLogin, urlExtraParam), param);
}

//获取短信验证码
export function getSmsCode(param = {}, urlExtraParam) {
	return http.post(getUrl(API.user.getSmsCode, urlExtraParam), param);
}
//统计数据的查询
export function queryUsageAnalysis(username) {
	return http.get(
		getUrl(API.user.queryUsageAnalysis.replace("{username}", username))
	);
}
// 获取权限下拉树列表
export function getRoleslist(params) {
	return http.post(getUrl(API.user.getRoleslist), params, {
		headers: { token: storage.getToken("token") },
	});
}
