import _ from 'lodash'
import api from './../../../api/request'

class Sku {
  constructor (params) {
    this.id = params.id || null
    this.is_template = params.data.is_template
    this.item_ids = params.data.item_ids
    let { type, width, height, radius, startangle, endangle, skewx, skewy } = params.data
    let left = params.data.x
    let top = params.data.y
    let angle = params.data.angle || 0
    this.coord = { type, left, top, width, height, radius, startangle, endangle, skewx, skewy, angle }
  }
}

const state = {
  list: [],
  templateList: [],
  class: Sku,
  activeSku: null
}

const getters = {
  skuList: state => state.list,
  getSkuById: state => id => _.find(state.list, { id: parseInt(id) }),
  skuTemplateList: state => state.templateList,
  getSkuTemplateById: state => id => _.find(state.templateList, { id: parseInt(id) }),
  skuClass: state => state.class,
  activeSku: state => state.activeSku
}

const mutations = {
  setList (state, value) {
    state.list = value
  },
  resetList (state, value) {
    state.list = []
    state.templateList = []
  },
  setTemplateList (state, value) {
    state.templateList = value
  },
  setActiveSku (state, value) {
    // 拷贝传递，使可以取消
    state.activeSku = _.merge({}, value)
  },
  insertItemId (state, value) {
    if (state.activeSku && state.activeSku.item_ids.indexOf(value) < 0) {
      state.activeSku.item_ids.push(value)
    }
  },
  removeItemId (state, value) {
    if (state.activeSku && state.activeSku.item_ids.indexOf(value) >= 0) {
      let index = state.activeSku.item_ids.indexOf(value)
      state.activeSku.item_ids.splice(index, 1)
    }
  },
  updateItemIds (state, value) {
    let { id, itemIds } = value
    let sku = _.find(state.list, item => item.id === id)
    if (sku) {
      sku.item_ids = itemIds
    }
  }
}

const actions = {
  setActiveSku (ctx, value) {
    ctx.commit('setActiveSku', value)
  },
  insertItemId (ctx, value) {
    ctx.commit('insertItemId', value)
  },
  removeItemId (ctx, value) {
    ctx.commit('removeItemId', value)
  },
  async updateItemIds (ctx, value) {
    // sku id
    let id, itemIds
    if (!value || !value.id || !Array.isArray(value.item_ids)) {
      // 未传递合法参数，那么读取 activeSku 里的值
      value = ctx.state.activeSku
    }
    id = value.id
    itemIds = value.item_ids
    let showcaseId = ctx.rootState.lbShowcase.activeShowcase.id
    console.log(ctx.rootGetters)
    let originalShowcaseId = ctx.rootGetters['lbShowcase/getShowcaseById'](showcaseId).original_showcase_id
    if (!id || !Array.isArray(itemIds)) {
      return '数据损坏，请重新载入页面后再次尝试'
    }
    try {
      let res = await api.request('/a/plan_show_case_sku/update.json', {
        id: parseInt(id),
        item_ids: itemIds,
        showcase_id: parseInt(originalShowcaseId),
        uid: parseInt(ctx.rootState.lbShop.inputUid)
      })
      if (res.error_code > 0 || !res.result) {
        return res.error_msg || '与服务器通信失败'
      } else {
        // 同步更新本地状态
        ctx.commit('updateItemIds', { id: parseInt(id), itemIds: itemIds })
        return true
      }
    } catch (err) {
      console.error(err)
      return err.toString()
    }
  },
  setSkuTemplateList (ctx, value) {
    if (Array.isArray(value)) {
      let instances = value.map(item => new Sku(item))
      ctx.commit('setTemplateList', instances)
    }
  },
  async resetSkuList (ctx, value) {
    await ctx.commit('resetList')
  },
  setSkuList (ctx, value) {
    if (Array.isArray(value)) {
      let instances = value.map(item => new Sku(item))
      ctx.commit('setList', instances)
    }
  },
  async addSkuTemplate (ctx, value) {
    let skuParams = {
      uid: parseInt(ctx.rootState.lbShop.inputUid),
      item_ids: [],
      is_template: 1,
      type: (value.type === 'rect' || value.type === 0) ? 0 : 1,
      x: value.left,
      y: value.top,
      width: value.width || 0,
      height: value.height || 0,
      radius: value.radius || 0,
      startangle: value.startAngle || 0,
      endangle: value.endAngle || 0,
      skewx: value.skewX || 0,
      skewy: value.skewY || 0,
      angle: value.angle || 0
    }
    let skuRes = await api.request('/a/plan_show_case_sku/new.json', skuParams)
    if (skuRes.error_code === 0 && skuRes.result) {
      return skuRes.result
    } else {
      return skuRes.error_msg || '与服务器通信失败'
    }
  },
  async updateSkuTemplate (ctx, value) {
    let params = {
      id: value.id,
      x: value.left,
      y: value.top,
      width: value.width || 0,
      height: value.height || 0,
      radius: value.radius || 0,
      startangle: value.startAngle || 0,
      endangle: value.endAngle || 0,
      skewx: value.skewX || 0,
      skewy: value.skewY || 0,
      angle: value.angle || 0
    }
    let skuRes = await api.request('/a/plan_show_case_sku/update.json', params)
    if (skuRes.error_code === 0 && skuRes.result) {
      return skuRes.result[0]
    } else {
      return skuRes.error_msg || '与服务器通信失败'
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
