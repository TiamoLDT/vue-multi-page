// import Vue from 'vue'
import Vue from "@utils/index.js";  //单页面直接引用在外层main.js  多页面需每个html下js引入
import App from './App.vue'
import router from './router'
// import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
//   store,
  render: h => h(App)
}).$mount('#app')
