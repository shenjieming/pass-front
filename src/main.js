import Vue from 'vue'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import 'font-awesome/css/font-awesome.css'
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/theme-fresh.css'
import 'ag-grid-enterprise/main'
import { PropertyKeys } from 'ag-grid/dist/lib/propertyKeys'
import { ColDefUtil } from 'ag-grid/dist/lib/components/colDefUtil'
PropertyKeys.ALL_PROPERTIES.push('__ob__')
ColDefUtil.ALL_PROPERTIES.push('__ob__')
// import {LicenseManager} from "ag-grid-enterprise/main"
// LicenseManager.setLicenseKey("your license key")
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import '@/styles/index.scss' // global css
require('./mock')
import App from './App'
import router from './router'
import store from './store'
const vueCookie = require('vue-cookie')
// import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
// import './ mock' // simulation data

import * as filters from './filters' // global filters
import * as directives from './directive' // directives
Vue.use(vueCookie)
Vue.use(Element, {
  size: 'medium' // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]())
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  template: '<App/>',
  components: { App }
})
