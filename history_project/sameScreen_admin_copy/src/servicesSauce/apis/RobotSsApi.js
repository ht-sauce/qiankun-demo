import vuex from '@/store/index'

const RobotSsApi = (ajax, config) => {
  return {
    // 物料增删改查
    materiel: {
      query: opt =>
        ajax({
          url: `/complexSpeechSkill/queryMaterialDetail`,
          method: 'get',
          ...opt,
        }),
      queryOne: opt =>
        ajax({
          url: `/material/${opt.id}`,
          method: 'get',
          ...opt,
        }),
      del: opt =>
        ajax({
          url: `/material/${opt.id}`,
          method: 'delete',
          ...opt,
        }),
      list: opt =>
        ajax({
          url: `/material`,
          method: 'get',
          ...opt,
        }),
      add: opt =>
        ajax({
          url: `/complexSpeechSkill/addMaterial`,
          method: 'post',
          ...opt,
        }),
      update: opt =>
        ajax({
          url: `/complexSpeechSkill/modifyMaterial`,
          method: 'post',
          ...opt,
        }),
      // 物料发布
      release: opt =>
        ajax({
          url: `/material/${opt.data.id}/${opt.data.status}`,
          method: 'post',
          ...opt,
        }),
    },
    // QA问题增删改查
    QaGroup: {
      add: opt =>
        ajax({
          url: `/material/addQuestionGroup`,
          method: 'post',
          ...opt,
        }),
      del: opt =>
        ajax({
          url: `/complexSpeechSkill/delQuestionGroup`,
          method: 'post',
          ...opt,
        }),
      // 更新或者添加分组关系
      updateOrAdd: opt =>
        ajax({
          url: `/complexSpeechSkill/buildQuestionGroupRel`,
          method: 'post',
          ...opt,
        }),
      // 分组列表
      list: opt =>
        ajax({
          url: `/complexSpeechSkill/queryQuestionGroupList`,
          method: 'get',
          ...opt,
        }),
      // 查询分组关系
      query: opt =>
        ajax({
          url: `/complexSpeechSkill/queryQuestionGroupRelList`,
          method: 'get',
          ...opt,
        }),
    },
    // 物料配置信息
    ConfigMeterial: {
      query: opt =>
        ajax({
          url: `/meterial/config/query`,
          method: 'post',
          ...opt,
        }),
      addOrUpdate: opt =>
        ajax({
          url: `/meterial/config/addUpdate`,
          method: 'post',
          ...opt,
        }),
    },
    // 话术全局配置
    GlobalConfig: {
      update: opt =>
        ajax({
          url: `/global/uploadGlobalConfigInfo`,
          method: 'post',
          ...opt,
        }),
      query: opt =>
        ajax({
          url: `/global/downloadGlobalConfigInfo/${vuex.state.userInfo.corpid}/${opt.speechSkillId}`,
          method: 'PUT',
          ...opt,
        }),
    },
    queryDramaConfigList: code =>
      ajax({
        url: `/videoBase/queryDramaConfigList`,
        method: 'post',
        data: {
          videoCode: code,
          status: 1,
        },
      }),
    queryVideoListAll: opt =>
      ajax({
        url: `/videoBase/queryVideoListByPage`,
        method: 'post',
        ...opt,
      }),
  }
}

export default RobotSsApi
