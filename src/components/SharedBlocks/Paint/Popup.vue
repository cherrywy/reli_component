<template>
  <div class="popup-container" :style="{top: styles.top + 'px', left: styles.left + 'px', opacity: styles.opacity, 'z-index': (styles.opacity === 0) ? -99 : 99}" id="popup">
    <div class="section">
      <div class="form-group">

        <div class="form-row" v-if="activeObject && activeObject.type === 'circle'">
          <label>
            起始角度
            <input type="range" min="0" max="359" step="1" v-model="startAngle"> {{ (activeObject.startAngle / Math.PI * 180).toFixed(0) }}
          </label>
        </div>

        <div class="form-row" v-if="activeObject && activeObject.type === 'circle'">
          <label>
            结束角度
            <input type="range" min="1" max="360" step="1" v-model="endAngle"> {{ (activeObject.endAngle / Math.PI * 180).toFixed(0) }}
          </label>
        </div>
         
        <div class="form-row">
          <label>
            门店：{{ shopName }}
          </label>
        </div>

        <div class="form-row" v-if="activeObject && activeObject.id">
          类型：
          <label>
            {{ (selectedObjectType == 10) ? '默认' : '背柜' }}
          </label>
        </div>

        <div class="form-row" v-else>
          类型：
          <label>
            <input type="radio" value="10" v-model="selectedObjectType" :disabled="activeObject && activeObject.id"> 默认
          </label>
          &nbsp;
          <label>
            <input type="radio" value="20" v-model="selectedObjectType" :disabled="activeObject && activeObject.id"> 背柜
          </label>
        </div>

        <div class="form-row">
          名称：
          <label>
            <input type="text" v-model="activeObject.data.name" @keyup="validateName" @focus="validate">
          </label>
        </div>

        <div class="form-row" v-if="selectedObjectType == 20">
          背柜：
          <label>
            <button class="save" type="button" @click="editSkuGroup" v-if="activeObject.data.sku_group.length === 0">选择背柜</button>
            <template v-else>
              <img :src="activeObject.data.sku_group[0].image_url" alt="sku_group_image" class="sku-group-image" @click="editSkuGroup">
              <span>{{ activeObject.data.sku_group[0].name }}</span>
            </template>
          </label>
        </div>

        <transition name="fade">
          <div class="form-row" v-if="notify">
            <span class="text-danger">{{ notify }}</span>
          </div>
        </transition>
        
      </div>
    </div>

    <div class="section">
      <button class="remove" @click="removeObject">删除</button>
      <button class="reset" @click="resetSkewRotate">重置</button>
      <div class="float-right">
        <span class="text-muted" v-if="unsaved">未保存</span>
        <button class="save" @click="saveObject"><i class="spinner fa fa-spin fa-spinner" v-if="spin"></i> 保存</button>
      </div>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['styles', 'spin', 'unsaved', 'shopId', 'counters', 'activeObject'],
  components: {},
  data () {
    return {
      selectedObjectType: 10,
      notify: ''
    }
  },
  computed: {
    ...mapGetters('lbPlan', [
      'getShopByPlanId'
    ]),
    shopName () {
      if (!this.activeObject) return ''
      let shop = this.getShopByPlanId(this.activeObject.plan_id)
      if (shop && shop.name) {
        return shop.name
      } else {
        return ''
      }
    },
    endAngle: {
      get () {
        return this.activeObject.endAngle / Math.PI * 180
      },
      set (newValue) {
        this.$bus.$emit('updateActiveObject', {
          field: 'endAngle',
          value: newValue * Math.PI / 180
        })
      }
    },
    startAngle: {
      get () {
        return this.activeObject.startAngle / Math.PI * 180
      },
      set (newValue) {
        this.$bus.$emit('updateActiveObject', {
          field: 'startAngle',
          value: newValue * Math.PI / 180
        })
      }
    }
  },
  watch: {
    activeObject (after) {
      if (this.activeObject && this.activeObject.data) {
        this.validate()
        let aObj = this.activeObject.data
        this.selectedObjectType = aObj.type
        this.reposition()
      }
    },
    selectedObjectType (after, before) {
      this.validate()
      this.updateCounter()
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
    },
    validate () {
      //
    },
    validateName () {
      this.notify = ''
      if (!this.activeObject.data.name || this.activeObject.data.name === '') {
        this.notify = '请输入展柜名称'
      }
      this.$bus.$emit('setObjectUnsaved', this.activeObject)
    },
    resetSkewRotate () {
      this.$bus.$emit('resetSkewRotate')
    },
    removeObject () {
      this.$bus.$emit('removeObject')
    },
    updateCounter () {
      let updateType = {
        field: 'data.type',
        value: this.selectedObjectType
      }

      let params = [updateType]
      this.$bus.$emit('updateActiveObject', params)
    },
    editSkuGroup () {
      if (this.activeObject.data.name.length === 0) {
        this.$zydialog('请先输入展柜名称')
      } else {
        window.$('#skugroupmodal').modal({
          keyboard: false,
          backdrop: 'static'
        })
      }
    },
    saveObject () {
      if (this.activeObject.data.name.length === 0) {
        this.$zydialog('请输入展柜名称')
      } else if (parseInt(this.activeObject.data.type) === 20 && this.activeObject.data.sku_group.length === 0) {
        this.$zydialog('请选择一个背柜')
      } else {
        this.$bus.$emit('saveActiveObject')
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
