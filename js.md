# JS

## JS原型链与继承
+ ECMAScript只支持实现继承;
+ 如果试图引用对象(实例instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去
找这个属性;
+ 原型链并非十分完美, 它包含如下两个问题:
   + 问题一: 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享;
   + 问题二: 在创建子类型(例如创建Son的实例)时,不能向超类型(例如Father)的构造函数中传递参数.

## Function和Objection的原型和原型链
```js
Object.__proto__ === Function.prototype    //ture
Function.__proto__ === Function.prototype    //ture
Function.__proto__ === Object.prototype    //false
Function.prototype.__proto__ === Object.prototype    //true


function Person(){};
 console.log(Person.prototype) //Person{}
 console.log(typeof Person.prototype) //Object
 console.log(typeof Function.prototype) // Function，这个特殊
 console.log(typeof Object.prototype) // Object
 console.log(typeof Function.prototype.prototype) //undefined



```

[JS原型链与继承别再被问倒了](https://juejin.im/post/6844903475021627400#heading-1)

---




## JS执行机制

### js时间循环
+ 同步任务
+ 异步任务


### 除了广义的同步任务和异步任务，我们对任务有更精细的定义
+ macro-task(宏任务)：包括整体代码script，setTimeout，setInterval
+ micro-task(微任务)：Promise，process.nextTick

[这一次，彻底弄懂JS执行机制（Event Loop）](https://juejin.im/post/6844903625500655629)

---



## async和await

async 和 await 用了同步的方式去做异步，async 定义的函数的返回值都是 promise，await 后面的函数会先执行一遍，然后就会跳出整个 async 函数来执行后面js栈的代码

[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)

---

## NEW 运算符
过程如下：
- 1.执行函数
- 2.自动创建一个空对象
- 3.把空对象和this绑定 
- 4.如果没有返还，隐式返还this
---







