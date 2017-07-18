<template>
  <div class="modal fade" tabindex="-2" role="dialog" id="skugroupviewmodal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="pull-left">商品陈列 - {{ shopName }} - 背柜：{{ activeObject.data.name }}</h5>
          <button class="btn btn-flat btn-sm btn-default pull-right" @click="hideModal">关闭</button>
        </div>

        <div class="modal-body">
          <Painter :sgid="sgid"></Painter>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Painter from './skuGroupViewPainter'

export default {
  props: ['activeObject'],
  components: {
    Painter
  },
  computed: {
    ...mapGetters('lbPlan', [
      'getShopByPlanId'
    ]),
    sgid () {
      try {
        return this.activeObject.data.sku_group[0].id
      } catch (err) {
        return 0
      }
    },
    shopName () {
      let shop = this.getShopByPlanId(this.$route.params.id)
      if (shop && shop.name) {
        return shop.name
      } else {
        return ''
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    hideModal () {
      window.$('#skugroupviewmodal').modal('hide')
    },
    cancel () {
      this.hideModal()
    },
    save () {
      this.hideModal()
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
</style>
