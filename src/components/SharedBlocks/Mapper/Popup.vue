<template>
  <div class="popup-container" :style="{top: styles.top + 'px', left: styles.left + 'px', opacity: styles.opacity, 'z-index': (styles.opacity === 0) ? -99 : 99}" id="popup">
    <div class="section">
      <div class="form-group">

        <div class="form-row">
          <h5 class="text-blue">
            <span>{{ activeObject.data.name }}</span> <span class="label label-primary pull-right">{{ (activeObject.data.type == 10) ? '中岛柜' : '背柜：' + wallCupboardName }}</span>
          </h5>
          <small>{{ shopName }}</small>
        </div>

        <div class="margin"></div>

        <div class="form-row">
          <div class="pull-left">
            <button class="reset" @click="showGoodsList">
              编辑商品摆放
            </button>
          </div>
          <div class="pull-right">
            <span class="text-muted" v-if="this.activeObject.dirty">未保存</span>
            <button class="save" @click="save" :disabled="loading">
              <i class="fa fa-spinner fa-spin" v-if="loading"></i> 保存
            </button>
          </div>
        </div>

        <div class="clear"></div>

        <div class="form-row margin-top">
          <div v-if="!skuGroup || skuGroup.length === 0">
            <p class="text-muted">尚未划分商品可摆放商品的区域，请在「店面布局图」工具中绘制</p>
          </div>

          <div v-for="sg in skuGroup" :key="sg.id" v-else>
            <div class="select-none mouse-default">
              <ul class="list-group" v-if="!sg.sku || sg.sku.length === 0">
                <li class="list-group-item">
                  尚未划分商品可摆放商品的区域，请在「店面布局图」工具中绘制
                </li>
              </ul>
              <ul class="list-group" v-for="sku in sg.sku" :key="sku.id" v-else>
                <li class="list-group-item" v-if="!sku.item_ids || sku.item_ids.length === 0">
                  此区域尚未摆放商品
                </li>
                <Dragabble v-model="sku.item_ids" @end="onMovedItemIds(sku.item_ids)" v-else>
                  <transition-group>
                    <li v-for="good_id in sku.item_ids" :key="good_id" class="list-group-item">{{ getGoodById(good_id).name }}</li>
                  </transition-group>
                </Dragabble>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Dragabble from 'vuedraggable'

export default {
  props: ['styles', 'activeObject'],
  components: {
    Dragabble
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('lbPlan', [
      'getShopByPlanId'
    ]),
    ...mapGetters('mbGoods', [
      'getGoodById'
    ]),
    shopName () {
      let shop = this.getShopByPlanId(this.$route.params.id)
      if (shop && shop.name) {
        return shop.name
      } else {
        return ''
      }
    },
    skuGroup () {
      return this.activeObject.data.sku_group
    },
    wallCupboardName () {
      let name = ''
      if (this.activeObject && this.activeObject.data.sku_group && this.activeObject.data.sku_group[0].name) {
        name = this.activeObject.data.sku_group[0].name
      }
      return name
    },
    goodName (id) {
      let name = ''
      let good = this.getGoodsById(id)
      if (good) {
        name = good.name
      }
      return name
    }
  },
  watch: {
    activeObject (after) {
      if (this.activeObject && this.activeObject.data) {
        let aObj = this.activeObject.data
        this.selectedObjectType = aObj.type
        this.reposition()
      }
    },
    'styles.opacity' (after) {
      if (after > 0) {
        this.reposition()
      }
    }
  },
  methods: {
    ...mapActions('lbSku', [
      'setActiveSku',
      'updateItemIds'
    ]),
    reposition () {
      let pTop = document.getElementById('popup').parentNode.parentNode.getBoundingClientRect().top
      setTimeout(() => {
        let b = document.getElementById('popup').getBoundingClientRect()
        let bottom = b.top + b.height - pTop
        if (bottom > 490) {
          this.styles.top = 10
        }
      }, 150)
    },
    showGoodsList () {
      if (this.activeObject.data.type === 10) {
        this.setActiveSku(this.activeObject.data.sku_group[0].sku[0])
        window.$('#goodslistmodal').modal({
          keyboard: false,
          backdrop: 'static'
        })
      } else if (this.activeObject.data.type === 20) {
        window.$('#skugroupviewmodal').modal({
          keyboard: false,
          backdrop: 'static'
        })
      }
    },
    onMovedItemIds (itemIds) {
      this.activeObject.dirty = true
    },
    async save () {
      // 仅更新 item_ids 字段
      this.loading = true
      if (!this.activeObject) return false
      await this.activeObject.data.sku_group.forEach(async sg => {
        await sg.sku.forEach(async sku => {
          await this.updateItemIds({ id: sku.id, item_ids: sku.item_ids })
        })
      })
      this.$zydialog('成功保存架上商品')
      this.activeObject.dirty = false
      this.loading = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      //
    })
  }
}
</script>

<style lang="scss" scoped>
@import './popup.scss';
</style>
