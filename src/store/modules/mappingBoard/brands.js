import api from './../../../api/request'
// import _ from 'lodash'

class Brand {
  constructor (params) {
    this.id = params.id
    this.name = params.data.name || '未命名'
  }
}

const state = {
  list: []
}

const getters = {
  brandsList: state => state.list
}

const mutations = {
  setList (state, value) {
    state.list = value
  },
  resetList (state, value) {
    state.list = []
  }
}

const actions = {
  async getBrandsList (ctx, value) {
    let res = await api.request('/a/goods_display/brand_list.json', { uid: parseInt(ctx.rootState.lbShop.inputUid) })
    if (res.error_code > 0 || !res.result) {
      return res.error_msg || '与服务器通信失败'
    } else {
      let instances = res.result.map(brand => new Brand(brand))
      await ctx.commit('setList', instances)
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
