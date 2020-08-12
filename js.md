# 记录JS学习的知识点
## JS原型链与继承
+ ECMAScript只支持实现继承;
+ 如果试图引用对象(实例instance)的某个属性,会首先在对象内部寻找该属性,直至找不到,然后才在该对象的原型(instance.prototype)里去找这个属性;
+ 原型链并非十分完美, 它包含如下两个问题:
   + 问题一: 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享;
   + 问题二: 在创建子类型(例如创建Son的实例)时,不能向超类型(例如Father)的构造函数中传递参数.
### 借用构造函数
##### 为解决原型链中上述两个问题, 我们开始使用一种叫做借用构造函数(constructor stealing)的技术(也叫经典继承).
##### 基本思想:即在子类型构造函数的内部调用超类型构造函数.
    function Father(){
        this.colors = ["red","blue","green"];
    }
    function Son(){
        Father.call(this);//继承了Father,且向父类型传递参数
    }
    var instance1 = new Son();
    instance1.colors.push("black");
    console.log(instance1.colors);//"red,blue,green,black"
    var instance2 = new Son();
    console.log(instance2.colors);//"red,blue,green" 可见引用类型值是独立的
很明显,借用构造函数一举解决了原型链的两大问题:
其一, 保证了原型链中引用类型值的独立,不再被所有实例共享;
其二, 子类型创建时也能够向父类型传递参数.
随之而来的是, 如果仅仅借用构造函数,那么将无法避免构造函数模式存在的问题--方法都在构造函数中定义, 因此函数复用也就不可用了.而且超类型(如Father)中定义的方法,对子类型而言也是不可见的. 考虑此,借用构造函数的技术也很少单独使用.




