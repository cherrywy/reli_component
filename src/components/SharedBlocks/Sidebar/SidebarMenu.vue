<template>
  <ul class="sidebar-menu">

    <li class="header">管理</li>
    <li class="pageLink">
      <router-link :to="'/home'" exact>
        <i class="fa fa-fw" :class="(activeMenuIndex === 0) ? 'fa-sticky-note' : 'fa-sticky-note-o'"></i> <span class="page">首页</span>
      </router-link>
    </li>

    <li class="header">店面布局图</li>
    <template v-for="item in planList">
      <li class="pageLink">
        <router-link :to="`/lb/${item.id}`" exact>
          <i class="fa fa-object-group fa-fw"></i> <span class="page">{{ item.name }}</span>
        </router-link>
      </li>
    </template>

    <!--<li class="header">店面商品陈列</li>
    <template v-for="item in planList">
      <li class="pageLink">
        <router-link :to="`/mb/${item.id}`" exact>
          <i class="fa fa-object-group fa-fw"></i> <span class="page">{{ item.name }}</span>
        </router-link>
      </li>
    </template>-->

  </ul>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import _ from 'lodash'
// import api from '../../../api'
// import store from '../../../store/'

export default {
  computed: {
    ...mapGetters('lbPlan', [
      'planList'
    ])
  },
  data () {
    return {
      activeMenuIndex: 0,
      searchField: ''
    }
  },
  methods: {
    ...mapActions('lbPlan', {
      getList: 'getList'
    })
  },
  mounted () {
    this.$nextTick(() => {
      //
    })
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
  li>a.router-link-active {
    font-weight: 700;
    color: #ffffff;
    background: #3b4a50;
  }
}
</style>
