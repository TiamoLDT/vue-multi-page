import Vue from "vue";
import { makePath } from "./util";
import * as filters from "./filters";

// Vue.prototype.$bus = bus;
// 注册过滤器
for (let f of Object.keys(filters)) {
	Vue.filter(f, filters[f]);
}
// 全局共用方法
Vue.mixin({
	methods: {
		makePath
	}
});
console.log('vue',Vue)

export default Vue;
