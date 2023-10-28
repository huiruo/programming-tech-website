---
title: class-super
sidebar_position: 14
---

## class 的本质是 function

类定义不会被提升，这意味着，必须在访问前对类进行定义，否则就会报错。
它可以看作一个语法糖，让对象原型的写法更加清晰、更像面向对象编程的语法。

```js
class Example {
  constructor(a) {
    this.a = a;
  }
}
```

## 静态属性和静态方法

### 静态方法/静态属性定义在外部/实例属性(this)
class 本身的属性，即直接定义在类内部的属性（ Class.propname ），不需要实例化。 ES6 中规定，Class 内部只有静态方法，没有静态属性。

>ES6 中的类（Class）规定，类内部只有静态方法（static methods），没有静态属性。这意味着你不能在类的内部直接声明静态属性。静态属性通常是在类的外部定义的，并使用类名访问

```js
class MyClass {
  constructor(value) {
    this.instanceProperty = value; // 实例属性
  }

  static staticMethod() {
    console.log('This is a static method.');
  }
}

MyClass.staticMethod(); // 调用静态方法

const instance = new MyClass('Hello');
console.log(instance.instanceProperty); // 访问实例属性

// 定义和访问静态属性
MyClass.staticProperty = 'Static Property';
console.log(MyClass.staticProperty); // 访问静态属性
```

在上面的示例中，staticMethod 是一个静态方法，可以使用类名直接调用，而 instanceProperty 是一个实例属性，必须通过类的实例来访问。静态属性 staticProperty 是通过类的外部定义的，然后可以使用类名来访问。


公共属性(静态属性 staticProperty 是通过类的外部定义的)
```js
class Example {}
Example.prototype.a = 2;
```

### 实例属性：定义在实例对象 this 上的属性

```js
class Example {
  // 实例属性
  a = 2;
  constructor() {
    console.log(this.a);
  }
  // 原型方法
  sum(a, b) {
    console.log(a + b);
  }
}

let exam = new Example();
exam.sum(1, 2); // 3
```

### constructor 方法: 是类的默认方法，创建类的实例化对象时被调用

```js
class Example {
  constructor() {
    console.log("我是constructor");
  }
}

new Example(); // 我是constructor
```

### extends 允许一个子类继承父类，需要注意的是，子类的 constructor 函数中需要执行 super() 函数

```js
class Student {
  constructor() {
    console.log("I'm a student.");
  }

  study() {
    console.log("study!");
  }

  static read() {
    console.log("Reading Now.");
  }
}

console.log(typeof Student); // function

let stu = new Student(); // "I'm a student."

stu.study(); // "study!"
stu.read(); // "Reading Now."
```

## 扩展:super 这个关键字，既可以当作函数使用，也可以当作对象使用。

```
1.作为方法使用只能在子类的构造函数中。
2.作为对象使用，在普通方法中，指向父类的原型对象;在静态方法中，指向父类
```

### 1.作为函数调用

```js
class A {}
class B extends A {
  constructor() {
    // 此时代表父类的构造函数，表示执行父类A 的构造函数
    super(); //ES6 要求，子类的构造函数必须执行一次super函数
  }
}
```

>注意：虽然super 代表了A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例。
super()在这里相当于 A.prototype.constructor.call(this);

### 2.作为对象使用

1.在普通方法中，指向父类的原型对象

```js
class A {
  c() {
    return 2;
  }
}
class B extends A {
  constructor() {
    super();
    console.log(super.c()); // 2 这时，super在普通方法之中，指向A.prototype，所以super.c()就相当于A.prototype.c()
  }
}
let b = new B();
```

实例 2：

```js
class A {
  constructor() {
    this.x = 1;
  }
  fn(){
  }
  // x(){
  // }
}
class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}
let b = new B();
console.log("A:",A.prototype)
```

>解析：
上面代码中，super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。
注意，使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错
