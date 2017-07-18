// import mock from './../../../mockdata/plan'
// import skuGroupMock from './../../../mockdata/sku_group'
// import skuMock from './../../../mockdata/sku'
import _ from 'lodash'
import api from './../../../api/request'

class Plan {
  constructor (params) {
    this.id = params.id
    this.name = params.data.name
    this.shop_id = params.data.shop_id
    this.image_url = params.data.image_url
  }
}

const state = {
  list: [],
  current: null,
  class: Plan
}

const getters = {
  planList: state => state.list,
  getPlanById: state => id => _.find(state.list, { id: parseInt(id) }),
  currentPlan: state => state.current,
  getShopByPlanId: (state, getters, rootState, rootGetters) => id => {
    let plan = getters.getPlanById(id)
    if (!plan) return null
    let shops = rootState.lbShop.list
    if (!shops) return null
    let shopId = plan.shop_id
    return _.find(shops, { id: parseInt(shopId) })
  },
  planClass: state => state.class
}

const mutations = {
  setList (state, value) {
    state.list = value
  },
  resetList (state, value) {
    state.list = []
  },
  setCurrent (state, value) {
    state.current = value
  }
}

const actions = {
  // async getList (ctx, value) {
  //   let result = await mock.list
  //   let instances = result.map(item => new Plan(item))
  //   ctx.commit('setList', instances)
  // },
  async getPlanListByShopId (ctx, value) {
    // let result = await mock.list.filter(item => item.data.shop_id === parseInt(value))
    let result = await api.request('/a/plan/list.json', { shop_id: parseInt(value) })
    if (result.error_code > 0 || !result.result || !result.result.plan_list || result.result.plan_list.length === 0) {
      return false
    }
    let instances = result.result.plan_list.map(item => new Plan(item))
    await ctx.commit('setList', instances)
    return true
  },
  async newPlan (ctx, value) {
    let params = _.merge(value, {
      name: value.name,
      image_url: value.image_url,
      shop_id: ctx.rootState.lbShop.inputShopId,
      uid: parseInt(ctx.rootState.lbShop.inputUid)
    })
    let result = await api.request('/a/plan/new.json', params)
    if (result && result.error_code === 0) {
      await ctx.dispatch('getPlanListByShopId', ctx.rootState.lbShop.inputShopId)
      return true
    } else {
      return false
    }
  },
  async updatePlan (ctx, value) {
    if (!value.plan_id) {
      return '缺少平面图 id'
    }
    let result = await api.request('/a/plan/update.json', value)
    if (result && result.error_code === 0 && result.result && result.result[0]) {
      await ctx.dispatch('getPlanListByShopId', ctx.rootState.lbShop.inputShopId)
      return result.result[0]
    } else {
      return result.error_msg || '与服务器通信失败'
    }
  },
  async deletePlan (ctx, value) {
    let result = await api.request('/a/plan/remove.json', { plan_id: parseInt(value) })
    if (result.error_code > 0 || !result.result) {
      return result.error_msg || '与服务器通信失败'
    }
    await ctx.dispatch('getPlanListByShopId', ctx.rootState.lbShop.inputShopId)
    return true
  },
  async setCurrentPlanById (ctx, value) {
    await ctx.dispatch('lbSkuGroup/resetSkuGroupList', null, {root: true})
    await ctx.dispatch('lbSku/resetSkuList', null, {root: true})
    await ctx.dispatch('lbShowcase/resetShowcaseList', null, {root: true})
    await ctx.dispatch('lbSkuGroup/fetchSkuGroupTemplateData', null, {root: true})

    // 获取平面图详情，并提取 showcase、sku_group 和 sku 数据
    let planDetailRes = await api.request('/a/plan/detail.json', { plan_id: parseInt(value) })
    if (planDetailRes.error_code > 0 || !planDetailRes.result || !planDetailRes.result.show_case_plan) {
      console.error('平面图详情接口未返回正确的数据', planDetailRes)
      return false
    }
    await ctx.commit('setCurrent', planDetailRes.result.shop_plan[0])
    let showcase = []
    let skuGroup = []
    let sku = []
    planDetailRes.result.show_case_plan.plan_show_case_info.forEach(sc => {
      showcase.push(_.merge({}, sc.case_plan_info))
      sc.sku_info.show_case_sku.forEach(scs => {
        if (scs.sku_group) {
          skuGroup.push(_.merge({}, scs.sku_group))
        }
        if (scs.sku && Array.isArray(scs.sku)) {
          scs.sku.forEach(innerSku => {
            sku.push(_.merge({}, innerSku))
          })
        }
      })
    })
    await ctx.dispatch('lbSkuGroup/setSkuGroupList', skuGroup, {root: true})
    await ctx.dispatch('lbSku/setSkuList', sku, {root: true})
    await ctx.dispatch('lbShowcase/setShowcaseList', showcase, {root: true})
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
