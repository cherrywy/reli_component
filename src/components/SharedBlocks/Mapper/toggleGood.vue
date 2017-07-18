<template>
  <div v-if="activeSku" class="tick-box text-center">
    <span @click="deselect(data.id)" v-if="activeSku.item_ids.indexOf(parseInt(data.id)) >= 0"><i class="fa fa-check-square-o fa-fw text-green"></i></span>
    <span @click="select(data.id)" v-if="activeSku.item_ids.indexOf(parseInt(data.id)) < 0"><i class="fa fa-square-o fa-fw"></i></span>
  </div>
  <div v-else></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: ['data'],
  components: {},
  computed: {
    ...mapGetters('lbSku', [
      'activeSku'
    ])
  },
  data () {
    return {}
  },
  methods: {
    ...mapActions('lbSku', [
      'insertItemId',
      'removeItemId'
    ]),
    select (id) {
      this.insertItemId(parseInt(id))
    },
    deselect (id) {
      this.removeItemId(parseInt(id))
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.tick-box {
  font-size: 18px;
  width: 30px;

  span {
    padding: 12px;
    cursor: pointer;
  }

  span:hover {
    i {
      color: #246520;
    }
  }

  span:active {
    i {
      color: #35922f;
    }
  }
}
</style>
