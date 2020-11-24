## React
---
### 总体概念
- 主体由两部分构成
  - React.js 提供 React.js 核心功能代码，如：虚拟 dom，其他组件等
  - ReactDOM 提供了与浏览器交互的 DOM 功能，如：dom 渲染
- JSX语法
  - 前端MVVM主流框架都有一套自己的模板处理方法，react则使用它独特的jsx语法。在组件中插入html类似的语法，简化创建view的流程。
  - JSX中可以通过{表达式}添加js表达式，但无法使用js语句
  - 使用JSX时必须保证有且仅有一个顶层元素，如不希望结构复杂，可以使用React本身提供的Fragement

### 组件
- 两种创建组件的方式
  - 1、通过继承React提供的Component类；
  - 2、通过纯函数创建；
  - 两种方式各有优势，但个人觉得通过纯函数加Hooks的方式更为方便；
- 组件内部及组件间状态
  - state定义
    - 在类组件中创建一个state属性
    - 在函数组件中使用钩子函数useState()
  - 更新state
    - 可以直接更改state，但无法触发组件视图的更新机制
    - setState(updater, [callback])
      - updater: 更新数据 FUNCTION/OBJECT
      - callback: 更新成功后的回调 FUNCTION
      - 异步:react通常会集齐一批需要更新的组件，然后一次性更新来保证渲染的性能
      - 浅合并，所以只需要返回要修改的状态即可，但是如果状态中包含有引用类型的数据，只修改数据中的某一项，需要我们自己对数据进行合并
      - 调用 setState 之后，会触发生命周期，重新渲染组件
  - 受控组件与非受控组件
    - 当想要获取表单的一些内部状态时，就可以将表单的内部状态和组件的状态进行绑定，这样就形成受控组件
    - 受控组件：让表单控件的内部状态和 state 保持一致
    - 非受控组件：不需要同步 value 值(defaultValue，defaultChecked)
  - 组件间通信
    - 在 React.js 中，数据是从上自下流动（传递）的，也就是一个父组件可以把它的 state / props 通过 props 传递给它的子组件，但是子组件不能修改 props。因为React.js 是单向数据流，如果子组件需要修改父组件状态（数据），是通过回调函数方式来完成的。
    - 父 -> 子通信：把数据添加子组件的属性中，然后子组件中从props属性中，获取父级传递过来的数据
    - 子 -> 父通信：在父级中定义相关的数据操作方法(或其他回调), 把该方法传递给子级，在子级中调用该方法父级传递消息 
    - 跨组件通信详见Redux
- 组件生命周期及钩子函数
  - 挂载( mount 将组件初始化，并且渲染到DOM中):
    - constructor
    - static getDerivedStateFromProps(props) 
      - 注意 this 问题
    - render
    - componentDidMount -- 处理副作用(请求)
  - 更新阶段 ( update 组件发生更新，并且生成新的虚拟DOM，并根据新的虚拟DOM，完成真实DOM的修改):
    - static getDerivedStateFromProps(props, state)
    - shouldComponentUpdate()  -- 判断是否更新
    - render()
    - getSnapshotBeforeUpdate() 
    - componentDidUpdate() -- 处理副作用(请求)
  - 卸载阶段 (unMount 将组件从真实DOM中删除)
    - componentWillUnmount 组件即将卸载

## React Router
- Route组件
  - 设置单个路由信息，Route 组件所在的区域就是就是当 URL 与当前 Route 设置的 path 属性匹配的时候，后面 component 将要显示的区域；
  - exact属性：由于React Router 默认模糊匹配，在需要精确匹配时，可以添加exact：true属性；
  - 传递参数
    - 如果 Route 使用的是 component 来指定组件，那么不能使用 props
    - 通过 render 属性来指定渲染函数，render 属性值是一个函数，当路由匹配的时候指定该函数进行渲染

```jsx
<Route exact path='/' render={() => <Home items={this.state.items} />} />
```

- Link
  - Link 组件用来处理链接类似的功能（它会在页面中生成一个 a 标签），但拦截了实际 a 标签的默认动作，然后根据所有使用的路由模式（Hash 或者 HTML5）来进行处理，改变了URL，但没有发生请求，同时根据 Route 中的设置把对应的组件显示在指定的位置
  - to属性：跳转路由，类似 a 标签中的 href
- NavLink 组件
  - Link 类似，但是它提供了两个特殊属性用来处理页面导航
  - activeStyle：当前 URL 与 NavLink 中的 to 匹配的时候，激活 activeStyle 中的样式
  - activeClassName：与 activeStyle 类似，但是激活的是 className
  - isActive：默认情况下，匹配的是 URL 与 to 的设置，通过 isActive 可以自定义激活逻辑，isActive 是一个函数，返回布尔值
- Switch 组件
  - 该组件只会渲染首个被匹配的组件，常用做捕获错误路由并返回404页面
- Redirect 组件
  - 重定向
- 路由 Hooks
  - React为函数组件获取当前路由提供了一些hooks
  - useHistory
  - useLocation
  - useParams
  - useRouteMatch

## Redux
- Redux 是一个独立的 JavaScript 状态管理库，用来实现跨组件的状态传递
- 基本概念
  - state 状态 - 数据存储
  - reducer 纯函数 - 提供修改状态的方法
  - store 仓库 - 管理状态
  - action 动作 - 对 state 的修改动作
- State
  - 用于存储并统一管理的对象数(Object Tree)
  - 状态修改：使用纯函数修改reducer(state, action)
- Reducer
  1. 相同的输入永远返回相同的输出
  2. 不修改函数的输入值
  3. 不依赖外部环境状态
  4. 无任何副作用
- Action
  - 在修改state时通过传入action来确定具体的操作
  - type 属性：表示要进行操作的动作类型
  - payload 属性：操作 state 的同时传入的数据
  - 需要注意的是，不直接去调用 Reducer 函数，而是通过 Store 对象提供的 dispatch 方法来调用，类似于trigger函数
- combineReducers(reducers)
  - 将 reducer 函数拆分成多个单独的函数，拆分后的每个函数负责独立管理 state 的一部分
- react-redux 
  - react项目中的 redux 绑定库，为函数组件提供相应的hooks

