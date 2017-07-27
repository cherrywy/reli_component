<template>
  <div class="container" :style="{top: styles.top + 'px', left: styles.left + 'px', opacity: styles.opacity, 'z-index': (styles.opacity === 0) ? -99 : 99}">
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
            关联到店铺：{{shopName}}
          </label>
        </div>

        <div class="form-row">
          关联类型：
          <label>
            <input type="radio" value="show_case" v-model="selectedObjectType"> 展柜
          </label>
          <label>
            <input type="radio" value="aisle" v-model="selectedObjectType"> 通道
          </label>
        </div>

        <div class="form-row" v-if="selectedObjectType === 'show_case'">
          关联对象：
          <template v-for="counter in counters">
            <label>
              <input type="checkbox" :value="counter.id.toString()" v-model="selectedCounters"> {{ counter.data.name }}
            </label>
          </template>
        </div>

        <div class="form-row" v-if="selectedObjectType === 'aisle'">
          关联对象：
          <template v-for="aisle in aisles">
            <label>
              <input type="checkbox" :value="aisle.id.toString()" v-model="selectedAisles"> {{ aisle.data.name }}
            </label>
          </template>
        </div>

        <transition name="fade">
          <div class="form-row" v-if="notify">
            <span class="text-danger">{{ notify }}</span>
          </div>
        </transition>
        
      </div>
    </div>

    <div class="section float-right">
      <transition name="fade">
        <i class="spinner fa fa-spin fa-spinner" v-show="spin"></i>
      </transition>
      <div class="float-right">
        <button class="reset" @click="resetSkewRotate">重置倾斜和旋转</button>
        <button class="remove" @click="removeObject">删除</button>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: ['styles', 'spin', 'shopName', 'shopId', 'counters', 'aisles', 'activeObject'],
  components: {},
  data () {
    return {
      selectedCounters: [],
      selectedAisles: [],
      selectedObjectType: 'show_case',
      notify: ''
    }
  },
  computed: {
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
      if (this.activeObject && this.activeObject.counterData) {
        this.validate()
        let aObj = this.activeObject.counterData
        this.$data.selectedObjectType = aObj.object_type
        if (aObj.object_type === 'show_case') {
          this.$data.selectedCounters = aObj.object_ids
          this.$data.selectedAisles = []
        } else if (aObj.object_type === 'aisle') {
          this.$data.selectedAisles = aObj.object_ids
          this.$data.selectedCounters = []
        } else {
          this.$data.selectedObjectType = 'show_case'
          this.$data.selectedCounters = aObj.object_ids
          this.$data.selectedAisles = []
        }
      }
    },
    selectedCounters (after) {
      this.validate()
      this.updateCounter()
    },
    selectedAisles (after) {
      this.validate()
      this.updateCounter()
    },
    selectedObjectType (after) {
      this.validate()
      this.updateCounter()
    }
  },
  methods: {
    validate () {
      if (this.$data.selectedObjectType === 'show_case' && this.$data.selectedCounters.length === 0) {
        this.$data.notify = '请勾选要关联的展柜'
      } else if (this.$data.selectedObjectType === 'aisle' && this.$data.selectedAisles.length === 0) {
        this.$data.notify = '请勾选要关联的通道'
      } else {
        this.$data.notify = ''
      }
    },
    resetSkewRotate () {
      this.$bus.$emit('resetSkewRotate')
    },
    removeObject () {
      this.$bus.$emit('removeObject')
    },
    updateCounter () {
      let updateType = {
        field: 'counterData.object_type',
        value: this.$data.selectedObjectType
      }
      let updateIds = {
        field: 'counterData.object_ids',
        value: []
      }
      if (this.$data.selectedObjectType === 'show_case') {
        updateIds.value = this.$data.selectedCounters
      } else if (this.$data.selectedObjectType === 'aisle') {
        updateIds.value = this.$data.selectedAisles
      } else {
        alert('错误：未知关联类型，请刷新页面后重试')
        return false
      }
      let params = [updateIds, updateType]
      this.$bus.$emit('updateActiveObject', params)
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.text-danger {
  color: #f44141;
}

.container {
  width: 400px !important;
  font-size: 11px;
  padding: 6px 8px 8px 8px;
  background: #ffffff;
  border: 2px solid #4286f4;
  border-radius: 5px;
  position: absolute;
  transition: all .2s;
  min-width: 170px;
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;

  .section {
    width: 100%;

    .form-group {
      .form-row {
        select {
          outline: none;
        }
      }

      .form-row:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    .remove {
      color: #f44141;
      background: #ffffff;
      border: 1px solid #f44141;
      border-radius: 4px;
      outline: none;
    }

    .remove:active {
      outline: none;
      color: #ffffff;
      background: #f44141;
    }

    .reset {
      color: #e29b0c;
      background: #ffffff;
      border: 1px solid #e29b0c;
      border-radius: 4px;
      outline: none;
    }

    .reset:active {
      outline: none;
      color: #ffffff;
      background: #e29b0c;
    }

    .spinner {
      transition: all .3s;
    }
  }

  .section:not(:last-child) {
    margin-bottom: 20px;
  }

  .float-right {
    float: right;
  }
}
</style>
