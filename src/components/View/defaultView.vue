<template>
  <section class="content">
    <div class="row">
      <div class="col-xs-12">
        <h4>欢迎使用智慧门店管理系统</h4>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12">
        <form class="form-inline">
          <div class="box box-solid">
            <div class="box-header with-border">
              <strong>选择门店</strong>
            </div>
            <div class="box-body">
              <div class="form-group">
                <label for="input-shop-id">
                  门店 id
                </label>
                <input type="text" class="form-control" v-model="_inputShopId" @keyup.enter="_getShop" @focus="focusShopId" @blur="blurShopId" id="input-shop-id">
                <div class="quick-list list-group" v-if="shopIds.length > 0 && showShopIdSelect">
                  <div class="list-group-item" v-for="shop in shopIds" :key="shop.id" @mousedown="setInputShopId(shop.id)">{{ shop.name }}<br><span class="text-muted">{{ shop.id }}</span></div>
                  <div class="clear-list list-group-item text-danger" @mousedown="clearShopIds">
                    清空记录
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="input-uid">
                  用户 id
                </label>
                <input type="text" class="form-control" v-model="_inputUid" @keyup.enter="_getShop" @focus="focusUid" @blur="blurUid" id="input-uid">
                <div class="quick-list list-group" v-if="uids.length > 0 && showUidSelect">
                  <div class="list-group-item" v-for="id in uids" :key="id" @mousedown="setInputUid(id)">{{ id }}</div>
                  <div class="clear-list list-group-item text-danger" @mousedown="clearUids">
                    清空记录
                  </div>
                </div>
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-flat btn-sm" type="button" @click="_getShop" :disabled="loading">载入</button>
                <span v-if="loading">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
              </div>

              <h5 v-if="shopList && shopList[0] && shopList[0].name">
                <span class="label label-success">
                  已载入店铺：{{ shopList[0].name }}
                </span>
              </h5>
              <h5 v-else>
                <span class="label label-default">
                  未载入店铺
                </span>
              </h5>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import _ from 'lodash'
// import api from '../../api'
// import store from '../../store'

export default {
  props: [],
  components: {},
  data () {
    return {
      loading: false,
      showShopIdSelect: false,
      showUidSelect: false
    }
  },
  computed: {
    ...mapGetters('lbShop', [
      'shopList',
      'inputShopId',
      'inputUid',
      'shopIds',
      'uids'
    ]),
    _inputShopId: {
      get () {
        return this.inputShopId
      },
      set (value) {
        this.setInputShopId(value)
      }
    },
    _inputUid: {
      get () {
        return this.inputUid
      },
      set (value) {
        this.setInputUid(value)
      }
    }
  },

  methods: {
    ...mapActions('lbShop', [
      'getShop',
      'setInputShopId',
      'setInputUid',
      'clearShopIds',
      'clearUids'
    ]),
    ...mapActions('lbPlan', [
      'getPlanListByShopId'
    ]),
    dialog () {
      this.$zydialog('hello from the other side')
    },
    async _getShop () {
      this.loading = true
      if (await this.getShop()) {
        // 如果能获取门店数据，立即获取平面图数据
        // 平面图菜单将自动构建
        if (!await this.getPlanListByShopId(this.inputShopId)) {
          this.$zydialog('无法载入门店平面图，请检查门店 id 或添加平面图')
          this.loading = false
        } else {
          this.$zydialog('已载入门店数据')
          this.loading = false
        }
      } else {
        this.$zydialog('无法载入门店数据，请检查门店 id 和 uid 参数')
        this.loading = false
      }
    },
    focusShopId () {
      this.showShopIdSelect = true
    },
    blurShopId () {
      setTimeout(() => {
        this.showShopIdSelect = false
      }, 10)
    },
    focusUid () {
      this.showUidSelect = true
    },
    blurUid () {
      setTimeout(() => {
        this.showUidSelect = false
      }, 10)
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 点击左侧导航跳转时的初始化钩子
    next()
    this.$nextTick(() => {
      //
    })
  },
  mounted () {
    // 直接通过 URL 访问时的初始化钩子
    this.$nextTick(_ => {
      // 兼容 IE 的 event 触发方法
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('resize', true, false)
      window.dispatchEvent(evt)
    })
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.box {
  overflow: visible;
}

.form-group {
  position: relative;

  .quick-list {
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
    -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
    position: absolute;
    top: 40px;
    left: 50px;
    font-size: 13px;

    .list-group-item {
      padding: 8px 12px;
      cursor: pointer;
    }

    .clear-list {
      padding: 1px 12px;
      font-size: 12px;
    }

    .list-group-item:hover {
      background: #f6f6f6;
    }
  }
}
</style>
