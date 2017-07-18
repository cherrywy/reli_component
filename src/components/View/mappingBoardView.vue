<template>
  <section class="content">
    <div class="row">
      <div class="col-xs-12">
        <Mapper></Mapper>
      </div>
    </div>
    <GoodsListModal></GoodsListModal>
    <NewGoodModal></NewGoodModal>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Mapper from './../SharedBlocks/Mapper'
import GoodsListModal from './../SharedBlocks/Mapper/goodsModal'
import NewGoodModal from './../SharedBlocks//Mapper/newGoodModal'

export default {
  props: [],
  components: {
    Mapper,
    GoodsListModal,
    NewGoodModal
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
    ]),
    ...mapActions('mbGoods', [
      'getGoodsList'
    ])
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getGoodsList()
      await this.setCurrentPlanById(this.$route.params.id)
      if (this.planList.length === 0) {
        this.$router.push('/home')
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
