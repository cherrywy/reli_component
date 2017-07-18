<template>
  <div class="container">
    <div class="header">
      <div class="title">
        编辑：{{ skuGroup.name }} <button class="return-btn" @click="exitEditMode"><i class="fa fa-arrow-circle-o-left"></i> 返回列表</button>
      </div>
    </div>

    <div class="toolbox">
      <div class="toolset">
        <div class="zy-checkbox">
          <input type="checkbox" id="freedrawForSkuGroup" v-model="mode.freeDraw">
          <label for="freedrawForSkuGroup">
            <i class="fa fa-paint-brush"></i> 绘制（C）
          </label>
        </div>
      </div>

      <div class="toolset">
        <label>
          <input type="radio" v-model="mode.type" value="rect" :disabled="!mode.freeDraw">
          矩形
        </label>
        <label>
          <input type="radio" v-model="mode.type" value="circle" :disabled="!mode.freeDraw">
          圆形
        </label>
      </div>

      <!--<div class="toolset">
        <label>
          <input type="checkbox" v-model="mode.continuousDraw" :disabled="!mode.freeDraw">
          连续绘制
        </label>
      </div>-->

      <div class="toolset pull-right">
        <transition name="fade">
          <span v-if="ui.loading">
            <i class="fa fa-spinner fa-spin"></i>
          </span>
          <span v-if="ui.notify">
            {{ ui.noticeText }}
          </span>
        </transition>
        <button class="save-btn" @click="save"><i class="fa fa-floppy-o"></i> 保存</button>
      </div>

      <div class="toolset pull-right" v-if="1 === 0">
        <button @click="selectAll">全选</button>
        <button @click="resetCanvas">清空画布</button>
      </div>

      <div class="toolset pull-right" v-if="1 === 0">
        <button @click="toggleDebug">DEBUG</button>
      </div>
    </div>

    <div class="canvas" ref="canvasForSkuGroup" id="canvasForSkuGroup" tabindex="-1" @keyup.67="toggleFreeDraw">
      <canvas id="stageForSkuGroup"></canvas>
      <div class="button-remove">
        <button type="button" class="btn btn-danger btn-flat btn-xs" :style="{ top: removeBtn.top + 'px', left: removeBtn.left + 'px', 'z-index': removeBtn.z }" @click="removeActiveObject"><i class="fa fa-fw fa-times"></i></button>
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

    <!--<div class="toolbox">
      <div class="toolset plan-switch">
        <template v-for="(plan, index) in shopData.plans">
          <div class="plan-switch-item" :class="{active: index === state.activePlanIndex}" @click="switchActivePlan(index)">
            {{plan.name}}
          </div>
        </template>
      </div>
    </div>-->

    <div class="toolbox">
      <div class="toolset">
        <div class="margin-bottom">区域数量：{{ objectCount }}</div>

        <!--<div>
          <transition-group name="fade-issue">
            <template v-if="hasIssue || hasWarning">
              <span class="has-issue" key="issue" v-if="hasIssue">
                <i class="fa fa-times-circle"></i> 错误：{{issues}}
              </span>
              <span class="has-warning" key="warning" v-if="hasWarning">
                <i class="fa fa-exclamation-triangle"></i> 注意：{{warnings}}
              </span>
            </template>
            <template v-if="!hasIssue && !hasWarning">
              <span key="pass">
                <i class="fa fa-check-circle"></i> 当前画布没有问题
              </span>
            </template>
          </transition-group>
        </div>-->
      </div>
    </div>

    <transition name="fade">
      <div class="data-preview" v-if="ui.debug">
        <h6>RAW JSON 预览</h6>
        <pre>{{previewJSON}}</pre>
      </div>
    </transition>

    <div class="hidden">
      <!--add these to make states in $data reactive-->
      <input type="checkbox" v-model="state.drawing">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import api from './../../../api'
import Canvas from './../Library/FabricEngine'

export default {
  props: [
    'sgid'
  ],
  components: {},
  computed: {
    ...mapGetters('lbSkuGroup', [
      'getSkuGroupTemplateById'
    ]),
    skuGroup () {
      return this.getSkuGroupTemplateById(this.sgid)
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
      defaultAttrs: {
        originX: 'center',
        originY: 'center',
        fill: 'rgba(66, 134, 244, 0.7)',
        stroke: 'blue',
        strokeWidth: 1,
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        opacity: 1,
        visible: true,
        fillRule: 'nonzero'
      },
      typeDefs: ['rect', 'circle'],
      mode: { freeDraw: false, continuousDraw: false, type: 'rect' },
      state: { drawing: false, originX: 0, originY: 0, currentObj: null, activeObj: {data: {name: ''}}, activePlanIndex: 0, canvasDirty: false },
      ui: { debug: false, initializing: true, loading: false, notify: false, noticeText: '' },
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
    },
    previewJSON: {
      handler (after, before) {
        this.updateIssueList()
      },
      deep: true
    },
    'mode.freeDraw' (after) {
      this.canvas.deactivateAll().renderAll()
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
        if (document.activeElement === this.$refs.canvasForSkuGroup) {
          this.$data.mode.freeDraw = !this.$data.mode.freeDraw
        }
      } else {
        this.$data.mode.freeDraw = value
      }
    },
    toggleContinuousDraw (value) {
      this.$data.mode.continuousDraw = value
    },
    hideRemoveBtn () {
      this.removeBtn.z = -99
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
        this.skuGroup.sku.forEach(shape => {
          let coord = _.merge(shape.coord, this.defaultAttrs)
          let object
          if (coord.type === 'rect' || coord.type === 0) {
            object = new window.fabric.Rect(coord)
          } else if (coord.type === 'circle' || coord.type === 1) {
            object = new window.fabric.Circle(coord)
          } else {
            return false
          }
          object.id = shape.id
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
    async removeActiveObject () {
      let object = this.canvas.getActiveObject()
      if (!object) {
        console.warn('The object to remove is ', object)
        return false
      }
      this.$zydialog({
        msg: '确实要删除这个区域吗？删除后无法恢复。',
        okDanger: true,
        onOK: async () => {
          if (object.id) {
            // 保存过的区域，先请求后端删除数据
            this.$data.ui.loading = true
            try {
              let res = await api.request('/a/plan_show_case_sku/remove.json', { id: parseInt(object.id) })
              if (res.error_code > 0) {
                this.$zydialog('错误：删除失败：' + res.error_msg)
                return false
              } else {
                this.canvas.remove(object)
                this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
                this.canvas.deactivateAll().renderAll()
                this.showNotice('变更已保存')
              }
              this.$data.ui.loading = false
            } catch (err) {
              console.error(err)
              this.$data.ui.loading = false
              this.$zydialog('错误：删除失败：' + err)
              return false
            } finally {
              this.$data.ui.loading = false
            }
          } else {
            // 没有保存过的区域，直接删除图形
            this.canvas.remove(object)
            this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
            this.canvas.deactivateAll().renderAll()
          }
        }
      })
    },
    updateIssueList () {
      // if (this.previewJSON && this.objectCount > 0) {
      //   this.$data.issueList = new Set()
      //   this.$data.warningList = new Set()
      //   for (let i = 0; i < this.previewJSON.length; i++) {
      //     let object = this.previewJSON[i]
      //     if (!object.counterData) this.$data.issueList.add('数据损坏，请重新载入页面后再试')
      //     if (!object.counterData.shop_id) this.$data.issueList.add('缺少店铺数据，请重新载入页面后再试')
      //     if (typeof object.counterData.plan_index !== 'number') this.$data.issueList.add('缺少图形的平面图序号')
      //     if (!Array.isArray(object.counterData.object_ids) || object.counterData.object_ids.length === 0) this.$data.issueList.add('有图形未关联柜台或通道')
      //     if (!object.id) this.$data.warningList.add('新增图形尚未保存')
      //   }
      // }
    },

    // 保存画布数据到接口
    async save () {
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
      let newSkuIds = []
      for (let i = 0; i < objects.length; i++) {
        let object = objects[i]
        if (object.id) {
          // 有坐标 id，调用更新接口
          await this.updateSkuTemplate(object)
        } else {
          // 无坐标 id，是新增图形，调用新增接口
          let res = await this.addSkuTemplate(object)
          if (typeof res === 'string') {
            console.error(res)
          } else {
            object.set('id', res.id)
            newSkuIds.push(res.id)
          }
        }
      }
      this.$data.ui.loading = false
      if (newSkuIds.length > 0) {
        let args = {
          id: this.sgid,
          skuIds: newSkuIds
        }
        this.addSkuIdsToSkuGroupTemplate(args)
      }
      this.showNotice('保存完毕')
      this.state.canvasDirty = false
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
      this.canvas = new Canvas('stageForSkuGroup', {
        width: image.width,
        height: image.height,
        backgroundImage: imageURL
      })

      this.toggleInitializing(false)

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
              fill: 'rgba(66, 134, 244, 0.7)',
              stroke: 'blue',
              strokeWidth: 1
            })
            this.$data.state.currentObj.set('counterData', {
              plan_index: parseInt(this.$data.state.activePlanIndex),
              counter_id: [],
              shop_id: 0,
              valuetype: ''
            })
          } else {
            // 绘制圆形
            this.$data.state.currentObj = new window.fabric.Circle({
              left: this.$data.state.originX,
              top: this.$data.state.originY,
              radius: pointer.x - this.$data.state.originX,
              fill: 'rgba(66, 134, 244, 0.7)',
              stroke: 'blue',
              strokeWidth: 1
            })
          }

          this.$data.state.currentObj.set('counterData', {
            plan_index: parseInt(this.$data.state.activePlanIndex),
            object_ids: [],
            object_type: 'show_case',
            shop_id: parseInt(this.$data.shopId),
            valuetype: '热力值'
          })

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
          // 解决 fabric 新增物件无法被选中的问题
          this.canvas.setActiveGroup(new window.fabric.Group(this.canvas.getObjects())).renderAll()
          this.canvas.deactivateAll().renderAll()
          this.state.canvasDirty = true
        }
      })
      // 结束绘图：提笔

      // 将 fabric.js 的默认 scale 行为换算成 object 的 resize 行为
      this.canvas.on('object:modified', event => {
        let target = event.target
        if (!target) return false
        if (target.type === 'rect' || target.type === 0) {
          let scaleX = target.scaleX
          let scaleY = target.scaleY
          target.width *= scaleX
          target.height *= scaleY
          target.scaleX = 1
          target.scaleY = 1
        } else if (target.type === 'circle' || target.type === 1) {
          target.set('radius', target.radius * Math.max(Math.abs(target.scaleX), Math.abs(target.scaleY)))
          target.scaleX = 1
          target.scaleY = 1
        }

        this.state.canvasDirty = true

        let bound = event.target.aCoords
        this.removeBtn.top = bound.tr.y + 5
        let el = window.$('#canvasForSkuGroup .canvas-container')
        this.removeBtn.left = bound.tr.x + el.offset().left - el.parent().offset().left - 30
        this.removeBtn.z = 99
      })

      this.canvas.on('object:selected', event => {
        // 同时更新 popup 层的位置
        if (Array.isArray(event.target._objects)) {
          // 如果是组选择，不显示浮层
          return false
        }
        if (this.$data.mode.freeDraw === false && this.$data.state.drawing === false) {
          let bound = event.target.aCoords
          this.removeBtn.top = bound.tr.y + 5
          let el = window.$('#canvasForSkuGroup .canvas-container')
          this.removeBtn.left = bound.tr.x + el.offset().left - el.parent().offset().left - 30
          this.removeBtn.z = 99
          this.$data.state.activeObj = this.canvas.getActiveObject()
        }
      })

      this.canvas.on({
        'object:moving': this.hideRemoveBtn,
        'object:scaling': this.hideRemoveBtn,
        'object:rotating': this.hideRemoveBtn,
        'object:skewing': this.hideRemoveBtn,
        'selection:cleared': this.hideRemoveBtn
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
      this.$refs.canvasForSkuGroup.focus()
    })
  }
}
</script>

<style lang="scss" scoped>
@import './painter.scss'
</style>
