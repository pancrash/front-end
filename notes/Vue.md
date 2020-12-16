## Vue 
---
### v-指令
- attr中各种方便实用的v-指令，v-if,v-show,v-on,v-for,v-bind,v-model等
   - v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建;
   - v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好;
   - v-model 在元素上创建双向数据绑定，可以监听用户的数据并且更新;
   - v-for 对一个列表进行渲染，指令需要使用 "item in items "形式的特殊语法，并且标记key值使得更新虚拟dom时更快速。

### methods，computed，watch
- 计算属性与methods的差异，watch与计算属性之间的差异
   - 计算属性是依赖别的属性的属性 如果依赖的属性没有更新的话，那么当前属性就使用之前的值
   - 计算属性是多对一的关系，多指的是依赖的属性，只会产出一个属性
   - watch是一对多的关系，有多个属性 需要依赖一个属性

### 组件
- 组件系统是Vue一个重要的概念，它提供了一种抽象，让我们可以使用独立可复用的小组件来构建大型应用，任意类型的应用界面都可以抽象为一个组件树
   - 注册组件：1、全局，整个应用中都可以使用；2、局部，只能在注册的环境下使用
   - 组件之间的传值，插槽
   - 组件的生命周期


## Router
---
### 两种模式
- vue-router在实现单页面前端路由时，提供了两种方式：Hash模式和History模式，根据mode参数来决定采用哪一种方式
   - hash模式：vue-router 默认hash模式，使用URL的hash来模拟一个完整的URL，于是当URL改变时，页面不会重新加载
   - history模式：这种模式充分利用了html5 history interface 中新增的 pushState() 和 replaceState() 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求
      - 这种模式还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问某一URL时就会返回 404

### 使用路由模块来实现页面跳转的方式
- 直接修改地址栏
- this.$router.push(‘路由地址’)
- <router-link to="路由地址"></router-link>

### 路由传参
### vue-router路由传参
用params传参，F5强制刷新参数会被清空
```js
//发送方
export default {
  methods: {
    routerTo() {
      this.$router.push({
        name: `testRouterTo`,
        params: {
          page: '1', code: '8989'
        }
      })
    }
  }
}


//接收方
export default{
  data() {
    return {
      page: '',
      code: ''
    }
  },
  created() {
    this.getRouterData()
  },
  methods: {
    getRouterData() {
      this.page = this.$route.params.page
      this.code = this.$route.params.code
      console.log('page', this.page)
      console.log('code', this.code)
    }
  }
}
```
用query，由于参数适用路径传参的所以F5强制刷新也不会被清空
```js
//发送方
export default {
  methods: {
    routerTo() {
      this.$router.push({
        name: `testRouterTo`,
        query: {
          page: '1', code: '8989'
        }
      })
    }
  }
}

//接受方
export default{
  data() {
    return {
      page: '',
      code: ''
    }
  },
  created() {
    this.getRouterData()
  },
  methods: {
    getRouterData() {
      this.page = this.$route.query.page
      this.code = this.$route.query.code
      console.log('page', this.page)
      console.log('code', this.code)
    }
  }
}
```

- 由于query与params传参机制不一样，造成的差异
   - 如果要隐藏参数用params
   - 如果强制刷新不被清除用query

### 守卫
- 在路由整个过程中的每个阶段都会有相应的钩子函数，使得在各个时段处理事务逻辑相当方便
   - 全局守卫 router.beforeEach, router.beforeResolve, router.afterEach
   - 路由独享守卫 beforeEnter
   - 组件内守卫 beforeRouteEnter, beforeRouteUpdate, beforeRouteLeave

## Vuex
---
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。但是使用 Vuex 可能是繁琐冗余的。如果应用够简单，最好不要使用 Vuex。一个简单的 global event bus 就足够使用了。但是，如果需要构建一个中大型单页应用，Vuex 将会成为自然而然的选择。

### state
- state访问状态对象，就是所有组件共享的数据
   -  Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
   -  改变 store 中的状态最好是提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。
- Mutations（mutation 必须是同步函数）
   - 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数
- Actions
   - Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态。Action 可以包含任意异步操作。
   - Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
- Module
   - 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割，便于维护。