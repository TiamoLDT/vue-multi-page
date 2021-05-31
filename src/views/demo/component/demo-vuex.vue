<template>
  <div class="demo-vuex">
    <h4>vuex-demo page</h4>
    <h5>state部分</h5>
    <div>直接获取name：{{stateName}}</div>
    <div>辅助函数获取name：{{name2}}</div>
    <div>number：{{stateNumber}}</div>

    <h5>直接提交mutations方式</h5>

    <br />
    <button @click="add">直接提交mutations --- state.number++</button>
    <br />
    <button @click="add2">提交载荷方式 --- state.number++</button>
    <br />
    <button @click="add3">对象风格的提交方式 --- state.number++</button>
    <br />
    <button @click="add4(2)">辅助函数无映射 --- state.number++2</button>
    <br />
    <button @click="add5(3)">辅助函数 映射 --- state.number++3</button>
    <br />

    <h5>actions分发mutations方式</h5>
    <button @click="cut">actions 提交到mutations --- state.number--</button>
    <button @click="cut2">actions 提交到mutations --- state.number--</button>
    <button @click="cut3">actions 提交到mutations --- state.number--2</button>
    <button @click="cut4(2)">actions 提交到mutations --- state.number--2</button>
    <button @click="cut5(2)">actions 提交到mutations --- state.number--2</button>

    <h5>getter部分</h5>
    <div>直接获取doneTodos：{{doneTodos}}</div>
    <div>辅助函数获取doneTodos：{{doneTodos1}}</div>
    <div>辅助函数获取doneTodos2：{{doneTodos2}}</div>

    <div></div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations,mapActions } from "vuex";
export default {
  name: "demo-vuex",
  components: {},
  created() {},
  methods: {
    // 直接提交mutations
    add() {
      // 普通提交
      this.$store.commit("add", 1);
    },
    add2() {
      // 提交载荷方式
      this.$store.commit("add2", {
        num: 1
      });
    },
    add3() {
      // 对象风格的提交方式
      this.$store.commit({
        type: "add3",
        num: 1
      });
    },
    //辅助函数方式
    ...mapMutations(["add4"]), //将 `this.add4()` 映射为 `this.$store.commit('add4')`
    ...mapMutations({ add5: "add4" }), //将 `this.add5()` 映射为 `this.$store.commit('add4')`

    // actions
    cut() {
      //通过actions 提交到mutations 建议使用
      this.$store.dispatch("cut",1);
    },
    cut2() {
      // 以载荷形式分发
      this.$store.dispatch("cut2", {
        num: 1
      });
    },
    cut3() {
      // 以对象形式分发
      this.$store.dispatch({
        type: "cut2",
        num: 2
      });
    },
    //辅助函数方式
    ...mapActions(['cut4']),     //将 `this.cut4()` 映射为 `this.$store.dispatch('cut4')`
    ...mapActions({cut5:'cut4'}),     //将 `this.cut5()` 映射为 `this.$store.dispatch('cut4')`

  },
  computed: {
    //state部分

    stateName() {
      //直接获取state中数据
      return this.$store.state.name;
    },
    stateNumber() {
      return this.$store.state.number;
    },
    ...mapState({
      //辅助函数获取state中数据
      name2: state => state.name
    }),

    //getter部分

    doneTodos() {
      //直接获取
      return this.$store.getters.doneTodos;
    },
    ...mapGetters([
      "doneTodos2" //跟上行比较没有映射情况
    ]),
    ...mapGetters({
      doneTodos1: "doneTodos" // 把 `this.doneTodo` 映射为 `this.$store.getters.doneTodos
    })
    
  }
};
</script>
<style lang="less">
button {
  margin: 6px;
}
</style>
