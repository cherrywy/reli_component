<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="canvas" id="canvasForViewerWrapper" ref="canvas">
          <canvas id="stageForViewer"></canvas>
          <!-- <div class="popup">
            <Popup :styles="popup.styles" :activeObject="state.activeObj"></Popup>
          </div> -->
          <transition name="fade">
            <div class="overlay" v-if="ui.initializing">
              <div class="indicator">
                <p><i class="fa fa-spinner fa-spin"></i></p>
                <p>载入中...</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import Fabric from './../Library/FabricEngine'
import Popup from './Popup'

export default {
  props: ['planId'],
  components: {
    Fabric,
    Popup
  },
  computed: {
    ...mapGetters('lbPlan', [
      'getPlanById',
      'currentPlan'
    ]),
    ...mapGetters('lbShowcase', [
      'showcaseList'
    ]),
    ...mapGetters('lbSkuGroup', [
      'getSkuGroupsByShowcaseId'
    ])
  },
  watch: {
    showcaseList (after) {
      this.$nextTick(() => {
        if (Array.isArray(after) && after.length > 0) this.renderObjects(after)
      })
    }
  },
  data () {
    return {
      canvas: {},
      popup: { styles: { top: 0, left: 0, opacity: 0 }, spin: { show: false } },
      state: { activeObj: {data: { name: '', sku_group: [{ image_url: '' }] }}, previousSelected: null },
      ui: { initializing: false },
      coorDefaults: {
        originX: 'center',
        originY: 'center',
        fill: 'rgba(66, 134, 244, 0.7)',
        stroke: 'rgba(255, 255, 255, 0.9)',
        strokeWidth: 1,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        visible: true,
        fillRule: 'nonzero',
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        lockRotation: true,
        selectable: true
      }
    }
  },
  methods: {
    ...mapActions('lbPlan', [
      'setCurrentPlanById'
    ]),
    toggleInitializing (value) {
      this.ui.initializing = value
    },
    hidePopup () {
      this.popup.styles.opacity = 0
    },
    showPopup () {
      this.popup.styles.opacity = 1
    },
    prefetchImage (url) {
      if (this.$data.ui.initializing === false) this.toggleInitializing(true)
      let _this = this
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = function () {
          _this.toggleInitializing(false)
          return resolve({
            height: this.height,
            width: this.width
          })
        }
        img.src = url
      })
    },
    switchActivePlan () {
      this.hidePopup()
      if (this.canvas && this.canvas.dispose) {
        this.canvas.dispose()
      }
      delete this.$data.canvas
      window.$('.canvas-container').remove()
      window.$('#stageForViewer').remove()
      
      let newCanvasDom = document.createElement('canvas')
      newCanvasDom.setAttribute('id', 'stageForViewer')
      window.$('#canvasForViewerWrapper').append(newCanvasDom)
      this.$data.state.activeObj = null
    },
    resetCanvas (bypass) {
      if (this.canvas.getObjects().length > 0) {
        let objects = this.canvas.getObjects()
        while (objects.length !== 0) {
          objects[0].remove()
        }
        this.canvas.deactivateAll().renderAll()
        this.hidePopup()
      }
    },
    renderObjects (list) {
      // 绘制接口中获取的形状
      if (this.canvas && Array.isArray(list) && list.length > 0) {
        this.resetCanvas()
        list.forEach(shape => {
          let coord = _.merge(shape.coord, this.coorDefaults)
          let object = {}
          if (coord.type === 'rect' || coord.type === 0) {
            object = new window.fabric.Rect(coord)
          } else if (coord.type === 'circle' || coord.type === 1) {
            object = new window.fabric.Circle(coord)
          } else {
            return false
          }
          object.set('id', shape.id)
          object.set('data', {
            name: shape.name,
            plan_id: shape.plan_id,
            original_showcase_id: shape.original_showcase_id,
            type: shape.show_case_type,
            sku_group: this.getSkuGroupsByShowcaseId(shape.id)
          })
          this.canvas.add(object)
        })
        this.canvas.deactivateAll().renderAll()
      }
    },
    resetFillAndStroke (event) {
      let object = event.target
      if (object) {
        object.set('fill', 'rgba(66, 134, 244, 0.7)')
        object.set('stroke', 'rgba(255, 255, 255, 0.9)')
      }
    },
    selectionCleared () {
      // 调用 UIWebView 的相关方法
      if (window.clickBlankAction && typeof window.clickBlankAction === 'function') {
        window.clickBlankAction()
      }
    },
    preserveSelection () {
      if (this.canvas && this.state.previousSelected) {
        this.canvas.setActiveObject(this.state.previousSelected)
      }
    },
    async init () {
      if (!this.currentPlan) return false
      this.switchActivePlan()

      let imageURL = this.currentPlan.data.image_url
      let image
      try {
        image = await this.prefetchImage(imageURL)
      } catch (err) {
        console.error(err)
        alert('错误：无法获取图片，请检查图片地址是否正确，并重新载入此页面')
        return false
      }
      let fixedHeight = 500
      image.width = image.width * fixedHeight / image.height
      image.height = fixedHeight

      this.$nextTick(() => {
        delete this.$data.canvas
        this.$data.canvas = new Fabric('stageForViewer', {
          width: image.width,
          height: image.height,
          backgroundImage: imageURL
        })

        this.toggleInitializing(false)

        this.canvas.on('object:selected', event => {
          // 同时更新 popup 层的位置
          if (Array.isArray(event.target._objects)) {
            // 如果是组选择，不显示浮层
            return false
          }
          let object = event.target
          // let bound = object.aCoords
          // this.$data.popup.styles.top = bound.tr.y
          // this.$data.popup.styles.left = document.getElementsByClassName('canvas-container')[0].offsetLeft + bound.tr.x + 15
          this.$data.state.activeObj = object
          // if (!this.canvas.getActiveGroup() && this.$data.state.activeObj) this.showPopup()
          object.set('fill', 'rgba(191, 241, 255, 0.8)')
          object.set('stroke', 'rgba(255, 238, 0, 1)')
          if (this.state.previousSelected !== object) {
            this.resetFillAndStroke({target: this.state.previousSelected})
          }
          this.state.previousSelected = object
          let originalShowcaseId = this.state.activeObj.data.original_showcase_id

          // iPad web view hook
          this.$bus.$emit('viewerSelectedShowcase', this.state.activeObj)
        })

        if (Array.isArray(this.showcaseList) && this.showcaseList.length > 0) {
          this.renderObjects(this.showcaseList)
        }

        this.canvas.on({
          'before:selection:cleared': this.resetFillAndStroke,
          'selection:cleared': this.preserveSelection
        })
      })
    }
  },
  mounted () {
    this.$bus.$emit('viewer.mounted')
  },
  created () {
    this.$bus.$off('initViewer')
    this.$bus.$off('route.update')
    this.switchActivePlan()

    this.$bus.$on('initViewer', async options => {
      await this.setCurrentPlanById(this.planId)
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        if (typeof options.selectable === 'boolean') {
          this.coorDefaults.selectable = options.selectable
        }
      } else {
        this.coorDefaults.selectable = true
      }
      this.init()
    })
    this.$bus.$on('route.update', () => {
      this.switchActivePlan()
    })
  }
}
</script>

<style>
.canvas-container {
  margin: 0 auto;
}
</style>

<style lang="scss" scoped>
@import './../../../styles/global.scss';
@import './index.scss';
</style>
