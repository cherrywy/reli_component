import axios from 'axios'
import config from '../config'
import store from './../store'

export default {
  async request (uri, data = null, method = 'post') {
    if (!uri) {
      console.error('API function call requires uri argument')
      return
    }

    let url
    if (uri.indexOf('http://') < 0 && uri.indexOf('https://') < 0) {
      url = config.serverDomain + uri
    } else {
      url = uri
    }
    let response
    let timeout = 5000
    if (~uri.indexOf('upload')) timeout = 60 * 10 * 1000 // 10 min
    try {
      response = await axios.request({
        method,
        url,
        data,
        timeout: timeout,
        onUploadProgress (progressEvent) {
          if (~uri.indexOf('upload')) {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            store.dispatch('storage/setUploadProgress', percentCompleted)
          }
        }
      })
      return response.data || {}
    } catch (err) {
      response = err.response || err
      throw response
    }
  }
}
