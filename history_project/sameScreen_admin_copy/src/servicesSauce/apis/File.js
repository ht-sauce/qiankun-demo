// 文件上传不区分服务，根据实际情况进行封装
import { handlerToken } from '../tools'

const File = (config) => {
  const apis = {
    Rs: {
      FileUploadUrl: () => handlerToken(config.rs + '/img')
    }
  }
  return apis
}

export default File
