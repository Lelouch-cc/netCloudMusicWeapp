import Taro from '@tarojs/taro'
import { ApiParams } from '../interface/api'
import { base } from './config'
import { HTTP_STATUS } from '../const'
import { logError } from '../util'

const token: string = ''

export default {
  baseOptions (params: ApiParams, method: string = 'Get'): any {
    let contentType: string = 'application/x-www-form-urlencoded'
    contentType = params.contentType || contentType
    const option: any = {
      isShowLoading: false,
      loadingText: '正在加载...',
      url: base + params.url,
      data: params.data,
      method,
      header: {
        'content-type': contentType,
        'token': token
      },
      success: (res: any): any => {
        if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }
      },
      error: (e: any): any => {

      }
    }
    return Taro.request(option)
  },
  get (url: string, data: object | string = ''): any {
    const option = { url, data }
    return this.baseOptions(option)
  },
  post (url, data, contentType): any {
    const params = { url, data, contentType }
    return this.baseOptions(params, 'POST')
  }
}
