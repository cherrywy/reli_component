import Vue from 'vue'
const bus = new Vue()
export default {
  bus,
  install (Vue, options) {
    Vue.prototype.$bus = bus
  }
}
