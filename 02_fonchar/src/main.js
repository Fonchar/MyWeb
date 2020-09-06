// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {messages} from './assets/languages'
import showdown from 'showdown'

import store from './store'
import { currency } from './utils/currency'

// 全局引入bootstrap 【注：bootstrap引入必须放在App之前，否则eslint报错】
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import router from './router'

// 全局引入jquery 【注：jquery引入必须放在App之后，否则eslint报错】
import 'jquery'
// 全局引入屏幕工具
import VueScreen from 'vue-screen'
// 全局引入图片管理器
import Images from './router/images'
Vue.prototype.$Images = Images

Vue.prototype.md2html = (md) => {
  let converter = new showdown.Converter()
  let text = md.toString()
  let html = converter.makeHtml(text)
  return html
}

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh',
  messages: messages
})
console.log(messages)

Vue.filter('currency', currency)

Vue.use(VueScreen, 'bootstrap')
var sc = Vue.prototype.$screen
var sch = Vue.prototype.$screen.height - 340 + 'px'
Vue.prototype.$screen = {...sc, containerH: {'min-height': sch, 'margin-top': '30px', 'margin-bottom': '30px'}}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
  i18n
})
