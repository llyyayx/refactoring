/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control
import config from './utils/config'
import echarts from 'echarts'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

// set ElementUI lang to EN
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$Cookies = Cookies
Vue.prototype.$config = config
Vue.prototype.$echarts = echarts

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
