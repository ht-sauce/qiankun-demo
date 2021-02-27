import { enhanceOpt } from '../couplingAjax'
import { BaseApi } from '../couplingAjax'
import { Services } from '@/store/StoreTypes'

const UserApi = (request: typeof BaseApi, SERVIVE: Services) => {
  return {
    login: {
      pictureVerify: (sessionId: string) => {
        return `/${SERVIVE.userApi}/pictureVerify?sessionId=${sessionId}`
      },
      in: (opt: enhanceOpt, sessionId: string) =>
        request({
          ...opt,
          url: `/singleSignOn?sessionId=${sessionId}`,
          method: 'post',
        }),
      out: (opt: enhanceOpt) =>
        request({
          ...opt,
          url: `/${opt.orgid}/logout`,
          method: 'post',
        }),
      pollingAuth: (opt?: enhanceOpt) => {
        return request({
          ...opt,
          url: `/auth/permission`,
          method: 'get',
        })
      },
    },
  }
}

export default UserApi
