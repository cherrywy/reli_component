import api from './../../../api/request'
import _ from 'lodash'

class Goods {
  constructor (params) {
    this.id = params.id
    this.name = params.data.name || '未命名'
    this.brand_name = params.data.brand_name || ''
    this.desc = params.data.desc || ''
    this.title_pics = params.data.title_pics || []
  }
}

const state = {
  list: []
}

const getters = {
  goodsList: state => state.list,
  getGoodById: state => id => _.find(state.list, item => item.id === parseInt(id)) || { name: '读取商品名失败' }
}

const mutations = {
  setList (state, list) {
    if (!Array.isArray(list)) list = [list]
    state.list = list
  },
  resetList (state, value) {
    state.list = []
  },
  insert (state, value) {
    state.list.push(value)
  }
}

const actions = {
  async getGoodsList (ctx, value) {
    let goodsRes = await api.request('/a/goods_display/list.json', { uid: parseInt(ctx.rootState.lbShop.inputUid) })
    if (goodsRes.error_code > 0 || !goodsRes.result) {
      return goodsRes.error_msg || '与服务器通信失败'
    } else {
      let instances = goodsRes.result.map(item => new Goods(item))
      await ctx.commit('setList', instances)
      return true
    }
  },
  async createGood (ctx, value) {
    let params = _.merge({
      uid: parseInt(ctx.rootState.lbShop.inputUid),
      show_case_id: parseInt(ctx.rootState.lbShowcase.activeShowcase.id)
    }, value)
    let res = await api.request('/a/goods_display/new_goods.json', params)
    if (res.error_code > 0 || !res.result) {
      return res.error_msg || '与服务器通信失败'
    } else {
      let instance = new Goods(res.result[0])
      await ctx.commit('insert', instance)
      return true
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
