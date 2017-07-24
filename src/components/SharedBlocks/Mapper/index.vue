<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="canvas" ref="canvas">
          <canvas id="stage"></canvas>
          <div class="popup">
            <Popup :styles="popup.styles" :activeObject="state.activeObj"></Popup>
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
    <SkuGroupViewModal :activeObject="state.activeObj"></SkuGroupViewModal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import Canvas from './../Library/FabricEngine'
import Popup from './Popup'
import SkuGroupViewModal from './skuGroupViewModal'

export default {
  props: [],
  components: {
    Popup,
    SkuGroupViewModal
  },
  computed: {
    ...mapGetters('lbShowcase', [
      'showcaseList'
    ]),
    ...mapGetters('lbPlan', [
      'getPlanById'
    ]),
    ...mapGetters('lbSkuGroup', [
      'getSkuGroupsByShowcaseId'
    ]),
    plan () {
      return this.getPlanById(this.$route.params.id)
    },
    previewJSON () {
      if (this.canvas) {
        return this.canvas.getObjects()
      }
    },
    objectCount () {
      if (this.previewJSON && Array.isArray(this.previewJSON)) {
        return this.previewJSON.length
      } else {
        return '...'
      }
    },
    hasIssue () {
      return this.$data.issueList && this.$data.issueList.size > 0
    },
    issues () {
      if (this.$data.issueList && this.$data.issueList.size > 0) {
        return [...this.$data.issueList].join('、')
      } else {
        return ''
      }
    },
    hasWarning () {
      return this.$data.warningList && this.$data.warningList.size > 0
    },
    warnings () {
      if (this.$data.warningList && this.$data.warningList.size > 0) {
        return [...this.$data.warningList].join('、')
      } else {
        return ''
      }
    },
    notFreeDraw () {
      return !this.$data.mode.freeDraw
    }
  },
  data () {
    return {
      canvas: null,
      shopData: { shopName: '', counters: [], aisles: [], shapes: [], plans: [] },
      coorDefaults: {
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
      state: { drawing: false, originX: 0, originY: 0, currentObj: null, activeObj: {data: {name: ''}}, activePlanIndex: 0, paperDirty: false, previousSelected: null },
      popup: {
        styles: { top: 0, left: 0, opacity: 0 },
        spin: { show: false },
        unsaved: false
      },
      ui: { debug: false, initializing: true, loading: false, notify: false, noticeText: '' },
      issueList: new Set(),
      warningList: new Set()
    }
  },
  watch: {
    'showcaseList.length' (after, before) {
      if (after > 0 && before === 0 && this.$data.state.paperDirty === false) {
        this.renderObjects()
      }
    },
    '$route.params.id' (after, before) {
      if (after !== undefined && this.$data.state.paperDirty === false) {
        this.init()
      }
    },
    canvas () {
      this.renderObjects()
    },
    'mode.freeDraw' (after) {
      this.canvas.deactivateAll().renderAll()
      if (after) {
        this.hidePopup()
      }
    }
  },
  methods: {
    ...mapActions('lbShowcase', [
      'removeShowcase',
      'updateShowcase',
      'updateShowcaseSkuGroup',
      'createShowcase',
      'setActiveShowcase'
    ]),
    ...mapActions('lbPlan', [
      'setCurrentPlanById',
      'deletePlan'
    ]),
    ...mapActions('lbSkuGroup', [
      'getSkuGroupTemplate',
      'deleteSkuGroup'
    ]),
    prefetchImage (url) {
      if (this.$data.ui.initializing === false) this.toggleInitializing(true)
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
    togglePopupSpinShow (value) {
      this.$data.popup.spin.show = value
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
    renderObjects () {
      // 绘制接口中获取的形状
      if (this.canvas) {
        this.resetCanvas()
        this.showcaseList.forEach(async shape => {
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
            type: shape.show_case_type,
            sku_group: await this.getSkuGroupsByShowcaseId(shape.id)
          })
          this.canvas.add(object)
        })
        this.canvas.deactivateAll().renderAll()
        this.toggleInitializing(false)
      }
    },
    selectAll () {
      if (this.canvas.getObjects().length > 0 && !this.canvas.getActiveGroup()) {
        this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
        this.hidePopup()
      }
    },
    async resetActiveObject () {
      console.log('reset')
      if (!this.canvas) return false
      let object = this.canvas.getActiveObject()
      if (object) {
        object.set('angle', 0)
        object.set('skewX', 0)
        object.set('skewY', 0)
        this.setObjectUnsaved(object)
      }
    },
    async updateActiveObject (params) {
      if (!this.canvas) return false
      if (!params) return false
      if (!Array.isArray(params)) params = [params]
      let object = this.canvas.getActiveObject()
      if (object) {
        let modified = false
        params.forEach(param => {
          let oldValue = _.get(object, param.field)
          if (oldValue !== param.value) {
            _.set(object, param.field, param.value)
            if (!modified) modified = true
          }
        })
        if (modified) this.setObjectUnsaved(object)
      }
    },
    setObjectUnsaved (object) {
      if (!object) return false
      object.set('fill', 'rgba(244, 214, 65, 0.7)')
      object.set('unsaved', true)
      this.$data.popup.unsaved = true
      this.canvas.renderAll()
    },
    setObjectSaved (object) {
      if (!object) return false
      object.set('fill', 'rgba(66, 134, 244, 0.7)')
      object.set('unsaved', false)
      this.$data.popup.unsaved = false
      this.canvas.renderAll()
    },
    removeActiveObject () {
      if (!this.canvas) return false
      let object = this.canvas.getActiveObject()
      if (!object) return false
      if (object.id) {
        this.$zydialog({
          msg: '确实要删除这个展柜吗？',
          desc: '它和柜图将被同时删除,展柜和商品的关联关系将会保留',
          okDanger: true,
          onOk: async () => {
            this.$data.ui.loading = true
            let result = await this.removeShowcase(object.id)
            if (result === true) {
              this.removeObjectFromCanvas(object)
              this.$zydialog('展柜已删除')
            } else {
              this.$zydialog('错误：删除失败。' + result)
            }
            this.$data.ui.loading = false
          }
        })
      } else {
        this.removeObjectFromCanvas(object)
      }
    },
    removeObjectFromCanvas (object) {
      if (object && this.canvas) {
        this.canvas.remove(object)
        this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
        this.canvas.deactivateAll().renderAll()
        this.hidePopup()
      }
    },
    async saveActiveObject () {
      if (!this.canvas) return false
      let object = this.canvas.getActiveObject()
      if (!object) return false
      this.$data.ui.loading = true
      if (object.id) {
        let res = await this.updateShowcase(object)
        if (typeof res === 'string') {
          this.$zydialog('错误：保存失败。' + res)
        } else {
          this.$zydialog('展柜已保存')
          this.setObjectSaved(object)
        }
      } else {
        let res = await this.createShowcase(object)
        if (typeof res === 'string') {
          this.$zydialog('错误：保存失败。' + res)
        } else {
          this.$zydialog('新展柜已保存')
          object.set('id', res.id)
          this.setObjectSaved(object)
        }
      }
      this.$data.ui.loading = false
    },
    async saveActiveObjectFromSkuTemplate (skuGroupId) {
      if (!this.canvas) return false
      let object = this.canvas.getActiveObject()
      if (!object) return false
      this.$data.ui.loading = true
      if (!object.id) {
        // 创建
        let sgTemplate = await this.getSkuGroupTemplate(skuGroupId)
        if (sgTemplate) {
          let res = await this.createShowcase({
            showcaseObj: _.merge({}, object),
            skuGroup: sgTemplate.skuGroup,
            skus: sgTemplate.skus
          })
          if (typeof res === 'string') {
            this.$zydialog('保存展柜并应用模板失败。' + res)
          } else {
            this.$zydialog('新展柜已保存')
            object.set('id', res.showcase.id)
            let data = _.merge({}, object.data)
            data.sku_group = [res.skuGroup]
            object.set('data', data)
            this.setObjectSaved(object)
          }
          this.$data.ui.loading = false
        }
      } else {
        // 更新
        let oldSkuGroupIds = object.data.sku_group.map(item => item.id)
        let sgTemplate = await this.getSkuGroupTemplate(skuGroupId)
        if (sgTemplate) {
          let res = await this.updateShowcaseSkuGroup({
            showcaseObj: _.merge({}, object),
            skuGroup: sgTemplate.skuGroup,
            skus: sgTemplate.skus
          })
          if (typeof res === 'string') {
            this.$zydialog('保存展柜并应用模板失败。' + res)
          } else {
            this.$zydialog('展柜已保存')
            let data = _.merge({}, object.data)
            data.sku_group = [res.skuGroup]
            object.set('data', data)
            this.setObjectSaved(object)
            // 删除旧的 SKU 分组
            if (oldSkuGroupIds) {
              oldSkuGroupIds.forEach(async sgId => {
                await this.deleteSkuGroup(sgId)
              })
            }
            this.$data.ui.loading = false
          }
        }
      }
    },
    hidePopup () {
      this.$data.popup.styles.opacity = 0
    },
    showPopup () {
      this.$data.popup.styles.opacity = 1
    },
    showNewPlanModal () {
      this.$bus.$emit('resetNewPlanForm')
      window.$('#newplanmodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    },
    showUpdatePlanModal () {
      this.$bus.$emit('resetUpdatePlanForm')
      window.$('#updateplanmodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    },
    _deletePlan () {
      let planId = this.$route.params.id
      if (planId) {
        this.$zydialog({
          msg: '确定要删除此平面图吗？',
          desc: '删除后无法恢复',
          okDanger: true,
          onOk: async () => {
            let result = await this.deletePlan(planId)
            if (typeof result === 'string') {
              this.$zydialog('错误：无法删除平面图。' + result)
            } else {
              this.$zydialog('平面图已删除')
              this.$router.push('/home')
            }
          }
        })
      }
    },

    // 保存画布数据到接口
    async saveAll () {
      if (this.hasIssue) {
        alert('画布有错误，请检查')
        return false
      }
      this.$data.ui.loading = true
      let objects = this.previewJSON
      if (!Array.isArray(objects) || objects.length === 0) {
        this.$data.ui.loading = false
        return false
      }
      // 构建异步请求列表
      // let hasError = false
      objects.forEach(async object => {
        if (!object.data.name || (parseInt(object.data.type) === 20 && object.data.sku_group.length === 0)) {
          this.$zydialog('有展柜未填写名称或未关联背柜，请检查')
          // hasError = true
          return false
        }
        if (object.id) {
          // 有坐标 id，调用更新接口
          await this.updateShowcase(object)
          this.setObjectSaved(object)
        } else {
          // 无坐标 id，是新增图形，调用新增接口
          let res = await this.createShowcase(object)
          if (typeof res === 'string') {
            console.error(res)
          } else {
            object.set('id', res.id)
            this.setObjectSaved(object)
          }
        }
      })
      this.$data.ui.loading = false
      this.$zydialog('全部展柜已保存')
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

    async updatePlanImage (imageUrl) {
      if (!this.canvas) return false
      let image
      try {
        image = await this.prefetchImage(imageUrl)
      } catch (err) {
        this.$zydialog('错误：无法获取图片，请检查图片地址是否正确，并重新载入此页面')
        return false
      }
      let fixedHeight = 500
      image.width = image.width * fixedHeight / image.height
      image.height = fixedHeight

      if (image.height) this.canvas.setHeight(image.height)
      if (image.width) this.canvas.setWidth(image.width)

      this.canvas.setBackgroundImage(imageUrl, this.canvas.renderAll.bind(this.canvas), {
        width: image.width,
        height: image.height
      })
      this.toggleInitializing(false)
    },
    resetFillAndStroke (event) {
      let object = event.target
      if (object) {
        object.set('fill', 'rgba(66, 134, 244, 0.7)')
        object.set('stroke', 'rgba(255, 255, 255, 1)')
      }
      this.hidePopup()
    },

    // 画布初始化和事件监听入口
    async init () {
      if (!this.plan) return false

      let imageURL = this.plan.image_url
      let image
      try {
        image = await this.prefetchImage(imageURL)
      } catch (err) {
        this.$zydialog('错误：无法获取图片，请检查图片地址是否正确，并重新载入此页面')
        return false
      }
      let fixedHeight = 500
      image.width = image.width * fixedHeight / image.height
      image.height = fixedHeight

      if (this.$data.canvas && this.$data.canvas.dispose) {
        try {
          this.$data.canvas.dispose()
        } catch (err) {
          //
        }
      }
      this.$data.canvas = {}
      this.$set(this.$data, 'canvas', new Canvas('stage', {
        width: image.width,
        height: image.height,
        backgroundImage: imageURL
      }))

      // 绘图：落笔
      this.canvas.on('mouse:down', event => {
        if (this.$data.mode.freeDraw === true) {
          this.canvas.set('selectionColor', 'transparent')
          this.canvas.set('selectionBorderColor', 'transparent')
          // 固定已有对象
          let objects = this.canvas.getObjects()
          objects.forEach(object => {
            object.set('selectable', false)
          })
          // 执行落笔
          let pointer = this.canvas.getPointer(event.e)
          this.toggleDrawing(true)
          this.$data.state.originX = pointer.x
          this.$data.state.originY = pointer.y
          if (this.$data.mode.type === 'rect') {
            // 绘制矩形
            this.$data.state.currentObj = new window.fabric.Rect({
              left: this.$data.state.originX,
              top: this.$data.state.originY,
              fill: 'rgba(244, 214, 65, 0.7)',
              stroke: 'blue',
              strokeWidth: 1
            })
          } else {
            // 绘制圆形
            this.$data.state.currentObj = new window.fabric.Circle({
              left: this.$data.state.originX,
              top: this.$data.state.originY,
              radius: pointer.x - this.$data.state.originX,
              fill: 'rgba(244, 214, 65, 0.7)',
              stroke: 'blue',
              strokeWidth: 1
            })
          }
          this.$set(this.$data.state.currentObj, 'data', {
            type: 10,
            plan_id: parseInt(this.$route.params.id),
            sku_group: [],
            name: ''
          })
          this.$set(this.$data.state.currentObj, 'id', null)
          this.$set(this.$data.state.currentObj, 'dirty', true)

          this.canvas.add(this.$data.state.currentObj).setActiveObject(this.$data.state.currentObj)
          this.canvas.renderAll()
        }
      })
      // 结束绘图：落笔

      // 绘图：行笔
      this.canvas.on('mouse:move', event => {
        if (this.$data.mode.freeDraw === true && this.$data.state.drawing === true) {
          let pointer = this.canvas.getPointer(event.e)
          if (this.$data.mode.type === 'rect') {
            if (this.$data.state.originX > pointer.x) {
              this.$data.state.currentObj.set({ left: Math.abs(pointer.x) })
            }
            if (this.$data.state.originY > pointer.y) {
              this.$data.state.currentObj.set({ top: Math.abs(pointer.y) })
            }
            this.$data.state.currentObj.set({ width: Math.abs(this.$data.state.originX - pointer.x) })
            this.$data.state.currentObj.set({ height: Math.abs(this.$data.state.originY - pointer.y) })
            this.canvas.renderAll()
          } else if (this.$data.mode.type === 'circle') {
            let radius = Math.max(Math.abs(this.$data.state.originY - pointer.y), Math.abs(this.$data.state.originX - pointer.x)) / 2
            if (radius > this.$data.state.currentObj.strokeWidth) {
              radius -= this.$data.state.currentObj.strokeWidth / 2
            }
            this.$data.state.currentObj.set({ radius: radius })
            if (this.$data.state.originX > pointer.x) {
              this.$data.state.currentObj.set({ originX: 'right' })
            } else {
              this.$data.state.currentObj.set({ originX: 'left' })
            }
            if (this.$data.state.originY > pointer.y) {
              this.$data.state.currentObj.set({ originY: 'bottom' })
            } else {
              this.$data.state.currentObj.set({ originY: 'top' })
            }
            this.canvas.renderAll()
          }
        }
      })
      // 结束绘图：行笔

      // 绘图：提笔
      this.canvas.on('mouse:up', event => {
        if (this.$data.mode.freeDraw === true && this.$data.state.drawing === true) {
          // 恢复选择框的颜色
          this.canvas.set('selectionColor', 'rgba(100, 100, 255, 0.3)')
          this.canvas.set('selectionBorderColor', 'rgba(255, 255, 255, 0.3)')
          // 解除固定已有对象
          let objects = this.canvas.getObjects()
          objects.forEach(object => {
            object.set('selectable', true)
          })
          // 解除正在绘制状态
          this.toggleDrawing(false)
          // 如果未选中连续绘制，解除绘图模式
          if (!this.$data.mode.continuousDraw) this.toggleFreeDraw(false)
          // 如果当前物件的长宽为 0，则自动赋予长或宽
          if (this.$data.state.currentObj.width === 0) {
            this.$data.state.currentObj.width = 30
          }
          if (this.$data.state.currentObj.height === 0) {
            this.$data.state.currentObj.height = 30
          }
          // 对有效物件设定原点坐标（中心）
          this.$data.state.currentObj.set('originX', 'center')
          this.$data.state.currentObj.set('originY', 'center')
          this.$data.state.currentObj.set('top', this.$data.state.currentObj.top + this.$data.state.currentObj.height / 2)
          this.$data.state.currentObj.set('left', this.$data.state.currentObj.left + this.$data.state.currentObj.width / 2)
          // 设置初始化锁
          this.$data.state.paperDirty = true
          // 解决 fabric 新增物件无法被选中的问题
          this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
          this.canvas.deactivateAll().renderAll()
        }
      })
      // 结束绘图：提笔

      // 将 fabric.js 的默认 scale 行为换算成 object 的 resize 行为
      this.canvas.on('object:modified', event => {
        let target = event.target
        if (!target) return false
        if (target.type === 'rect') {
          let scaleX = target.scaleX
          let scaleY = target.scaleY
          target.width *= scaleX
          target.height *= scaleY
          target.scaleX = 1
          target.scaleY = 1
        } else if (target.type === 'circle') {
          target.set('radius', target.radius * Math.max(Math.abs(target.scaleX), Math.abs(target.scaleY)))
          target.scaleX = 1
          target.scaleY = 1
        }

        // 用样式表示物件被修改，提示用户保存
        this.setObjectUnsaved(target)

        let bound = event.target.aCoords
        this.$data.popup.styles.top = bound.tr.y
        this.$data.popup.styles.left = document.getElementsByClassName('canvas-container')[0].offsetLeft + bound.tr.x + 15
        if (!this.canvas.getActiveGroup()) this.showPopup()
      })

      this.canvas.on('object:selected', event => {
        // 同时更新 popup 层的位置
        if (Array.isArray(event.target._objects)) {
          // 如果是组选择，不显示浮层
          return false
        }
        let object = event.target
        let bound = object.aCoords
        this.$data.popup.styles.top = bound.tr.y
        this.$data.popup.styles.left = document.getElementsByClassName('canvas-container')[0].offsetLeft + bound.tr.x + 15
        this.$data.state.activeObj = object
        object.set('fill', 'rgba(191, 241, 255, 0.8)')
        object.set('stroke', 'rgba(255, 238, 0, 1)')
        if (this.state.previousSelected !== object) {
          this.resetFillAndStroke({target: this.state.previousSelected})
        }
        this.state.previousSelected = object
        this.setActiveShowcase(object)
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
  },
  created () {
    this.$bus.$off('initPaintCanvas')
    this.$bus.$on('initPaintCanvas', this.init)
    window.onresize = this.hidePopup
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
