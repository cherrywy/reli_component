import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import store from './store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'

// 导入展柜布局工具依赖
import ZyDialog from './components/SharedBlocks/ZyDialog/index'
import bus from './bus'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'expose-loader?$!expose-loader?jQuery!jquery'
import 'bootstrap'
import 'jquery-slimscroll'
import './styles/global.scss'
import './styles/override.scss'
import './styles/util.scss'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(bus)
Vue.use(ZyDialog)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    localStorage.removeItem('uid');
  }
  let uid= JSON.parse(localStorage.getItem('uid'));
  if (!uid && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

