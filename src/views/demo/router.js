import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/demo-vuex'
  },
  {
    path: '/demo-vuex',
    name: 'demo-vuex',
    component: () => import(/* webpackChunkName: "demo-vuex" */ './component/demo-vuex.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
