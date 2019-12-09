<template>
  <div id="app">
    <h3>demo page</h3>
    <button @click="jumpPage">跳转index.html</button>
    <!-- <div id="nav">
      <router-link to="/vuex">vuex</router-link>
    </div> -->
    <router-view/>
  </div>
</template>
<script>
export default {
  data(){
    return {
      msg:'demo',
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
