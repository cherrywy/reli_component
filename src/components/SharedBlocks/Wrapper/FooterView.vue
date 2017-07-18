<template>
  <div>
    <footer class="main-footer select-none">
      <strong>&copy; <a href="http://geekniu.com" target="_blank">geekniu</a> <span @click="igniteDebugger">2015</span> - {{year}}</strong>
    </footer>
  </div>
</template>

<script>
import store from '../../../store'

export default {
  props: ['year'],
  methods: {
    igniteDebugger () {
      store.dispatch('igniteDebug')
    }
  }
}
</script>

<style>
.main-footer {
  border-left: 2px solid #f2f7ff !important;
  border-top: 2px solid #f2f7ff !important;
}
</style>
