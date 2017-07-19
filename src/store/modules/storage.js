import api from './../../api/request'

const state = {
  uploadProgress: 0,
  uploadError: '',
  uploading: false
}

const getters = {
  uploadProgress: state => state.uploadProgress,
  uploadError: state => state.uploadError,
  uploading: state => state.uploading
}

const mutations = {
  setUploadProgress (state, value) {
    state.uploadProgress = value
  },
  setUploadError (state, value) {
    state.uploadError = value || ''
  },
  setUploading (state, value) {
    state.uploading = value || false
  }
}

const actions = {
  setUploadProgress (ctx, value) {
    ctx.commit('setUploadProgress', value)
  },
  async upload (ctx, file) {
    // init uploading states
    await ctx.commit('setUploading', true)
    await ctx.commit('setUploadError', '')
    await ctx.commit('setUploadProgress', 0)
    // fetch a new upload token
    // start to upload
    let formData = new window.FormData()
    formData.append('type', 'image')
    formData.append('pic', file)
    try {
      let result = await api.request('/util/file/upload.json', formData, 'post')
      ctx.commit('setUploading', false)
      return result
    } catch (err) {
      console.error(err)
      ctx.commit('setUploadError', `上传失败，错误码：${err.status}，信息：${err.data.error || '与服务器通信失败'}`)
      ctx.commit('setUploadProgress', 0)
      ctx.commit('setUploading', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
