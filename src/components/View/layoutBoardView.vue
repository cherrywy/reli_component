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
      </el-form>
    </el-row>
    <div class="row" >
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
  data() {
    return {
      uid: '',
      shop: [],
      shopPlan: [],
      shopName: '',
      plansName: '',
      plan_id:'',
    }
  },
  methods: {

    ...mapActions('lbPlan', [
      'setCurrentPlanById',
      'getPlanListByShopId'
    ]),
    getFindShop() {
      const shopPlanParams = { uid: this.uid };
      requestFindShop(shopPlanParams).then(data => {
        let { error_code, result } = data;
        if (error_code !== 0) {
          this.$message({
            message: "返回数据有误",
            type: 'error'
          });
        } else {
          this.shop = result.map(v => {
            return {
              value: v.shop,
              id: v.id,

            }
          });

        }
      })
    },
    getFindShopPlan() {
      this.planList.length=0 
      this.plansName = ''
      const shop_id = this.shop.filter(v => {
        return v.value === this.shopName;
      }).map(v => v.id).pop();
      const shopPlanParams = { uid: this.uid, shop_id: shop_id };
      requestFindShopPlan(shopPlanParams).then(data => {
        let { error_code, result } = data;
        if (error_code !== 0) {
          this.$message({
            message: "返回数据有误",
            type: 'error'
          });
        } else {
          this.shopPlan = result.map(v => {
            return {
              value: v.name,
              id: v.id,

            }
          });
        }
      })
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
      
      console.log(this.planList.length)
      if (this.planList.length === 0) {        
        // this.$router.push('/home')
        // alert('未找到平面图列表')
      }
    }

  },
  mounted() {
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
