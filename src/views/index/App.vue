<template>
  <div id="app">
    <h3>index page</h3>
    <h3>过滤器测试 --- {{today|dateFormat}}</h3>
    <button @click="jumpPage">跳转demo.html</button>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
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
      location.href=this.makePath('demo','/')
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
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
