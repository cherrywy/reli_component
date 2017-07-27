<template>
  <div class="popup-container" :style="{top: styles.top + 'px', left: styles.left + 'px', opacity: styles.opacity, 'z-index': (styles.opacity === 0) ? -99 : 99}" id="popup">
    <div class="section">
      <div class="form-group">

        <div class="form-row">
          类型：
          <label>
            {{ (activeObject && activeObject.data && activeObject.data.type == 10) ? '默认' : '背柜' }}
          </label>
        </div>

        <div class="form-row">
          名称：
          <label>
            {{ activeObject.data.name }}
          </label>
        </div>

        <div class="form-row" v-if="activeObject.data.type === 20">
          背柜：
          <label>
            <img :src="activeObject.data.sku_group[0].image_url" alt="sku_group_image" class="sku-group-image">
            <span>{{ activeObject.data.sku_group[0].name }}</span>
          </label>
        </div>
        
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['styles', 'activeObject'],
  components: {},
  data () {
    return {}
  },
  computed: {
    ...mapGetters('lbPlan', [
      'getShopByPlanId'
    ])
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
    reposition () {
      let pTop = document.getElementById('popup').parentNode.parentNode.getBoundingClientRect().top
      setTimeout(() => {
        let b = document.getElementById('popup').getBoundingClientRect()
        let bottom = b.top + b.height - pTop
        if (bottom > 500) {
          this.styles.top = bottom - 500
        }
      }, 150)
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
