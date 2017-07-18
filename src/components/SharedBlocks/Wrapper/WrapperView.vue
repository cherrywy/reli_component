<template>
  <div>
    <div class="content-wrapper">
      <HeaderView />
      <router-view></router-view>
    </div>
    <FooterView :year="year" />
  </div>
</template>

<script>
import HeaderView from './HeaderView'
import FooterView from './FooterView'

export default {
  components: {
    HeaderView,
    FooterView
  },

  data () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scope>
.content-wrapper {
  border-left: 2px solid #f2f7ff !important;
  background: #ffffff;

  .content {
    padding: 0 30px;
  }

  .content-header {
    padding-left: 30px;
    padding-right: 30px;
  }
}
</style>
