import Service from '@/servicesSauce'
import vuex from '@/store'
// 生成草稿id
async function GenerateDraft(currentData) {
  try {
    const corpid = vuex.state.userInfo.corpid
    // 第一次查询线上话术
    const { speechSkillId } = currentData
    if (!speechSkillId) return Promise.reject('话术id不存在')
    const result = await Service.Sc.mainInfo({
      data: { speechSkillId: speechSkillId },
    })
    const data = result.result.rows[0]
    if (!data) return Promise.reject(result)

    const { draftSpeechSkillId } = data

    // 生成草稿id
    if (!draftSpeechSkillId) {
      const dart = await Service.Sc.newSpeechSkillDraft({
        data: {
          corpId: corpid,
          speechSkillId: speechSkillId,
        },
      })
      // console.log('草稿生成', dart.messageExt)
      data.draftSpeechSkillId = dart.messageExt
    }

    // 还需要查询话术组找到子话术id
    const group = await Service.Sc.querySpeechSkillGroup({
      data: {
        corpId: corpid,
        parentId: data.draftSpeechSkillId,
      },
    })
    const _ChildId = group.result.rows[0].speechSkillId
    // 查询话术组找到子话术id
    data._ChildId = _ChildId
    return Promise.resolve(data)
  } catch (e) {
    return Promise.reject(e)
  }
}

export { GenerateDraft }
