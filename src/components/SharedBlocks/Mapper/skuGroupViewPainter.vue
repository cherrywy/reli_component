<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="canvas" ref="canvasForSkuGroupView">
        <canvas id="stageForSkuGroupView"></canvas>
        <div class="popup">
          <SkuGroupPopup :styles="popup.styles" :activeObject="state.activeObj"></SkuGroupPopup>
        </div>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import Canvas from './../Library/FabricEngine'
import SkuGroupPopup from './skuGroupPopup'

export default {
  props: ['sgid'],
  components: {
    SkuGroupPopup
  },
  computed: {
    ...mapGetters('lbSkuGroup', [
      'getSkuGroupById'
    ]),
    ...mapGetters('lbSku', [
      'getSkuById'
    ]),
    skuGroup () {
      return this.getSkuGroupById(this.sgid)
    },
    previewJSON () {
      if (this.canvas) {
        return this.canvas.getObjects()
      }
    }
  },
  data () {
    return {
      canvas: null,
      shopData: { shopName: '', counters: [], aisles: [], shapes: [], plans: [] },
      defaultAttrs: {
        originX: 'center',
        originY: 'center',
        fill: 'rgba(66, 134, 244, 0.7)',
        stroke: 'rgba(255, 255, 255, 1)',
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
        lockRotation: true
      },
      typeDefs: ['rect', 'circle'],
      mode: { freeDraw: false, continuousDraw: false, type: 'rect' },
      state: { drawing: false, originX: 0, originY: 0, currentObj: null, activeObj: {data: {name: ''}}, activePlanIndex: 0, canvasDirty: false },
      ui: { debug: false, initializing: true, loading: false, notify: false, noticeText: '' },
      popup: {
        styles: { top: 0, left: 0, opacity: 0 },
        spin: { show: false },
        unsaved: false
      },
      removeBtn: { top: 0, left: 0, z: -99 },
      issueList: new Set(),
      warningList: new Set()
    }
  },
  watch: {
    sgid (after, before) {
      this.init()
    },
    canvas () {
      this.renderObjects()
    }
  },
  methods: {
    ...mapActions('lbSku', [
      'addSkuTemplate',
      'updateSkuTemplate'
    ]),
    ...mapActions('lbSkuGroup', [
      'updateSkuGroupTemplate',
      'addSkuIdsToSkuGroupTemplate'
    ]),
    prefetchImage (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = function () {
          return resolve({
            height: this.height,
            width: this.width
          })
        }
        img.src = url
      })
    },
    toggleDebug () {
      this.$data.ui.debug = !this.$data.ui.debug
    },
    toggleInitializing (value) {
      this.$data.ui.initializing = value
    },
    toggleDrawing (value) {
      this.$data.state.drawing = value
    },
    toggleFreeDraw (value) {
      if (value.keyCode && value.keyCode === 67) {
        this.$data.mode.freeDraw = !this.$data.mode.freeDraw
      } else {
        this.$data.mode.freeDraw = value
      }
    },
    toggleContinuousDraw (value) {
      this.$data.mode.continuousDraw = value
    },
    hidePopup () {
      this.$data.popup.styles.opacity = 0
    },
    showPopup () {
      this.$data.popup.styles.opacity = 1
    },
    resetCanvas (bypass) {
      if (this.canvas.getObjects().length > 0) {
        let objects = this.canvas.getObjects()
        while (objects.length !== 0) {
          objects[0].remove()
        }
        this.canvas.deactivateAll().renderAll()
      }
    },
    renderObjects () {
      // 绘制接口中获取的形状
      if (this.canvas) {
        this.resetCanvas()
        this.skuGroup.sku.forEach(async shape => {
          let coord = _.merge(shape.coord, this.defaultAttrs)
          let object
          if (coord.type === 'rect' || coord.type === 0) {
            object = new window.fabric.Rect(coord)
          } else if (coord.type === 'circle' || coord.type === 1) {
            object = new window.fabric.Circle(coord)
          } else {
            return false
          }
          object.set('id', shape.id)
          object.set('data', {
            sku_group: [
              {
                sku: await this.getSkuById(shape.id)
              }
            ]
          })
          this.canvas.add(object)
        })
        this.canvas.renderAll()
      }
    },
    selectAll () {
      if (this.canvas.getObjects().length > 0 && !this.canvas.getActiveGroup()) {
        this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
      }
    },
    async resetActiveObject () {
      let object = this.canvas.getActiveObject()
      if (object) {
        object.set('angle', 0)
        object.set('skewX', 0)
        object.set('skewY', 0)
      }
    },
    async updateActiveObject (params) {
      if (!this.canvas) return false
      if (!Array.isArray(params)) params = [params]
      let object = this.canvas.getActiveObject()
      if (object) {
        params.forEach(param => {
          _.set(object, param.field, param.value)
        })
        object.set('dirty', true)
        // 刷新问题列表（watch previewJSON 可能无法及时更新）
        this.updateIssueList()
        this.canvas.renderAll()
      }
    },

    exitEditMode () {
      if (this.state.canvasDirty) {
        this.$zydialog({
          msg: '变更尚未保存，是否要放弃更改？',
          okDanger: true,
          onOk: () => {
            this.$bus.$emit('skuGroupPaint.editMode.false')
          }
        })
      } else {
        this.$bus.$emit('skuGroupPaint.editMode.false')
      }
    },
    resetFillAndStroke (event) {
      let object = event.target
      if (object) {
        object.set('fill', 'rgba(66, 134, 244, 0.7)')
        object.set('stroke', 'rgba(255, 255, 255, 1)')
      }
      this.hidePopup()
    },

    // 通知文字显示方法
    showNotice (text) {
      this.$data.ui.notify = true
      this.$data.ui.noticeText = text
      setTimeout(() => {
        this.$data.ui.notify = false
        this.$data.ui.noticeText = ''
      }, 2000)
    },

    // 画布初始化和事件监听入口
    async init () {
      if (!this.skuGroup) return false
      this.toggleInitializing(true)

      let imageURL = this.skuGroup.image_url
      let image
      try {
        image = await this.prefetchImage(imageURL)
      } catch (err) {
        alert('错误：无法获取图片，请检查图片地址是否正确，并重新载入此页面')
        return false
      }
      let fixedHeight = 500
      image.width = image.width * fixedHeight / image.height
      image.height = fixedHeight

      if (this.canvas && this.canvas.dispose) {
        this.canvas.dispose()
        this.canvas = null
      }
      this.canvas = new Canvas('stageForSkuGroupView', {
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
        let bound = object.aCoords
        this.$data.popup.styles.top = bound.tl.y
        // let canvasLeft = document.getElementById('stageForSkuGroupView').getBoundingClientRect().left
        let canvasLeft = document.getElementById('stageForSkuGroupView').scrollLeft
        this.$data.popup.styles.left = canvasLeft + bound.tr.x * 2 + 15
        this.$data.state.activeObj = object
        object.set('fill', 'rgba(191, 241, 255, 0.8)')
        object.set('stroke', 'rgba(255, 238, 0, 1)')
        if (this.state.previousSelected !== object) {
          this.resetFillAndStroke({target: this.state.previousSelected})
        }
        this.state.previousSelected = object
        if (!this.canvas.getActiveGroup() && this.$data.state.activeObj) this.showPopup()
      })

      this.canvas.on({
        'before:selection:cleared': this.resetFillAndStroke
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  }
}
</script>

<style lang="scss" scoped>
@import './painter.scss'
</style>
