// 话术市场服务
import vuex from '@/store'

const Speechcraft = (ajax, config) => {
  const apis = {
    // 查询主话术
    mainInfo: opt =>
      ajax({
        url: `/speechSkill/${vuex.state.userInfo.corpid}/queryById`,
        method: 'post',
        ...opt,
      }),
    // 话术组，一般用于查询子话术
    gourp: opt =>
      ajax({
        url: `/speechSkill/${vuex.state.userInfo.corpid}/querySpeechSkillGroup`,
        method: 'post',
        ...opt,
      }),
    updateSpeechSkillDraft: opt =>
      ajax({
        url: `/speechSkill/draft/${vuex.state.userInfo.corpid}/updateSpeechSkillDraft`,
        method: 'post',
        ...opt,
      }),
    // 新建话术草稿
    newSpeechSkillDraft: opt =>
      ajax({
        url: `/speechSkill/draft/${vuex.state.userInfo.corpid}/newSpeechSkillDraft`,
        method: 'post',
        ...opt,
      }),
    // 查询话术组
    querySpeechSkillGroup: opt =>
      ajax({
        url: `/speechSkill/${vuex.state.userInfo.corpid}/querySpeechSkillGroup`,
        method: 'post',
        ...opt,
      }),
  }
  return apis
}

export default Speechcraft
