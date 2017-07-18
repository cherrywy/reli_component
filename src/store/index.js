import Vue from 'vue'
import Vuex from 'vuex'

import ui from './modules/mainframe/ui'
import debug from './modules/mainframe/debug'
import storage from './modules/storage'

import lbPlan from './modules/layoutBoard/plan'
import lbShop from './modules/layoutBoard/shop'
import lbShowcase from './modules/layoutBoard/showcase'
import lbSkuGroup from './modules/layoutBoard/skuGroup'
import lbSku from './modules/layoutBoard/sku'

import mbGoods from './modules/mappingBoard/goods'
import mbBrands from './modules/mappingBoard/brands'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
    debug,
    storage,
    lbPlan,
    lbShop,
    lbShowcase,
    lbSkuGroup,
    lbSku,
    mbGoods,
    mbBrands
  }
})
