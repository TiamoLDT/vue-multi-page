import Vue from 'vue'
import VueRouter from 'vue-router'
import Hello from '../hello.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/hello',
    name: 'hello',
    component: Hello
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
