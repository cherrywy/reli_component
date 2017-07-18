<template>
  <h1 class="pull-left">
    {{ $route.meta.name || '&nbsp;' }}
  </h1>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [],
  components: {},
  computed: {
    ...mapGetters([])
  },

  data () {
    return {}
  },

  methods: {},
  mounted () {}
}
</script>

<style lang="scss" scoped>

</style>
