import { message } from 'antd'
import debug from 'debug'
import xhr from './xhr'


const ajaxDebug = debug('ajax')
const isMock = process.env.NODE_ENV === 'mock'

// function mockAjax({ url }) {
//   const sampleError = {
//   }
//   return new Promise((resolve, reject) => {
//     let data = {}
//     const replacedUrl = `${url.replace('.json', '.js').split('?')[0]}`
//     const path = `../../../mock/${replacedUrl.slice(1).replace('/', '.')}`
//     console.log('aaaaaaaa', path)
//     try {
//       // TODO
//       /* eslint-disable import/no-dynamic-require */
//       data = require(path)
//       console.log('aaaaaaaa', path)
//       resolve(data)
//     } catch (e) {
//       reject(sampleError)
//     }
//   })
// }

/**
 * @param opts
 * @returns {Promise<any>}
 */
export default function ajax({
  url, type = 'json', data = {}, method = 'get', showSuccessMessage,
}) {
  // if (isMock) return mockAjax({ url })
  return new Promise((resolve, reject) => {
    if (data.type === 'jsonp') {
      /* eslint-disable no-underscore-dangle */
      data.data._t = Date.now()
    }
    if (showSuccessMessage === undefined) {
      // 默认只有post请求才提示消息
      showSuccessMessage = type === 'post'
    }
    return xhr({
      // url,
      url: isMock ? `http://localhost:8989/mock${url}` : url,
      type,
      method,
      data,
      success(json = {}) {
        if (json.success) {
          ajaxDebug('%c%s%c req:%o,res:%o', 'color:green', url, 'color: black', data, json.data)
          if (showSuccessMessage) message.success(json.message || '请求成功')
          resolve(json.data)
        } else {
          ajaxDebug('%c%s%c req:%o,res:%o', 'color:red', url, 'color: black', data, json.data)
          message.error(json.message || json.error)
          reject(new Error(json.message || json.error))
        }
      },
      error(error) {
        const response = JSON.parse(error.io.responseText || '{}')
        const errorMsg = response.error || '系统异常, 操作失败'
        message.error(errorMsg)
        ajaxDebug('%c%s%c req:%o,res:%o', 'color:red', url, 'color: black', data, response)
        reject(new Error(errorMsg))
      },
    })
  })
}
