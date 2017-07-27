<template>
  <div class="container content">

    <el-row :gutter="20">
      <el-form :inline="true" class="demo-form-inline" >
        <el-form-item label="请选择门店：">
          <el-select v-model="shopName" placeholder="请选择" @change="getFindShopPlan()">
            <el-option v-for="item in shop" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择布局图：">
          <el-select v-model="plansName" placeholder="请选择" @change="getActiveIndex">
            <el-option v-for="(item, index) in shopPlan" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
<div  v-show='plansName'>
    <div class="header" >
      <div class="title">
        柜台热力图绘图板
      </div>
    </div>

    <div class="toolbox" >
      <div class="toolset">
        <div class="zy-checkbox zy-checkbox-group">
          <input type="checkbox" id="selection" v-model="notFreeDraw" @click="mode.freeDraw = false">
          <label for="selection">
            <i class="fa fa-mouse-pointer"></i> 选择
          </label>
          <input type="checkbox" id="freedraw" v-model="mode.freeDraw">
          <label for="freedraw">
            <i class="fa fa-paint-brush"></i> 绘制
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

      <div class="toolset">
        <label>
          <input type="checkbox" v-model="mode.continuousDraw" :disabled="!mode.freeDraw">
          连续绘制
        </label>
      </div>

      <div class="toolset pull-right">
        <transition name="fade">
          <span v-if="ui.loading">
            <i class="fa fa-spinner fa-spin"></i>
          </span>
          <span v-if="ui.notify">
            {{ ui.noticeText }}
          </span>
        </transition>
        <button class="save-btn" @click="save"><i class="fa fa-floppy-o"></i> 全部保存</button>
      </div>

      <div class="toolset pull-right" v-if="1 === 0">
        <button @click="selectAll">全选</button>
        <button @click="resetCanvas">清空画布</button>
      </div>

      <div class="toolset pull-right" v-if="1 === 0">
        <button @click="toggleDebug">DEBUG</button>
      </div>
    </div>

    <div class="canvas" ref="canvas" id="canvasWrapper">
      <canvas id="stage"></canvas>
      <div class="popup">
        <Popup :styles="popup.styles"
               :spin="popup.spin.show"
               :shopName="`${shopData.shopName}（${(shopData.plans[state.activePlanIndex]) ? shopData.plans[state.activePlanIndex].data.name : ''}）`"
               :shopId="shopId"
               :counters="shopData.counters"
               :aisles="shopData.aisles"
               :activeObject="state.activeObj"></Popup>
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


    <div class="toolbox">
      <div class="toolset">
        <div class="margin-bottom">图形数量：{{ objectCount }}</div>

        <div>
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
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="data-preview" v-if="ui.debug">
        <h6>RAW JSON 预览</h6>
        <pre>{{previewJSON}}</pre>
      </div>
    </transition>
</div>
    <div class="hidden">
      <!--add these to make states in $data reactive-->
      <input type="checkbox" v-model="state.drawing">
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from './../../../api/request'
import Canvas from './../Library/FabricEngine'
import Popup from './Popup'
import { requestFindShop, requestFindShopPlan } from '../../../api/goodsServer';
export default {
  props: [],
  components: {
    Popup
  },
  computed: {
    previewJSON () {
      if (this.$data.canvas) {
        return this.$data.canvas.getObjects()
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
      uid: '',
      shop: [],
      shopId: 0,
      shopPlan: [],
      shopName: '',
      plansName: '',
      plan_id:0,
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
      state: { drawing: false, originX: 0, originY: 0, currentObj: null, activeObj: null, activePlanIndex: -1 },
      popup: {
        styles: { top: 0, left: 0, opacity: 0 },
        spin: { show: false }
      },
      ui: { debug: false, initializing: true, loading: false, notify: false, noticeText: '' },
      issueList: new Set(),
      warningList: new Set()
    }
  },
  watch: {
    'mode.freeDraw' (after) {
      this.$data.canvas.deactivateAll().renderAll()
      if (after) {
        this.hidePopup()
      }
    },
    'shopId' (after) {
      //
    },
    'state.activePlanIndex' (after) {
        this.fetchShopData()
     
    },
    'shopData.shapes' (after) {
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
    }
  },
  methods: {
    getFindShop() {
      const shopPlanParams = { uid: this.uid };
      requestFindShop(shopPlanParams).then(data => {
        this.shop = data.shop
      })
    },
    getFindShopPlan() {
      this.plansName = ''
      const shop_id = this.shop.filter(v => {
        return v.value === this.shopName;
      }).map(v => v.id).pop();
      this.shopId = shop_id
      const shopPlanParams = { uid: this.uid, shop_id: shop_id };
      requestFindShopPlan(shopPlanParams).then(data => {
        this.shopPlan = data.shopPlan
      
      })
    },
    getActiveIndex (name) {
      
      let index = _.findIndex(this.shopPlan, {value: name})
      this.switchActivePlan(index)
    },
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
      this.$data.mode.freeDraw = value
    },
    toggleContinuousDraw (value) {
      this.$data.mode.continuousDraw = value
    },
    togglePopupSpinShow (value) {
      this.$data.popup.spin.show = value
    },
    switchActivePlan (value) {
      this.hidePopup()
      if (value >= this.$data.shopData.plans.length || value < 0) value = 0
      if (value === this.$data.state.activePlanIndex) return
      if (this.canvas && this.canvas.dispose) this.$data.canvas.dispose()
      this.$data.canvas = null
      let cc = document.getElementsByClassName('canvas-container')
      let uc = document.getElementsByTagName('canvas')
      if (cc.length > 0) {
        cc[0].parentNode.removeChild(cc[0])
      }
      if (uc.length > 0) {
        uc[0].parentNode.removeChild(uc[0])
      }
      let newCanvasDom = document.createElement('canvas')
      newCanvasDom.setAttribute('id', 'stage')
      this.$refs.canvas.appendChild(newCanvasDom)
      this.$data.state.activeObj = null
      this.$data.state.activePlanIndex = value
      this.toggleInitializing(true)
    },
    updateIssueList () {
      if (this.previewJSON && this.objectCount > 0) {
        this.$data.issueList = new Set()
        this.$data.warningList = new Set()
        for (let i = 0; i < this.previewJSON.length; i++) {
          let object = this.previewJSON[i]
          if (!object.counterData) this.$data.issueList.add('数据损坏，请重新载入页面后再试')
          if (!object.counterData.shop_id) this.$data.issueList.add('缺少店铺数据，请重新载入页面后再试')
          if (typeof object.counterData.plan_index !== 'number') this.$data.issueList.add('缺少图形的平面图序号')
          if (!Array.isArray(object.counterData.object_ids) || object.counterData.object_ids.length === 0) this.$data.issueList.add('有图形未关联柜台或通道')
          if (!object.id) this.$data.warningList.add('新增图形尚未保存')
        }
      }
    },
    resetCanvas (bypass) {
      if (this.$data.canvas.getObjects().length > 0) {
        let objects = this.$data.canvas.getObjects()
        while (objects.length !== 0) {
          objects[0].remove()
        }
        this.$data.canvas.deactivateAll().renderAll()
        this.hidePopup()
      }
    },
    renderObjects () {
      // 绘制接口中获取的形状
      if (this.$data.canvas) {
        this.resetCanvas()
        this.$data.shopData.shapes.forEach(shape => {
          if (shape.counterData.plan_index !== this.$data.state.activePlanIndex) return
          let object
          if (shape.type === 'rect' || shape.type === 0) {
            object = new window.fabric.Rect(shape)
          } else if (shape.type === 'circle' || shape.type === 1) {
            object = new window.fabric.Circle(shape)
          } else {
            return
          }
          this.$data.canvas.add(object)
        })
        this.$data.canvas.renderAll()
      }
    },
    selectAll () {
      if (this.$data.canvas.getObjects().length > 0 && !this.$data.canvas.getActiveGroup()) {
        this.$data.canvas.setActiveGroup(new window.fabric.Group(this.$data.canvas.getObjects())).renderAll()
        this.hidePopup()
      }
    },
    async resetActiveObject () {
      let object = this.$data.canvas.getActiveObject()
      if (object) {
        object.set('angle', 0)
        object.set('skewX', 0)
        object.set('skewY', 0)
        if (object.id) {
          this.togglePopupSpinShow(true)
          try {
            await this.updateToApi(this.getApiParams(object))
          } catch (err) {
          }
          this.togglePopupSpinShow(false)
        }
      }
    },
    async updateActiveObject (params) {
      if (!Array.isArray(params)) params = [params]
      let object = this.$data.canvas.getActiveObject()
      if (object) {
        params.forEach(param => {
          _.set(object, param.field, param.value)
        })
        object.set('dirty', true)
        // 刷新问题列表（watch previewJSON 可能无法及时更新）
        this.updateIssueList()
        this.$data.canvas.renderAll()

        // if (object.id) {
        //   this.togglePopupSpinShow(true)
        //   try {
        //     await this.updateToApi(this.getApiParams(object))
        //   } catch (err) {
        //     console.error(err)
        //   }
        //   this.togglePopupSpinShow(false)
        // }
      }
    },
    removeActiveObject () {
      let object = this.$data.canvas.getActiveObject()
      if (!object) {
        return false
      }
      if (object.id) {
        this.$data.ui.loading = true
        api.request('/sys_admin/show_case_coord/remove_data.json', {coord_id: parseInt(object.id)})
        .then(res => {
          if (res.error_code > 0) {
            alert('删除失败：' + res.error_msg)
            return false
          } else {
            this.showNotice('保存完毕')
          }
          this.$data.ui.loading = false
        })
        .catch(err => {
          this.$data.ui.loading = false
          alert('删除失败：' + err)
          return false
        })
      }
      this.$data.canvas.remove(object)
      this.$data.canvas.setActiveGroup(new window.fabric.Group(this.$data.canvas.getObjects())).renderAll()
      this.$data.canvas.deactivateAll().renderAll()
    },
    hidePopup () {
      this.$data.popup.styles.opacity = 0
    },
    showPopup () {
      this.$data.popup.styles.opacity = 1
    },

    // 通过店铺 id 获取店铺数据
    fetchShopData () {
      api.request('/ipad_sys_admin/shop/show_case/coord/show.json', {id: this.$data.shopId})
      .then(res => {
        if (res.error_code && res.error_code > 0) {
          throw new Error('初始化失败：' + res.error_msg)
        }
        let result = res.result
        if (!result.shop || !result.show_case || !result.show_case_coord) {
          throw new Error('店铺数据结构有误，请尝试修复')
        }

        // 检查拉取回来的数据是否有值
        if (!Array.isArray(result.shop) || result.shop.length === 0) {
          throw new Error('没有这个店铺，请检查店铺 id 参数是否正确')
        }

        // 店铺名赋值
        if (!result.shop[0].data.shop) {
          throw new Error('缺失店铺名称，请先添加店铺名称，再进行绘图')
        }
        this.$data.shopData.shopName = result.shop[0].data.shop

        // 店铺平面图赋值
        if (!Array.isArray(result.plan) || result.plan.length === 0) {
          throw new Error('尚未上传店铺平面图，请至少上传一张平面图，再进行绘图')
        }
        this.$data.shopData.plans = result.plan

        // 柜台和通道不能都为空
        if ((!Array.isArray(result.show_case) || result.show_case.length === 0) && (!Array.isArray(result.aisle) || result.aisle.length === 0)) {
          throw new Error('无任何柜台、通道。请先添加柜台或通道，再来进行坐标绘制')
        }

        // 柜台赋值
        if (result.show_case) {
          this.$data.shopData.counters = result.show_case
        }

        // 通道赋值
        if (result.aisle) {
          this.$data.shopData.aisles = result.aisle
        }

        // 坐标数据赋值
        if (!Array.isArray(result.show_case_coord)) {
          throw new Error('柜台坐标数据不正确，请检查')
        }
        let shapes = []
        result.show_case_coord.forEach(shape => {
          shapes.push(_.merge(_.merge({}, this.$data.defaultAttrs), {
            id: shape.id,
            type: this.$data.typeDefs[shape.data.type],
            left: shape.data.x,
            top: shape.data.y,
            height: shape.data.height,
            width: shape.data.width,
            angle: shape.data.angle,
            skewX: shape.data.skewx,
            skewY: shape.data.skewy,
            startAngle: shape.data.startangle,
            endAngle: shape.data.endangle,
            radius: shape.data.radius,
            counterData: {
              plan_index: shape.data.plan_index,
              object_ids: shape.data.object_ids,
              object_type: shape.data.object_type || 'show_case',
              shop_id: shape.data.shop_id,
              valuetype: shape.data.valuetype
            }
          }))
        })
        this.$data.shopData.shapes = shapes
        this.toggleInitializing(false)
      })
      .catch(err => {
        alert(err.message || '热力图绘制遇到问题')
      })
    },

    // 调用更新接口
    updateToApi (data) {
      return new Promise((resolve, reject) => {
        api.request('/sys_admin/show_case_coord/update_data.json', data)
        .then(res => {
          if (res.error_code > 0) {
            return reject(res.error_msg)
          } else {
            return resolve()
          }
        })
        .catch(err => { return reject(err) })
      })
    },

    // 调用新增接口
    newToApi (data, object) {
      return new Promise((resolve, reject) => {
        api.request('/sys_admin/show_case_coord/new_data.json', data)
        .then(res => {
          if (res.error_code > 0) {
            return reject(res.error_msg)
          } else {
            // 更新对象的 id，使得下次保存时执行「更新」
            object.set('id', res.result.id)
            return resolve()
          }
        })
        .catch(err => { return reject(err) })
      })
    },

    // 接口参数组装
    getApiParams (object) {
      return {
        shop_id: parseInt(object.counterData.shop_id),
        show_case_coord_id: parseInt(object.id),
        object_ids: object.counterData.object_ids.map(item => parseInt(item)),
        object_type: object.counterData.object_type,
        plan_index: parseInt(this.$data.state.activePlanIndex),
        angle: object.angle || 0,
        startangle: object.startAngle || 0,
        endangle: object.endAngle || 360,
        height: object.height,
        width: object.width,
        radius: object.radius,
        skewx: object.skewX,
        skewy: object.skewY,
        type: this.$data.typeDefs.indexOf(object.type),
        valuetype: object.counterData.valuetype,
        x: object.left,
        y: object.top
      }
    },

    // 保存画布数据到接口
    save () {
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
      let reqList = []
      objects.forEach(object => {
        if (object.id) {
          // 有坐标 id，调用更新接口
          reqList.push(this.updateToApi(this.getApiParams(object)))
        } else {
          // 无坐标 id，是新增图形，调用新增接口
          reqList.push(this.newToApi(this.getApiParams(object), object))
        }
      })
      Promise.all(reqList)
      .then(res => {
        // 刷新问题列表（watch previewJSON 可能无法及时更新）
        this.updateIssueList()
        this.$data.ui.loading = false
        this.showNotice('保存完毕')
      })
      .catch(err => {
        this.$data.ui.loading = false
      })
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
      if (this.$data.state.activePlanIndex >= this.$data.shopData.plans.length) {
        this.$data.state.activePlanIndex = 0
      }
      let imageURL = this.$data.shopData.plans[this.$data.state.activePlanIndex].data.image_url
      let image
      try {
        image = await this.prefetchImage(imageURL)
      } catch (err) {
        alert('错误：无法获取图片，请检查图片地址是否正确，并重新载入此页面')
        return false
      }
      let maxHeight = 500
      if (image.height > maxHeight) {
        image.width = image.width * maxHeight / image.height
        image.height = maxHeight
      }
      this.$data.canvas = new Canvas('stage', {
        width: image.width,
        height: image.height,
        backgroundImage: imageURL
      })

      // 绘图：落笔
      this.$data.canvas.on('mouse:down', event => {
        if (this.$data.mode.freeDraw === true) {
          this.$data.canvas.set('selectionColor', 'transparent')
          this.$data.canvas.set('selectionBorderColor', 'transparent')
          // 固定已有对象
          let objects = this.$data.canvas.getObjects()
          objects.forEach(object => {
            object.set('selectable', false)
          })
          // 执行落笔
          let pointer = this.$data.canvas.getPointer(event.e)
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

          this.$data.canvas.add(this.$data.state.currentObj).setActiveObject(this.$data.state.currentObj)
          this.$data.canvas.renderAll()
        }
      })
      // 结束绘图：落笔

      // 绘图：行笔
      this.$data.canvas.on('mouse:move', event => {
        if (this.$data.mode.freeDraw === true && this.$data.state.drawing === true) {
          let pointer = this.$data.canvas.getPointer(event.e)
          if (this.$data.mode.type === 'rect') {
            if (this.$data.state.originX > pointer.x) {
              this.$data.state.currentObj.set({ left: Math.abs(pointer.x) })
            }
            if (this.$data.state.originY > pointer.y) {
              this.$data.state.currentObj.set({ top: Math.abs(pointer.y) })
            }
            this.$data.state.currentObj.set({ width: Math.abs(this.$data.state.originX - pointer.x) })
            this.$data.state.currentObj.set({ height: Math.abs(this.$data.state.originY - pointer.y) })
            this.$data.canvas.renderAll()
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
            this.$data.canvas.renderAll()
          }
        }
      })
      // 结束绘图：行笔

      // 绘图：提笔
      this.$data.canvas.on('mouse:up', event => {
        if (this.$data.mode.freeDraw === true && this.$data.state.drawing === true) {
          // 恢复选择框的颜色
          this.$data.canvas.set('selectionColor', 'rgba(100, 100, 255, 0.3)')
          this.$data.canvas.set('selectionBorderColor', 'rgba(255, 255, 255, 0.3)')
          // 解除固定已有对象
          let objects = this.$data.canvas.getObjects()
          objects.forEach(object => {
            object.set('selectable', true)
          })
          // 解除正在绘制状态
          this.toggleDrawing(false)
          // 如果未选中连续绘制，解除绘图模式
          if (!this.$data.mode.continuousDraw) this.toggleFreeDraw(false)
          // 如果当前物件的长宽都是 0，则从画布中删除此物件
          if (this.$data.state.currentObj && (this.$data.state.currentObj.width === 0 || this.$data.state.currentObj.height === 0)) {
            this.$data.canvas.remove(this.$data.state.currentObj)
          } else {
            // 对有效物件设定原点坐标（中心）
            this.$data.state.currentObj.set('originX', 'center')
            this.$data.state.currentObj.set('originY', 'center')
            this.$data.state.currentObj.set('top', this.$data.state.currentObj.top + this.$data.state.currentObj.height / 2)
            this.$data.state.currentObj.set('left', this.$data.state.currentObj.left + this.$data.state.currentObj.width / 2)
          }
          // 解决 fabric 新增物件无法被选中的问题
          this.$data.canvas.setActiveGroup(new window.fabric.Group(this.$data.canvas.getObjects())).renderAll()
          this.$data.canvas.deactivateAll().renderAll()
        }
      })
      // 结束绘图：提笔

      // 将 fabric.js 的默认 scale 行为换算成 object 的 resize 行为
      this.$data.canvas.on('object:modified', event => {
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

        let bound = event.target.aCoords
        this.$data.popup.styles.top = bound.tr.y
        this.$data.popup.styles.left = document.getElementsByClassName('canvas-container')[0].offsetLeft + bound.tr.x + 15
        if (!this.$data.canvas.getActiveGroup()) this.showPopup()
      })

      this.$data.canvas.on('object:selected', event => {
        // 同时更新 popup 层的位置
        if (Array.isArray(event.target._objects)) {
          // 如果是组选择，不显示浮层
          return false
        }
        if (this.$data.mode.freeDraw === false && this.$data.state.drawing === false) {
          let bound = event.target.aCoords
          this.$data.popup.styles.top = bound.tr.y
          this.$data.popup.styles.left = document.getElementsByClassName('canvas-container')[0].offsetLeft + bound.tr.x + 15
          this.$data.state.activeObj = this.$data.canvas.getActiveObject()
          if (!this.$data.canvas.getActiveGroup()) this.showPopup()
        }
      })

      this.$data.canvas.on({
        'object:moving': this.hidePopup,
        'object:scaling': this.hidePopup,
        'object:rotating': this.hidePopup,
        'object:skewing': this.hidePopup,
        'selection:cleared': this.hidePopup
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 通过 URL 参数初始化门店 id
      this.uid = localStorage.getItem('uid');
      this.getFindShop()
      // // 需传入平面图的 id
      // if (this.$route.query.shop_id) this.$data.shopId = parseInt(this.$route.query.shop_id)
      // if (this.$route.query.plan) this.$data.state.activePlanIndex = parseInt(this.$route.query.plan)
    })
  },
  created () {
    this.$bus.$on('resetSkewRotate', this.resetActiveObject)
    this.$bus.$on('removeObject', this.removeActiveObject)
    this.$bus.$on('updateActiveObject', _.debounce(this.updateActiveObject, 200))
    window.onresize = this.hidePopup
  }
}
</script>

<style lang="scss" scoped>
@import './../../../styles/global.scss';
.el-select-dropdown__item {

    padding: 8px 10px !important;
  
}
.demo-form-inline{
  // margin:10px !important;
  background: #eef1f6 !important;
}
$theme-color:   #70a5ec;

.margin-bottom {
  margin-bottom: 12px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-issue-enter-active {
  transition: opacity .3s;
}
.fade-issue-enter, .fade-issue-leave-to {
  opacity: 0;
}

.container {
  position: relative;
  background: #eef1f6 !important;

  

  .header {
    background: $theme-color;
    padding: 10px;

    .title {
      color: #ffffff;
      font-weight: 700;
      font-size: 18px;
    }
  }

  .toolbox {
    position: relative;
    background: $theme-color;
    padding: 12px;
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;

    .toolset {
      color: #ffffff;
      display: inline-block;
      vertical-align: top;
      margin-right: 8px;
      cursor: pointer;
    }

    .has-issue {
      color: #e91e63;
      margin-right: 12px;
    }

    .has-warning {
      color: #e2860d;
    }

    .save-btn {
      color: #4CAF50;
      background: #ffffff;
      border: 1px solid #4CAF50;
      border-radius: 5px;
      outline: none;
      padding: 8px;
      margin-top: -6px;
      margin-right: -10px;
      box-shadow: 1px 1px 2px rgba(50, 50, 50, 0.5);
      transition: all .1s;
    }

    .save-btn:active {
      outline: none;
      color: #ffffff;
      background: #4CAF50;
      box-shadow: 1px 1px 1px rgba(50, 50, 50, 0.2)
    }

    .plan-switch {
      position: relative;

      .plan-switch-item {
        display: inline-block;
        background: #ffffff;
        color: #0a9fd1;
        padding: 3px 12px;
      }

      .plan-switch-item.active {
        background: #eaeaea;
        box-shadow: inset 1px 1px 3px rgba(100, 100, 100, 0.4);
      }

      .plan-switch-item:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      .plan-switch-item:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }

    .zy-checkbox {
      margin-top: -6px;

      input[type=checkbox] {
        position: absolute;
        margin-left: -9999px;
        visibility: hidden;
        margin: 0;
      }

      input[type=checkbox] + label {
        padding: 8px;
        background-color: #ffffff;
        border-radius: 5px;
        color: #0dafe5;
        font-size: 12px;
      }

      input[type=checkbox]:checked + label {
        color: #0a9fd1;
        background: #eaeaea;
        box-shadow: inset 1px 1px 3px rgba(100, 100, 100, 0.4);
      }
     
      label {
        display: block;
        position: relative;
        cursor: pointer;
        outline: none;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
      }

      label:last-child {
        margin-left: -3px;
      }
    }

    .zy-checkbox-group {
      label {
        display: inline-block;
        border-radius: 0 !important;
      }

      label:first-of-type {
        border-radius: 5px 0 0 5px !important;
      }

      label:last-of-type {
        border-radius: 0 5px 5px 0 !important;
      }
    }
  }

  .canvas {
    position: relative;
    height: 500px;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: rgba(255, 255, 255, 0.9);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0dafe5;
      font-weight: 700;

      .indicator {
        text-align: center;
      }
    }
  }

  .data-preview {
    padding: 12px;
  }

  .hidden {
    display: none;
  }
}
</style>
