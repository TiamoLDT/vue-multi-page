<template>
  <div id="app">
    <h3>hello page</h3>
    <h3>过滤器测试 --- {{today|dateFormat}}</h3>
    <button @click="jumpPage">跳转index.html</button>
    <router-view/>
  </div>
</template>
<script>
export default {
  data(){
    return {
      msg:'hello',
      today:new Date()
    }
  },
  methods:{
    jumpPage(){
      location.href=this.makePath('index','/')
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
