import _ from 'lodash'
import api from './../../../api/request'

class SkuGroup {
  constructor (params) {
    this.id = params.id || null
    this.name = params.data.name
    this.is_template = params.data.is_template
    this.image_url = params.data.image_url
    this.sku_ids = params.data.sku_ids || []
    this.sku = []
  }
}

const state = {
  list: [],
  templateList: [],
  class: SkuGroup
}

const getters = {
  skuGroupList: state => state.list,
  skuGroupTemplateList: state => state.templateList,
  getSkuGroupsByShowcaseId: (state, getters, rootState, rootGetters) => id => {
    let showcase = rootGetters['lbShowcase/getShowcaseById'](id)
    if (Array.isArray(showcase.sku_group_ids) && showcase.sku_group_ids.length > 0) {
      let skuGroups = []
      showcase.sku_group_ids.forEach(sgId => {
        let data = _.find(state.list, { id: parseInt(sgId) })
        if (data) return skuGroups.push(data)
      })
      if (skuGroups.length > 0) {
        skuGroups.forEach(sg => {
          sg.sku = []
          if (sg.sku_ids && sg.sku_ids.length > 0) {
            sg.sku_ids.forEach(sId => {
              let sku = rootGetters['lbSku/getSkuById'](sId)
              if (sku) sg.sku.push(sku)
            })
          }
        })
      }
      return skuGroups
    } else {
      return []
    }
  },
  getSkuGroupTemplateById: (state, getters, rootState, rootGetters) => id => {
    let result = _.merge({}, _.find(state.templateList, { id: parseInt(id) }))
    if (result && result.sku_ids && result.sku_ids.length > 0) {
      result.sku_ids.forEach(sid => {
        let sku = rootGetters['lbSku/getSkuTemplateById'](sid)
        if (sku) result.sku.push(sku)
      })
    }
    return result
  },
  getSkuGroupById: (state, getters, rootState, rootGetters) => id => {
    let result = _.merge({}, _.find(state.list, { id: parseInt(id) }))
    return result
  },
  skuGroupClass: state => state.class
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
  addTemplate (state, value) {
    state.templateList.push(value)
  }
}

const actions = {
  setSkuGroupTemplateList (ctx, value) {
    if (Array.isArray(value)) {
      let instances = value.map(item => new SkuGroup(item))
      ctx.commit('setTemplateList', instances)
    }
  },
  async resetSkuGroupList (ctx, value) {
    await ctx.commit('resetList')
  },
  async addSkuGroupTemplate (ctx, value) {
    let params = _.merge(value, {
      sku_ids: [],
      is_template: 1,
      uid: parseInt(ctx.rootState.lbShop.inputUid)
    })
    let result = await api.request('/a/plan_show_case_sku_group/new.json', params, 'post')
    if (result && result.error_code === 0) {
      let sg = new SkuGroup(result.result)
      await ctx.commit('addTemplate', sg)
      return true
    } else {
      return false
    }
  },
  getSkuGroupTemplate (ctx, value) {
    let skuGroupTemplate = _.find(ctx.getters.skuGroupTemplateList, {id: parseInt(value)})
    if (!skuGroupTemplate) return false
    // copy the object
    skuGroupTemplate = _.merge({}, skuGroupTemplate)
    let skuTemplate = []
    skuGroupTemplate.sku_ids.forEach(skuId => {
      let template = _.find(ctx.rootGetters['lbSku/skuTemplateList'], {id: skuId})
      if (template) skuTemplate.push(_.merge({}, template))
    })
    return {
      skuGroup: skuGroupTemplate,
      skus: skuTemplate
    }
  },
  async fetchSkuGroupTemplateData (ctx, value) {
    // 获取 SKU 分组模板病提取 SKU 模板
    // let skuGroupTemplate = await skuGroupMock.list.filter(item => item.data.is_template === 1)
    let skuGroupTemplateRes = await api.request('/a/plan_show_case_sku_group/template/list.json')
    if (skuGroupTemplateRes.error_code > 0 || !skuGroupTemplateRes.result || !skuGroupTemplateRes.result.list) {
      console.error('SKU 模板数据获取失败', skuGroupTemplateRes)
      return false
    }
    ctx.dispatch('setSkuGroupTemplateList', _.concat([], skuGroupTemplateRes.result.list))
    let skuTemplate = []
    skuGroupTemplateRes.result.list.forEach(sg => {
      if (sg.sku_data && Array.isArray(sg.sku_data) && sg.sku_data.length > 0) {
        for (let i = 0; i < sg.sku_data.length; i++) {
          skuTemplate.push(_.merge({}, sg.sku_data[i]))
        }
      }
    })
    ctx.dispatch('lbSku/setSkuTemplateList', _.concat([], skuTemplate), {root: true})
  },
  async updateSkuGroupTemplate (ctx, value) {
    let params = value
    let result = await api.request('/a/plan_show_case_sku_group/update.json', params)
    if (result.error_code === 0 && result.result) {
      return result.result[0]
    } else {
      return result.error_msg || '与服务器通信失败'
    }
  },
  async deleteSkuGroup (ctx, value) {
    let result = await api.request('/a/plan_show_case_sku_group/remove.json', { id: parseInt(value) })
    if (result.error_code > 0 || !result.result) {
      return result.error_msg || '与服务器通信失败'
    } else {
      return true
    }
  },
  async addSkuIdsToSkuGroupTemplate (ctx, value) {
    let id = value.id // sku group id
    let skuIds = value.skuIds // array of sku ids
    let skuGroup = _.find(ctx.getters.skuGroupTemplateList, {id: parseInt(id)})
    let newIds = _.concat(skuGroup.sku_ids, skuIds)
    newIds = newIds.filter(id => {
      return id !== undefined && id !== null
    })
    skuGroup.sku_ids = newIds
    let params = {
      id: id,
      sku_ids: newIds
    }
    let res = await api.request('/a/plan_show_case_sku_group/update.json', params)
    if (res.error_code === 0 && res.result) {
      return res.result[0]
    } else {
      return res.error_msg || '与服务器通信失败'
    }
  },
  setSkuGroupList (ctx, value) {
    if (Array.isArray(value)) {
      let instances = value.map(item => new SkuGroup(item))
      ctx.commit('setList', instances)
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
