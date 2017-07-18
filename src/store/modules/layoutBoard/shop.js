// import mock from './../../../mockdata/shop'
import api from './../../../api/request'
import _ from 'lodash'

let lstore
let shopIds = ''
let uids = ''
if (window.localStorage) {
  lstore = window.localStorage
  try { shopIds = parseInt(lstore.getItem('shop_id')) || '' } catch (err) { shopIds = '' }
  try { uids = parseInt(lstore.getItem('uid')) || '' } catch (err) { uids = '' }
}

class Shop {
  constructor (params) {
    this.id = params.id
    this.name = params.data.shop
  }
}

const state = {
  list: [],
  class: Shop,
  // inputShopId: '1272219830442436',
  // inputUid: '1209811640320002'
  shopIds,
  uids,
  // 变量名兼容老逻辑，实际为门店 id 和 uid，取自 localstorage
  inputShopId: shopIds,
  inputUid: uids
}

const getters = {
  shopList: state => state.list,
  shopClass: state => state.class,
  inputShopId: state => state.inputShopId,
  inputUid: state => state.inputUid,
  shopIds: state => state.shopIds,
  uids: state => state.uids
}

const mutations = {
  setList (state, value) {
    if (!Array.isArray(value)) value = [value]
    state.list = value
  },
  resetList (state, value) {
    state.list = []
  },
  setInputShopId (state, value) {
    state.inputShopId = value
  },
  setInputUid (state, value) {
    state.inputUid = value
  },
  insertShopId (state, value) {
    if (!_.find(state.shopIds, { id: parseInt(value.id) })) state.shopIds.push(value)
    if (lstore) lstore.setItem('shop_ids', JSON.stringify(state.shopIds))
  },
  insertUid (state, value) {
    if (state.uids.indexOf(parseInt(value)) < 0) state.uids.push(parseInt(value))
    if (lstore) lstore.setItem('uids', JSON.stringify(state.uids))
  },
  clearShopIds (state, value) {
    state.shopIds = []
    if (lstore) lstore.setItem('shop_ids', null)
  },
  clearUids (state, value) {
    state.uids = []
    if (lstore) lstore.setItem('uids', null)
  }
}

const actions = {
  // async getList (ctx, value) {
  //   let result = await mock.list
  //   let instances = result.map(item => new Shop(item))
  //   ctx.commit('setList', instances)
  // },
  setInputShopId (ctx, value) {
    ctx.commit('setInputShopId', value)
  },
  setInputUid (ctx, value) {
    ctx.commit('setInputUid', value)
  },
  clearShopIds (ctx, value) {
    ctx.commit('clearShopIds')
  },
  clearUids (ctx, value) {
    ctx.commit('clearUids')
  },
  async getShop (ctx, value) {
    if (!ctx.state.inputShopId || !ctx.state.inputUid) {
      return false
    }
    let shopRes = await api.request('/a/shop/show.json', { id: parseInt(ctx.state.inputShopId) })
    if (shopRes.error_code > 0 || !shopRes.result || !shopRes.result.shop || !shopRes.result.shop[0]) {
      return false
    } else {
      let instance = new Shop(shopRes.result.shop[0])
      await ctx.commit('setList', instance)
      await ctx.commit('insertShopId', { id: parseInt(ctx.state.inputShopId), name: instance.name })
      await ctx.commit('insertUid', ctx.state.inputUid)
      return true
    }
    // let result = await _.find(mock.list, { id: parseInt(ctx.rootState.lbShop.inputShopId) })
    // if (!result) {
    //   return false
    // }
    // let instances = new Shop(result)
    // ctx.commit('setList', instances)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
