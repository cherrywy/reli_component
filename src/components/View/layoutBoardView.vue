<template>
  <section class="content">
    <el-row :gutter="20">
      <el-form :inline="true" class="demo-form-inline" style="margin-left: 10px;">
        <el-form-item label="请选择门店：">
          <el-select v-model="shopName" placeholder="请选择" @change="getFindShopPlan()">
            <el-option v-for="item in shop" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请选择布局图：">
          <el-select v-model="plansName" placeholder="请选择" @change='getPlanList()'>
            <el-option v-for="item in shopPlan" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="blue-btn" :disabled="!shopName" @click="showNewPlanModal">新增平面图</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div class="row" v-show="this.planList.length">
      <div class="col-xs-12">
        <Paint></Paint>
      </div>
    </div>
    <SkuGroupPaint></SkuGroupPaint>
    <NewPlan></NewPlan>
    <UpdatePlan :plan="plan"></UpdatePlan>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Paint from './../SharedBlocks/Paint'
import SkuGroupPaint from './../SharedBlocks/SkuGroupPaint'
import NewPlan from './../SharedBlocks/NewPlan'
import UpdatePlan from './../SharedBlocks/UpdatePlan'
import { requestFindShop, requestFindShopPlan } from '../../api/goodsServer';
export default {
  props: [],
  components: {
    Paint,
    SkuGroupPaint,
    NewPlan,
    UpdatePlan
  },
  computed: {
    ...mapGetters('lbShop', [
      'shopList'
    ]),
    ...mapGetters('lbShowcase', [
      'getShowcaseByPlanId',
      'showcaseList'
    ]),
    ...mapGetters('lbPlan', [
      'currentPlan',
      'planList'
    ]),
    plan() {
      return this.currentPlan
    },
    showcases() {
      return this.getShowcaseByPlanId(this.plan_id)
    }
  },
  watch: {
    shopId (after) {
      if (after) {
        this.setSelectedShopId(parseInt(after))
      }
    }
  },
  data() {
    return {
      uid: '',
      shop: [],
      shopId: 0,
      shopPlan: [],
      shopName: '',
      plansName: '',
      plan_id:'',
    }
  },
  methods: {
    ...mapActions('lbShop', [
      'setSelectedShopId'
    ]),
    ...mapActions('lbPlan', [
      'setCurrentPlanById',
      'getPlanListByShopId'
    ]),
    getFindShop() {
       const shopPlanParams = { uid: this.uid };
            requestFindShop(shopPlanParams).then(data => {
                this.shop = data.shop
            })
    },
    getFindShopPlan() {
      this.planList.length=0 
      this.plansName = ''
      const shop_id = this.shop.filter(v => {
        return v.value === this.shopName;
      }).map(v => v.id).pop();
      this.shopId = shop_id
      const shopPlanParams = { uid: this.uid, shop_id: shop_id };
       requestFindShopPlan(shopPlanParams).then(data => {
                this.shopPlan = data.shopPlan
            })
      // 清除画板
      this.$bus.$emit('resetPaintCanvas')
    },
    async getPlanList() {
      
      const shop_id = this.shop.filter(v => {
        return v.value === this.shopName;
      }).map(v => v.id).pop();


      this.plan_id = this.shopPlan.filter(v => {
        return v.value === this.plansName;
      }).map(v => v.id).pop()

      //todo:切换到新增的门店时，没有plan_id此时不能隐藏新增平面图按钮。传shopid过去，新增该门店下的平面图

      if(!this.plan_id){
        //切换门店时，不绘制平面图
        return;
      }

      await this.getPlanListByShopId(shop_id)
      this.setCurrentPlanById(this.plan_id)
      this.$nextTick(() => {
        this.$bus.$emit('changePaintPlanId', this.plan_id)
        this.$bus.$emit('initPaintCanvas')
      })
      if (this.planList.length === 0) {        
        // this.$router.push('/home')
        // alert('未找到平面图列表')
      }
    },
    showNewPlanModal () {
      this.$bus.$emit('resetNewPlanForm')
      window.$('#newplanmodal').modal({
        keyboard: false,
        backdrop: 'static'
      })
    }
  },
  mounted() {
    this.$bus.$off('planCreated')
    this.$bus.$on('planCreated', this.getFindShopPlan)
    this.$nextTick(async () => {
      this.uid = localStorage.getItem('uid');
      this.getFindShop()
      // 需传入平面图的 id

    })
  },
  async beforeRouteUpdate(to, from, next) {
    // 点击左侧导航跳转时的初始化钩子
    if (to.params.id) {
      await this.setCurrentPlanById(to.params.id)
    }
    next()
    this.$nextTick(async () => {
      //
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
