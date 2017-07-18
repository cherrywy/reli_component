<template>
  <section class="content">
    <div class="row">
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
    plan () {
      return this.currentPlan
    },
    showcases () {
      return this.getShowcaseByPlanId(this.$route.params.id)
    }
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions('lbPlan', [
      'setCurrentPlanById'
    ])
  },
  mounted () {
    this.$nextTick(async () => {
      await this.setCurrentPlanById(this.$route.params.id)
      if (this.planList.length === 0) {
        // this.$router.push('/home')
        alert('未找到平面图列表')
      }
    })
  },
  async beforeRouteUpdate (to, from, next) {
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
