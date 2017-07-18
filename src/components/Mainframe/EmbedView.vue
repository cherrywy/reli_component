<template>
  <div class="content-wrapper embed-frame">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data () {
    return {}
  },
  methods: {},
  mounted () {},
  created () {}
}
</script>

<style lang="scss" scoped>
.embed-frame {
  padding: 0;
  margin: 0;
}

// @media (max-width: 767px) {
//   // 覆盖 adminLTE 框架的自适配样式
//   .content-wrapper {
//     padding-top: 12px !important;
//   }
// }
</style>
