const API = {
	robot_ss: {
		queryProductListByPage: "/product",
		modifyStatus: "/product/{id}/{status}",
		createProduct:"/product",
		modifyProduct:"/product",
		delProduct:"/product/{id}/",
		queryType:"/type",
		createType:"/type",
		delType:"/type/{id}",
		queryMaterial:'/material',
		getProductUserRelList:'/product/getProductUserRelList/{id}',
		batchModifyProductUserRel:'/product/batchModifyProductUserRel/{operationType}',
		reorder:'/product/ord/{id}/{ord}',
		getProductUserList:'/product/getProductUserList/{username}',
		queryAllProductList:'/product/queryAllProductList/{businessId}',
	},
	robot_data: {
		query: "/session/{businessId}/query",
		queryInteract: "/bot/{businessId}/queryInteract",
		addDownTask: "/task/{businessId}/submit",
		queryDownTask: "/task/{businessId}/query",
		deleteDownTask: "/task/{businessId}/delete",
		index: "/statistics/{businessId}/overview",
		interactStatistics: "/statistics/{businessId}/interact",
		queryProdOverView: "/trackRecord/queryProdOverView",
		queryProdOverviewDetail: "/trackRecord/queryProdOverviewDetail",
		queryCustomerStatistic: "/trackRecord/queryCustomerStatistic", // 用户统计
		queryDistributionStatistic: "/trackRecord/queryDistributionStatistic" //分布
	},
	user: {
		login: "/0/login",
		queryCurrentUser: "/1/get",
		pictureVerify: "/pictureVerify",
		verifyLogin: "/verifyLogin",
		getSmsCode: "/getSmsCode",
		addOrganizationInfo: '/organization/addOrganizationInfo',
		queryAllOrganization: '/organization/queryOrganizationByPage',
		deleteOrganizationInfo: '/organization/deleteOrganizationInfo',
		modifyOrganizationInfo: '/organization/modifyOrganizationInfo',
		queryUserListByPage: '/queryUserListByPage',
		createUser: '/createUser',
		deleteUser: '/deleteUser',
		modifyUser:'/modifyUser',
		queryAllUserOrganization:'/organization/queryAllUserOrganization/{businessId}',
		queryUsageAnalysis:'/queryUsageAnalysis/{username}',
		getRoleslist: '/{businessId}/list'
	}
};

export default API;
