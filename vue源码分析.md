```javascript

vue2.0版本相关问题

事件循环大致分为以下几个步骤：
所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
主线程不断重复上面的第三步。
https://vue-js.com/learn-vue/instanceMethods/lifecycle.html#_3-vm-nexttick


为什么使用虚拟dom？
每个组件对应只有一个render watcher对象 当数据改变时 触发对应的更新时 
并不知道更新的方法具体影响了那些页面更新 所以需要vnode去进行diff比对


挂载阶段都干了什么？
在该阶段中所做的主要工作是创建Vue实例并用其替换el选项对应的DOM元素，同时还要开启对模板中数据（状态）的监控，当数据（状态）发生变化时通知其依赖进行视图更新

销毁阶段都干了什么？
我们知道了，当调用了实例上的vm.$destory方法后，实例就进入了销毁阶段，在该阶段所做的主要工作是将当前的Vue实例从其父级实例中删除，取消当前实例上的所有依赖追踪并且移除实例上的所有事件监听器。


当我们更新了message的数据后，立即获取vm.$el.innerHTML，发现此时获取到的还是更新之前的数据：123。但是当我们使用nextTick来获取vm.$el.innerHTML时，此时就可以获取到更新后的数据了。这是为什么呢？
这里就涉及到Vue中对DOM的更新策略了，Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个事件队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到事件队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新事件队列并执行实际 (已去重的) 工作


##### vue nextTick如何实现（）

能力检测
根据能力检测以不同方式执行回调队列

---有一个定义好的flushCallbacks函数用来执行callbacks里的所有回调函数
---还有一个执行函数timerFunc。 Vue 在内部对异步队列其实是做了四个判断，对当前环境进行不断的降级处理，尝试使用原生的Promise.then、MutationObserver和setImmediate，上述三个都不支持最后使用setTimeout，将执行函数timerFunc放入执行任务中

流程：

1. 把回调函数放入callbacks等待执行；	
2. 将执行函数放到微任务或者宏任务中；
3. 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调。

参考 https://juejin.im/post/6869947649248722952



##### vue diff算法实现 
https://github.com/aooy/blog/issues/2
https://juejin.cn/post/6844903607913938951

patch函数作用：

1、 两个vnode的key和sel相同才去比较它们，比如p和span，div.classA和div.classB都被认为是不同结构而不去比较它们。
    如果值得比较会执行patchVnode(oldVnode, vnode)，稍后会详细讲patchVnode函数。
2、 当不值得比较时，新节点直接把老节点整个替换了
    取得oldvnode.el的父节点，parentEle是真实dom
    createEle(vnode)会为vnode创建它的真实dom，令vnode.el =真实dom
    parentEle将新的dom插入，移除旧的dom

function patch (oldVnode, vnode) {
	if (sameVnode(oldVnode, vnode)) {  
		patchVnode(oldVnode, vnode)
	} else {
		const oEl = oldVnode.el
		let parentEle = api.parentNode(oEl)
		createEle(vnode)
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
			api.removeChild(parentEle, oldVnode.el)
			oldVnode = null
		}
	}
	return vnode
}

patchVnode函数作用：

节点的比较有5种情况
1、if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。
2、if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，需要修改，则会调用Node.textContent = vnode.text。
3、if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，这样我们会调用updateChildren函数比较子节点，这是diff的核心，后边会讲到。
4、else if (ch)，只有新的节点有子节点，调用createEle(vnode)，vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点。
5、else if (oldCh)，新节点没有子节点，老节点有子节点，直接删除老节点。

重点updateChildren函数 ：
过程可以概括为：oldCh和newCh各有两个头尾的变量StartIdx和EndIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了key，就会用key进行比较，在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和newCh至少有一个已经遍历完了，就会结束比较



watcher 被添加进依赖时机？
除了computedwatcher 其他的都是在new Watcher时 调用get方法时 读取了依赖的属性时 参照下行
回顾一下我们在数据侦测篇文章中介绍Watcher类的时候，Watcher类构造函数的第二个参数支持两种类型：函数和数据路径（如a.b.c）。如果是数据路径，会根据路径去读取这个数据；如果是函数，会执行这个函数。一旦读取了数据或者执行了函数，就会触发数据或者函数内数据的getter方法，而在getter方法中会将watcher实例添加到该数据的依赖列表中，当该数据发生变化时就会通知依赖列表中所有的依赖，依赖接收到通知后通知更新视图

##### vue watch  --->renderdwatcher
$mount挂载的时候  开启对模板中数据（状态）的监控
updateComponent = () => {
        vm._update(vm._render(), hydrating)
    }
new Watcher(vm, updateComponent, noop, {
        before () {
            if (vm._isMounted) {
                callHook(vm, 'beforeUpdate')
            }
        }
}, true /* isRenderWatcher */)

只有一个renderdwatcher  监听发生变化的时候 更新updateComponent  diff算法 实现页面更新
computedwatcher userwatcher 能有多个

##### computer  --->computedwatcher
function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      } else if (vm.$options.methods && key in vm.$options.methods) {
        warn(`The computed property "${key}" is already defined as a method.`, vm)
      }
    }
  }
}

export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
/* computed watcher关键点 添加进依赖 + 取值*/
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) {    //watcher.dirty 为true表示计算取值  false 缓存取值 
        watcher.evaluate()  
        //调用该方法evaluate() 去调用watcher里的get方法 同时设置watcher.dirty=false  调用更新函数watcher.update重新设置dirty=true
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

##### watch  --->userwatcher
1、初始化状态 获取到传递的watch配置对象 传递给initWatch
function initState(vm) {  // 初始化所有状态时
  vm._watchers = []  // 当前实例watcher集合
  const opts = vm.$options  // 合并后的属性
  
  ... // 其他状态初始化
  
  if(opts.watch) {  // 如果有定义watch属性
    initWatch(vm, opts.watch)  // 执行初始化方法
  }
}

2、初始化watch 遍历组件中定义的watch对象
function initWatch (vm, watch) {  // 初始化方法
  for (const key in watch) {  // 遍历watch内多个监听属性
    const handler = watch[key]  // 每一个监听属性的值 （watch不同的配置https://cn.vuejs.org/v2/api/#watch）
    if (Array.isArray(handler)) {  // 如果该项的值为数组
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i])  // 将每一项使用watcher包装
      }
    } else {
      createWatcher(vm, key, handler) // 不是数组直接使用watcher
    }
  }
}

3、将watch里的配置定义最后解析结果为 key 函数 是对象配置时 还有其他options选项
function createWatcher (vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) { // 如果是对象，参数移位
    options = handler  
    handler = handler.handler
  }
  if (typeof handler === 'string') {  // 如果是字符串，表示为方法名
    handler = vm[handler]  // 获取methods内的方法
  }
  //最后将 key 函数 options选项传给$watch去创建对应的watch对象
  return vm.$watch(expOrFn, handler, options)  // 封装
}
//最后还是调用new Watcher()
 Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      const info = `callback for immediate watcher "${watcher.expression}"`
      pushTarget()
      invokeWithErrorHandling(cb, vm, [watcher.value], vm, info)
      popTarget()
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }


##### $on 
$on和$emit这两个方法的内部原理是设计模式中最典型的发布订阅模式，首先定义一个事件中心，通过$on订阅事件，将事件存储在事件中心里面，然后通过$emit触发事件中心里面存储的订阅事件
Vue.prototype.$on = function (event, fn) {
    const vm: Component = this
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            this.$on(event[i], fn)
        }
    } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn)
    }
    return vm
}
##### $emit
Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
}

##### $off 对应获取 ---》 let cbs = vm._events[event] -> cbs.splice(i, 1)
##### $once
Vue.prototype.$once = function (event, fn) {
    const vm: Component = this
    function on () {
        vm.$off(event, on)
        fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
}

##### vue  $set 
最终还是通过 defineReactive(ob.value, key, val)为响应式对象添加新的属性 通过ob.dep.notify()通知更新 
通过 splice ------》 target.splice(key, 1, val)  为数组添加元素 数组方法都是重写覆盖默认方法的 重写方法内部调用更新



##### Vue.use 
Vue.use = function (plugin) {
  // 首先定义了一个变量installedPlugins,该变量初始值是一个空数组，用来存储已安装过的插件。首先判断传入的插件是否存在于installedPlugins数组中（即已被安装过），如果存在的话，则直接返回，防止重复安装
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }

    // 接下来获取到传入的其余参数，并且使用toArray方法将其转换成数组，同时将Vue插入到该数组的第一个位置，这是因为在后续调用install方法时，Vue必须作为第一个参数传入
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
}



##### directive、filter、component
export const ASSET_TYPES = [
  'component',
  'directive',
  'filter'
]
Vue.options = Object.create(null)
ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
})

ASSET_TYPES.forEach(type => {
    Vue[type] = function (id,definition) {
        if (!definition) {
            return this.options[type + 's'][id]
        } else {
            if (process.env.NODE_ENV !== 'production' && type === 'component') {
                validateComponentName(id)
            }
            if (type === 'component' && isPlainObject(definition)) {
                definition.name = definition.name || id
                definition = this.options._base.extend(definition)
            }
            if (type === 'directive' && typeof definition === 'function') {
                definition = { bind: definition, update: definition }
            }
            this.options[type + 's'][id] = definition
            return definition
        }
    }
})

##### vue filter
1、定义filter的时候 会将对应的filter都保存在vm.$options.filters中 
2、模版编译解析的时候  parseFilters 从传入的过滤器字符串中解析出待处理的表达式expression和所有的过滤器filters数组 最后，将解析得到的expression和filters数组通过调用wrapFilter函数将其构造成_f函数调用字符串  也是在此处处理的一个或者多个过滤器
if (filters) {
    for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i])
    }
}
function wrapFilter (exp, filter) {
  const i = filter.indexOf('(')
  if (i < 0) {
    return `_f("${filter}")(${exp})`
  } else {
    const name = filter.slice(0, i)
    const args = filter.slice(i + 1)
    return `_f("${name}")(${exp}${args !== ')' ? ',' + args : args}`
  }
}
过滤器的内部工作原理，就是将用户写在模板中的过滤器通过模板编译，编译成_f函数的调用字符串，之后在执行渲染函数的时候会执行_f函数，从而使过滤器生效。
所谓_f函数其实就是resolveFilter函数的别名，在resolveFilter函数内部是根据过滤器id从当前实例的$options中的filters属性中获取到对应的过滤器函数，在之后执行渲染函数的时候就会执行获取到的过滤器函数。


##### vue directive 
首先，我们知道了如果一个DOM节点上绑定了指令，那么在这个DOM节点所对应虚拟DOM节点进行渲染更新的时候，不但会处理节点渲染更新的逻辑，还会处理节点上指令的相关逻辑。具体处理指令逻辑的时机是在虚拟DOM渲染更新的create、update、destory阶段。

接着，我们介绍了Vue对于自定义指令定义对象提供了几个钩子函数，这几个钩子函数分别对应着指令的几种状态，我们可以根据实际的需求将指令逻辑写在合适的指令状态钩子函数中，比如，我们想让指令所绑定的元素一插入到DOM中就执行指令逻辑，那我们就应该把指令逻辑写在指令的inserted钩子函数中。

接着，我们逐行分析了updateDirectives函数，在该函数中就是对比新旧两份VNode上的指令列表，通过对比的异同点从而执行指令不同的钩子函数，让指令生效。

最后，一句话概括就是：所谓让指令生效，其实就是在合适的时机执行定义指令时所设置的钩子函数

function updateDirectives (oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode)
  }
}
//重点 
function _update (oldVnode, vnode) {
  const isCreate = oldVnode === emptyNode //新增
  const isDestroy = vnode === emptyNode //销毁
  //新旧指令集合对象
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)

  const dirsWithInsert = []   //包含所有Insert钩子的指令数组集合 
  const dirsWithPostpatch = []//包含所有componentUpdated钩子的指令数组集合 

  let key, oldDir, dir
  //遍历新的指令集合对象
  for (key in newDirs) {
    oldDir = oldDirs[key]   //匹配旧的指令集合对象是否有当前指令
    dir = newDirs[key]
    if (!oldDir) {  //没匹配到 表示 新增 第一个绑定指令
      // new directive, bind
      callHook(dir, 'bind', vnode, oldVnode)  //触发指令的bind钩子函数
      if (dir.def && dir.def.inserted) {  //当前指令有设置inserted钩子 添加进dirsWithInsert
        dirsWithInsert.push(dir)
      }
    } else {  
      // existing directive, update 更新
      dir.oldValue = oldDir.value
      dir.oldArg = oldDir.arg
      callHook(dir, 'update', vnode, oldVnode) //触发指令的update钩子函数
      if (dir.def && dir.def.componentUpdated) {  
        //当前指令有设置componentUpdated钩子 dirsWithPostpatch
        dirsWithPostpatch.push(dir)
      }
    }
  }

  if (dirsWithInsert.length) {
    const callInsert = () => {
      for (let i = 0; i < dirsWithInsert.length; i++) {
        callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
    }
    if (isCreate) {
      // 是一个新增的节点，如何保证它已经被插入到父节点了呢？
      // 虚拟DOM渲染更新的insert钩子函数和指令的inserted钩子函数合并 
      //新增 第一个绑定指令 合并当前指令insert钩子到vnode的insert钩子阶段执行
      mergeVNodeHook(vnode, 'insert', callInsert)
    } else {
      //更新的 直接执行所有更新指令的inserted钩子
      callInsert()
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', () => {
      for (let i = 0; i < dirsWithPostpatch.length; i++) {
      //指令的componentUpdated需要等到对应的组件更新完才执行 所有合并到渲染更新的postpatch钩子阶段执行
        callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
      }
    })
  }

  //遍历旧的钩子集合 发现新的钩子里不存在是 说明解绑了该指令
  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
      }
    }
  }
}
https://vue-js.com/learn-vue/directives/customDirectives.html#_2-%E4%BD%95%E6%97%B6%E7%94%9F%E6%95%88

##### keep-alive
https://vue-js.com/learn-vue/BuiltInComponents/keep-alive.html#_3-%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86

//遍历获取每个缓存组件的name  调用pruneCacheEntry销毁不符合匹配的组件
function pruneCache (keepAliveInstance, filter) {
  const { cache, keys, _vnode } = keepAliveInstance
  for (const key in cache) {
    const cachedNode = cache[key]
    if (cachedNode) {
      const name = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// pruneCacheEntry函数 销毁指定的组件
function pruneCacheEntry (cache,key,keys,current) {
  const cached = cache[key]
  /* 判断当前没有处于被渲染状态的组件，将其销毁*/
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created () {
    //this.cache是一个对象，用来存储需要缓存的组件，它将以如下形式存储：
//    this.cache = {
//      'key1':'组件1',
//      'key2':'组件2',
//       // ...
//    }
    this.cache = Object.create(null) 
    //this.keys是一个数组，用来存储每个需要缓存的组件的key，即对应this.cache对象中的键值
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    //如果include 或exclude 发生了变化，即表示定义需要缓存的组件的规则或者不需要缓存的组件的规则发生了变化，那么就执行pruneCache函数
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render() {
    /* 获取默认插槽中的第一个组件节点 */
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    /* 获取该组件节点的componentOptions */
    const componentOptions = vnode && vnode.componentOptions

    if (componentOptions) {
      /* 获取该组件节点的名称，优先获取组件的name字段，如果name不存在则获取组件的tag */
      const name = getComponentName(componentOptions)

      const { include, exclude } = this
      /* 如果name不在inlcude中或者存在于exlude中则表示不缓存，直接返回vnode */
      if (
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      //-------------缓存相关逻辑---------------
      //首先获取组件的key值：
      const { cache, keys } = this
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      /* 如果命中缓存，则直接从缓存中拿 vnode 的组件实例 */
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        /* 调整该组件key的顺序，将其从原来的地方删掉并重新放在最后一个 */
        remove(keys, key)
        keys.push(key)
      } else {
        /* 如果没有命中缓存，则将其设置进缓存 */
        cache[key] = vnode
        keys.push(key)
        /* 如果配置了max并且缓存的长度超过了this.max，则从缓存中删除第一个 */
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
//  缓存组件超过设置的最大缓存数处理策略
// 1、将新数据从尾部插入到this.keys中；
// 2、每当缓存命中（即缓存数据被访问），则将数据移到this.keys的尾部；
// 3、当this.keys满的时候，将头部的数据丢弃


##### vue-router
1、是个插件 实现了router-view router-link两个全局组件
核心步骤:
步骤一:使用vue-router插件，router.js
 import Router from 'vue-router'
 Vue.use(Router)
步骤二:创建Router实例，router.js 
  export default new Router({...})
步骤三:在根组件上添加该实例，main.js
  import router from './router'
  new Vue({
    router,
  }).$mount("#app");
步骤四:添加路由视图，App.vue 
 <router-view></router-view>
 实现install方法，如何注册$router？
就是刚开始Vue.use(Router)的时候，Router实例还没有创建，无法访问路由相关信息
所以Router实例创建完成后在main.js引入并添加到根组件
vue-router实现了一个延时的全局混入beforeCreate生命周期 
在这里可以访问到已经实例化完成的路由信息 获取到添加到根组件的router信息 进行挂载到vue
// 任务1:挂载$router 
Vue.mixin({
    beforeCreate() {
    // 只有根组件拥有router选项
    if (this.$options.router) {
            // vm.$router
            Vue.prototype.$router = this.$options.router;
      }
} });





数据响应式:current变量持有url地址，一旦变化，动态重新执行render



##### vue 响应式数据原理
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}

参考 https://segmentfault.com/a/1190000006599500#articleHeader4

##### v-molde语法糖

<input v-bind:value="something" v-on:input="something=$event.target.value">

v-model的原理就是v-bind数据绑定 与 v-on处理函数绑定的语法糖

想要组件 v-model生效 它必须:

- **「接收一个value属性」**
- **「在value值改变时 触发input事件」**


vue3.0相关问题：
ref(),用于将一些基本类型属性转换为响应式对象 通过.value获取值
reactive(),用于将对象、数组这些复杂类型转换为响应式对象
toRefs(),用于将响应式对象 - props对象 里的所有属性转换为响应式对象，转换完结果类似ref()
toRef(),跟toRefs类似，不过一个是转换对象里所有属性，一个是转换指定的单个属性



```