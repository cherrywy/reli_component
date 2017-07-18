<template>
  <div class="popup-container" :style="{top: styles.top + 'px', left: styles.left + 'px', opacity: styles.opacity, 'z-index': (styles.opacity === 0) ? -99 : 99}" id="popupForSkuGroupView">
    <div class="section">
      <div class="form-group">

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

          <div class="select-none mouse-default">
            <ul class="list-group" v-if="!skuGroup.sku || skuGroup.sku.length === 0">
              <li class="list-group-item">
                尚未划分商品可摆放商品的区域，请在「店面布局图」工具中绘制
              </li>
            </ul>
            <ul class="list-group" v-else>
              <li class="list-group-item" v-if="!skuGroup.sku.item_ids || skuGroup.sku.item_ids.length === 0">
                此区域尚未摆放商品
              </li>
              <Dragabble v-model="skuGroup.sku.item_ids" @end="onMovedItemIds(skuGroup.sku.item_ids)" v-else>
                <transition-group>
                  <li v-for="good_id in skuGroup.sku.item_ids" :key="good_id" class="list-group-item">{{ getGoodById(good_id).name }}</li>
                </transition-group>
              </Dragabble>
            </ul>
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
      if (this.activeObject && this.activeObject.data.sku_group) {
        return this.activeObject.data.sku_group[0]
      } else {
        return {sku: []}
      }
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
      this.setActiveSku(this.skuGroup.sku)
      window.$('#goodslistmodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    },
    onMovedItemIds (itemIds) {
      this.activeObject.dirty = true
    },
    async save () {
      // 仅更新 item_ids 字段
      this.loading = true
      try {
        if (!this.activeObject) return false
        await this.updateItemIds({ id: this.skuGroup.sku.id, item_ids: this.skuGroup.sku.item_ids })
        this.activeObject.dirty = false
        this.$zydialog('成功保存架上商品')
      } catch (err) {
        this.$zydialog('错误：保存失败。' + err.toString())
      } finally {
        this.loading = false
      }
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
