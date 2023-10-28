---
title: es6-es7-es8
sidebar_position: 13
---

## 汇总
1. let 与 const
2. 解构赋值和默认参数
3. Symbol
4. Map 与 Set
5. Reflect 与 Proxy
6. 字符串
7. 数值
8. 对象
9. 数组
10. 函数
11. Class 类
12. 模块
13. Promise 对象
14. Generator 函数
15. async 函数

## let 与 const
参考：[作用域-块级作用域原理](../parsing-interpretation-compilation/step2-作用域-块级作用域原理)

ES6 明确规定，代码块内如果存在 let 或者 const，代码块会对这些命令声明的变量从块的开始就形成一个封闭作用域。

const 如何做到变量在声明初始化之后不允许改变的？
`const其实保证的不是变量的值不变，而是保证变量指向的内存地址所保存的数据不允许改动。`

简单类型和复合类型保存值的方式是不同的。

对于简单类型（数值 number、字符串 string 、布尔值 boolean）,值就保存在变量指向的那个内存地址，因此 const 声明的简单类型变量等同于常量。

而复杂类型（对象 object，数组 array，函数 function），变量指向的内存地址其实是保存了一个指向实际数据的指针，所以 const 只能保证指针是固定的，至于指针指向的数据结构变不变就无法控制了
## 解构赋值
1. 数组解构
```js
// 1.基本
let [a, b, c] = [1, 2, 3];
console.log('a, b, c',a, b, c)

// 2.剩余运算符
let [a, ...b] = [1, 2, 3];
// a = 1
// b = [2, 3]

// 3.解构默认值
let [a = 2] = [undefined]; // a = 2
```

2. 对象解构
```js
// 1.基本
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
console.log('foo, bar',foo, bar)

// 2.剩余运算符
let {a, b, ...rest} = {a: 10, b: 20, c: 30, d: 40};
// a = 10
// b = 20
// rest = {c: 30, d: 40}

// 3.解构默认值
let {a = 10, b = 5} = {a: 3};
// a = 3; b = 5;

// 不完全解构
let obj = {p: [{y: 'world'}] };
let {p: [{ y }, x ] } = obj;
// x = undefined
// y = 'world'
```
## Symbol
参考：[数据类型symbol](./数据类型symbol)

## Map 与 Set
## Reflect 与 Proxy
Reflect 可以用于获取目标对象的行为，它与 Object 类似，但是更易读，为操作对象提供了一种更优雅的方式。

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

## 字符串
1. 模板字符串

2. 其他<br/>
includes()：返回布尔值，判断是否找到参数字符串。
startsWith()：返回布尔值，判断参数字符串是否在原字符串的头部。
endsWith()：返回布尔值，判断参数字符串是否在原字符串的尾部。
```js
let string = "apple,banana,orange";
string.includes("banana");     // true
string.startsWith("apple");    // true
string.endsWith("apple");      // false
string.startsWith("banana",6)  // true
```

## 数值
## 对象
1. 方法名可以简写
```js
const person = {
  sayHi(){
    console.log("Hi");
  }
}
person.sayHi();  // "Hi"

// 等同于
const person = {
  sayHi:function(){
    console.log("Hi");
  }
}
person.sayHi();// "Hi"
```

2. ES6允许用表达式作为属性名，但是一定要将表达式放在方括号内。
```js
const obj = {
 ["he"+"llo"](){
   return "Hi";
  }
}

obj.hello();  //"Hi"
```

3. 拓展运算符（...）用于取出参数对象所有可遍历属性然后拷贝到当前对象。
```js
// 基本用法
let person = {name: "Amy", age: 15};
let someone = { ...person };
console.log(someone);  //{name: "Amy", age: 15}
```

4. Object.assign() 将源对象的所有可枚举属性复制到目标对象中
```js
let target = {a: 1};
let object2 = {b: 2};
let object3 = {c: 3};
Object.assign(target,object2,object3);  

// 第一个参数是目标对象，后面的参数是源对象
console.log(target);  // {a: 1, b: 2, c: 3}
```

5. Object.is(value1, value2)
与（===）的区别
```js
// +0不等于-0
Object.is(+0,-0);  //false
+0 === -0  //true
// NaN等于本身
Object.is(NaN,NaN); //true
NaN === NaN  //false
```

## 数组
1. map
2. find
```js
let arr = Array.of(1, 2, 3, 4);
console.log(arr.find(item => item > 2)); // 3
```
3. findIndex
```js
let arr = Array.of(1, 2, 1, 3);
// 参数1：回调函数
// 参数2(可选)：指定回调函数中的 this 值
console.log(arr.findIndex(item => item == 2)); // 1
```
4. filter

5. every
6. some
7. reduce
8. reduceRight

9. forEach()
10. Array.prototype.includes() es7
```js
['a', 'b', 'c'].includes('a')  // true
```

11. keys 遍历键名
```js
for(let key of ['a', 'b'].keys()){
    console.log(key);
}
// 0
// 1
```

12. values 遍历键值
```js
for(let value of ['a', 'b'].values()){
    console.log(value);
}
// "a"
// "b"
```

13. includes() 数组是否包含指定值。
```js
[1, 2, 3].includes(1);    // true
```

Array.from() 将类数组对象和可遍历对象转化为数组．
```js
console.log(Array.from([1, 2])); // [1, 2]

let arr = Array.from({
  0: '1',
  1: '2',
  2: 3,
  length: 3
});
console.log(arr); // ['1', '2', 3]
 
// 没有 length 属性,则返回空数组
let array = Array.from({
  0: '1',
  1: '2',
  2: 3,
});
console.log(array); // []
```

Array.of(): 将参数中所有值作为元素形成数组。
```js
console.log(Array.of(1, 2, 3, 4)); // [1, 2, 3, 4]
```

## 函数
1. 箭头函数：this
JavaScript 的 this 对象一直很令人头大，回调函数，经常看到 var self = this 这样的代码，为了将外部 this 传递到回调函数中，那么有了箭头函数，就不需要这样做了，直接使用 this 就行
```
1.不需要 function 关键字来创建函数
2.省略 return 关键字
3.继承当前上下文的 this 关键字
箭头函数中，函数体内的`this`对象，就是定义时所在作用域的对象，而不是使用时所在的作用域的对象。
```

2. 不定参数:不定参数用来表示不确定参数个数
```js
function f(...values){
    console.log(values.length);
}
f(1,2);      //2
f(1,2,3,4);  //4
```

3. 默认参数
```js
const params = [1, 6, 3]

function sum(x = 1, y = 2, z = 3) {
    return x + y + z;
}
console.log(sum(...params)); // ES2015
```

1. for of
```js
for (const value of res) {
  const {
    orderId,
    price,
    qty,
    quoteQty,
    time,
    isBuyer,
    isMaker,
  } = value

  console.log('price:', price);
}
```

3. Object.getOwnPropertyDescriptors() es8

该方法会返回目标对象中所有属性的属性描述符，该属性必须是对象自己定义的，不能是从原型链继承来的。
```js
// 与getOwnPropertyDescriptor()比较,两者的区别：一个是只返回属性名的描述对象,一个返回目标对象所有自身属性的描述对象
const obj = {
    id: 1,
    name: 'test',
    get gender() {
        console.log('gender')
    },
    set grad(d) {
        console.log(d)
    }
}
console.log(Object.getOwnPropertyDescriptor(obj, 'id'))
// {value: 1, writable: true, enumerable: true, configurable: true}
console.log(Object.getOwnPropertyDescriptors(obj))  // 打印所有属性
```

6. 修饰器Decorator ES8

3. Object.values() Object.entries() es8
entries()作用：将一个对象中可枚举属性的键名和键值按照二维数组的方式返回。
若对象是数组，则会将数组的下标作为键值返回。

values()只返回自己的键值对中属性的值。它返回的数组顺序，也跟Object.entries()保持一致

```js
Object.entries({ one: 1, two: 2 })    //[['one', 1], ['two', 2]]
Object.entries([1, 2])                //[['0', 1], ['1', 2]]

Object.values({ one: 1, two: 2 })            //[1, 2]
Object.values({ 3: 'a', 4: 'b', 1: 'c' })    //['c', 'a', 'b']
```

## Class 类
## 模块
```
模块化-03-es6模块静态编译.md
```
## Promise 对象
## Generator 函数
1. async 是 ES7

## async 函数
