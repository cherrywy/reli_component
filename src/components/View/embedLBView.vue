<template>
  <div>
    <Viewer :planId="parseInt(planId)"></Viewer>
  </div>
</template>

<script>
import Viewer from './../SharedBlocks/Viewer'

export default {
  props: [],
  components: {
    Viewer
  },
  data () {
    return {
      shopId: 0,
      planId: 0
    }
  },
  methods: {},
  mounted () {},
  created () {
    this.planId = this.$route.params.planId || 0
  }
}
</script>

<style lang="scss" scoped>
</style>
