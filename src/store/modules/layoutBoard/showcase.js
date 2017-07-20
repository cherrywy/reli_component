// import mock from './../../../mockdata/showcase'
import api from './../../../api/request'
import _ from 'lodash'

class Showcase {
  constructor (params) {
    this.id = params.id || null
    this.plan_id = params.data.plan_id
    this.name = params.show_case_name[0].data.name
    this.show_case_type = params.data.show_case_type
    this.original_showcase_id = params.data.show_case_id
    let { width, height, radius } = params.data
    let type = (params.data.type === 0) ? 'rect' : 'circle'
    let left = params.data.x || 0
    let top = params.data.y || 0
    let angle = params.data.angle || 0
    let skewX = params.data.skewx || 0
    let skewY = params.data.skewY || 0
    let startAngle = params.data.startangle || 0
    let endAngle = params.data.endangle || 0
    this.coord = { type, left, top, width, height, radius, startAngle, endAngle, skewX, skewY, angle }
    this.sku_group_ids = params.data.sku_group_ids
  }
}

const state = {
  list: [],
  class: Showcase,
  activeShowcase: null
}

const getters = {
  showcaseList: state => state.list,
  getShowcaseById: state => id => _.find(state.list, { id: parseInt(id) }),
  getShowcaseByPlanId: state => id => state.list.filter(item => item.plan_id === parseInt(id)),
  showcaseClass: state => state.class,
  activeShowcase: state => state.activeShowcase
}

const mutations = {
  setList (state, value) {
    state.list = value
  },
  resetList (state, value) {
    state.list = []
  },
  insertList (state, value) {
    state.list.push(new Showcase(value))
  },
  removeFromList (state, value) {
    _.remove(state.list, value)
  },
  setActiveShowcase (state, value) {
    state.activeShowcase = value
  }
}

const actions = {
  async getList (ctx, value) {
    // let result = await mock.list
    let result = await api.request('/a/plan_show_case/list.json', { plan_id: parseInt(value) })
    let instances = result.map(item => new Showcase(item))
    ctx.commit('setList', instances)
  },
  async resetShowcaseList (ctx, value) {
    await ctx.commit('resetList')
  },
  async setShowcaseList (ctx, value) {
    let instances = value.map(item => new Showcase(item))
    ctx.commit('setList', instances)
  },
  setActiveShowcase (ctx, value) {
    ctx.commit('setActiveShowcase', value)
  },
  // async getShowcaseListByPlanId (ctx, value) {
  //   let result = await mock.list.filter(item => item.data.plan_id === parseInt(value))
  //   if (result.length === 0) {
  //     return false
  //   }
  //   let instances = result.map(item => new Showcase(item))
  //   ctx.commit('setList', instances)
  //   return true
  // },
  async removeShowcase (ctx, value) {
    try {
      let res = await api.request('/a/plan_show_case/remove.json', { id: parseInt(value) })
      if (res.error_code > 0) {
        return res.error_msg || '与服务器通信失败'
      } else {
        await ctx.commit('removeFromList', { id: parseInt(value) })
        return true
      }
    } catch (err) {
      return err.toString()
    }
  },
  async updateShowcase (ctx, object) {
    if (!object.id) {
      return '缺少 id'
    }
    try {
      let params = {
        id: parseInt(object.id),
        name: object.data.name,
        angle: object.angle,
        x: object.left,
        y: object.top,
        width: object.width,
        height: object.height,
        radius: object.radius,
        startangle: object.startAngle,
        endangle: object.endAngle,
        skewx: object.skewX,
        skewy: object.skewY
      }
      let res = await api.request('/a/plan_show_case/update.json', params)
      if (res.error_code > 0 || !res.result || !res.result[0]) {
        return res.error_msg || '与服务器通信失败'
      } else {
        let showcaseRes = res.result[0]
        // 如果是中岛柜，更新 sku 坐标
        if (parseInt(object.data.type) === 10) {
          let skuGroup = object.data.sku_group
          if (skuGroup && skuGroup[0] && skuGroup[0].sku_ids && skuGroup[0].sku_ids[0]) {
            let skuParams = {
              id: parseInt(skuGroup[0].sku_ids[0]),
              uid: parseInt(ctx.rootState.lbShop.inputUid),
              showcase_id: parseInt(ctx.state.activeShowcase.id),
              item_ids: skuGroup[0].sku[0].item_ids,
              angle: object.angle,
              x: object.left,
              y: object.top,
              width: object.width,
              height: object.height,
              radius: object.radius,
              startangle: object.startAngle,
              endangle: object.endAngle,
              skewx: object.skewX,
              skewy: object.skewY
            }
            let skuRes = await api.request('/a/plan_show_case_sku/update.json', skuParams)
            if (skuRes.error_code > 0 || !skuRes.result || !skuRes.result[0]) {
              return res.error_msg || '与服务器通信失败'
            }
          }
        }
        return showcaseRes
      }
    } catch (err) {
      return err.toString()
    }
  },
  async updateShowcaseSkuGroup (ctx, value) {
    try {
      let skuGroup, skus, id, retObj
      if (value.showcaseObj) {
        skuGroup = value.skuGroup || {}
        skus = value.skus || []
        id = value.showcaseObj.id
        value = value.showcaseObj
      }
      let skuGroupIds = []
      if (value.data.sku_group.length > 0) {
        skuGroupIds = value.data.sku_group.map(item => item.id)
      }
      let { skuGroupRes, skuResList } = await ctx.dispatch('createSkuGroupFromTemplate', {
        skus: skus,
        skuGroup: skuGroup
      })
      skuGroupIds = [skuGroupRes.result.id]
      let showcaseRes = await api.request('/a/plan_show_case/update.json', { id: id, sku_group_ids: skuGroupIds })

      retObj = {
        showcase: showcaseRes.result[0],
        skuGroup: skuGroupRes.result.data
      }
      retObj.skuGroup.sku = skuResList
      return retObj
    } catch (err) {
      console.error(err)
      return err.toString()
    }
  },
  async createShowcase (ctx, value) {
    try {
      let skuGroup, skus, retObj
      if (value.showcaseObj) {
        skuGroup = value.skuGroup || {}
        skus = value.skus || []
        value = value.showcaseObj
      }
      let skuGroupIds = []
      if (value.data.sku_group.length > 0) {
        skuGroupIds = value.data.sku_group.map(item => item.id)
      }
      let params = {
        plan_id: value.data.plan_id,
        uid: parseInt(ctx.rootState.lbShop.uids),
        shop_id: parseInt(ctx.rootState.lbShop.selectedShopId),
        show_case_type: parseInt(value.data.type),
        name: value.data.name,
        type: (value.type === 'rect') ? 0 : 1,
        x: value.left,
        y: value.top,
        width: value.width || 0,
        height: value.height || 0,
        radius: value.radius || 0,
        startangle: value.startAngle || 0,
        endangle: value.endAngle || 0,
        skewx: value.skewX || 0,
        skewy: value.skewY || 0,
        angle: value.angle || 0,
        sku_group_ids: skuGroupIds
      }
      let showcaseRes = await api.request('/a/plan_show_case/new.json', params)
      if (showcaseRes.error_code > 0) {
        return showcaseRes.error_msg || '与服务器通信失败'
      } else {
        // 如果是中岛柜且无 sku group 则自动生成
        let id = showcaseRes.result.show_case[0].id
        let itemIds = showcaseRes.result.goods_ids || []
        if (parseInt(value.data.type) === 10 && skuGroupIds.length === 0) {
          // 先建立 sku 以获得 sku id
          let skuParams = {
            uid: parseInt(ctx.rootState.lbShop.inputUid),
            item_ids: itemIds,
            is_template: 0,
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
          // 用 sku id 建立 sku 分组
          let skuGroupParams = {
            name: '中岛柜默认 SKU 分组',
            image_url: 'nopic',
            sku_ids: [skuRes.result.id],
            is_template: 0,
            uid: parseInt(ctx.rootState.lbShop.inputUid)
          }
          let skuGroupRes = await api.request('/a/plan_show_case_sku_group/new.json', skuGroupParams)
          skuGroupIds = [skuGroupRes.result.id]
          showcaseRes = await api.request('/a/plan_show_case/update.json', { id: id, sku_group_ids: skuGroupIds })
          // 兼容前一版的返回格式
          retObj = showcaseRes.result[0]
        } else if (parseInt(value.data.type) === 20 && skuGroup && skus) {
          let { skuGroupRes, skuResList } = await ctx.dispatch('createSkuGroupFromTemplate', {
            skus: skus,
            skuGroup: skuGroup,
            itemIds: itemIds
          })
          skuGroupIds = [skuGroupRes.result.id]
          showcaseRes = await api.request('/a/plan_show_case/update.json', { id: id, sku_group_ids: skuGroupIds })

          retObj = {
            showcase: showcaseRes.result[0],
            skuGroup: skuGroupRes.result.data
          }
          retObj.skuGroup.sku = skuResList
        }
        await ctx.commit('insertList', showcaseRes.result[0])
        return retObj
      }
    } catch (err) {
      console.error(err)
      return err.toString()
    }
  },
  async createSkuGroupFromTemplate (ctx, value) {
    let skus = value.skus
    let skuGroup = value.skuGroup
    let itemIds = value.itemIds || []

    let skuIds = []
    let skuResList = []
    if (skus.length > 0) {
      for (let i = 0; i < skus.length; i++) {
        let sku = skus[i]
        let skuParams = {
          uid: parseInt(ctx.rootState.lbShop.inputUid),
          item_ids: (i === 0) ? itemIds : [],
          is_template: 0,
          type: (sku.coord.type === 'rect' || sku.coord.type === 0) ? 0 : 1,
          x: sku.coord.left,
          y: sku.coord.top,
          width: sku.coord.width || 0,
          height: sku.coord.height || 0,
          radius: sku.coord.radius || 0,
          startangle: sku.coord.startAngle || 0,
          endangle: sku.coord.endAngle || 0,
          skewx: sku.coord.skewX || 0,
          skewy: sku.coord.skewY || 0,
          angle: sku.coord.angle || 0
        }
        let skuRes = await api.request('/a/plan_show_case_sku/new.json', skuParams)
        if (skuRes.error_code === 0 && skuRes.result) {
          skuIds.push(skuRes.result.id)
          skuResList.push(skuRes.result.data)
        }
      }
    }
    let skuGroupParams = {
      name: skuGroup.name,
      image_url: skuGroup.image_url,
      is_template: 0,
      uid: parseInt(ctx.rootState.lbShop.inputUid),
      sku_ids: skuIds
    }
    let skuGroupRes = await api.request('/a/plan_show_case_sku_group/new.json', skuGroupParams)
    return { skuGroupRes, skuResList }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
