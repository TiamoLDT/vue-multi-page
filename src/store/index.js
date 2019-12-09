import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name:'test vuex',
    number:0,
    todos: [
      { id: 1, text: 'test1', done: true },
      { id: 2, text: 'test2', done: false }
    ]
  },
  mutations: {
    //mutations接受第一个参数为state对象 
    // 普通方式提交的 接收第二个参数为参数
    add(state,num){
      state.number+=num;
    },
    //提交载荷方式 接收第二个参数为一个参数对象
    add2(state,payload){
      state.number += payload.num
    },
    //对象风格的提交方式 跟提交载荷方式接收参数一样
    add3(state,payload){
      state.number += payload.num
    },
    add4(state,num){
      state.number+=num;
    },

    auta(state,num){
      state.number-=num;
    }

  },
  actions: {
    //actions第一个参数 为一个跟store一样具有相同方法的对象 {commit,state,getter}
    //actions内部可以进行一些异步操作 进行一些数据请求等等'
    //普通方式分发 第二个参数为传的参数
    cut({commit},num){
      commit('auta',num)
    },
    //荷载跟对象方式分发的 第二个参数为一个参数对象
    cut2({commit},payload){
      commit('auta',payload.num)
    },
    cut4({commit},num){
      commit('auta',num)
    },
  },
  modules: {
    
  },
  //类似store的计算属性
  getters: {
    doneTodos:state=>{
      return state.todos.filter(todo=>todo.done)
    },
    doneTodos2:state=>{
      return state.todos.filter(todo=>!todo.done)
    },
  }
})
