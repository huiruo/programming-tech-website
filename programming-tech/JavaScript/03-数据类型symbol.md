---
title: 数据类型symbol
sidebar_position: 3
---

## 基本使用
* 创建时，我们可以给 symbol 一个描述（也称为 symbol 名），这在代码调试时非常有用

symbol 保证是唯一的。即使我们创建了许多具有相同描述的 symbol，它们的值也是不同。描述只是一个标签，不影响任何东西。
```js
// id 是描述为 "id" 的 symbol
let id = Symbol("id");
let id2 = Symbol("id");
console.log(id == id2); // false

console.log('可以这样输出：',id.toString()); // Symbol(id)
console.log('可以这样输出：',id); // Symbol(id)
console.log('可以这样输出：',id.description); // id
```

## symbol特点
* symbol 属性不参与 for..in 循环
* Object.keys(user)和getOwnPropertyNames 也会忽略它们。这是一般“隐藏符号属性”原则的一部分。
* Object.assign 可以浅拷贝 
* 如果我们要在对象字面量 {...} 中使用 symbol，则需要使用方括号把它括起来。例如下面：

```js
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123,
  [id]: 124, // 会覆盖
};

for (let key in user){
  console.log(key); // name, age（没有 symbol）
} 

console.log('obj:',Object.keys(user)) // ['name', 'age']
console.log('obj:',Object.getOwnPropertyNames(user)) // ['name', 'age']

// 使用 symbol 任务直接访问
console.log("Direct: ",user,'--',user[id]); // Direct: 123

let clone = Object.assign({}, user);
console.log('但是可以浅拷贝:',clone[id] );
```

## 用处1：symbol的值肯定是唯一的，可以用来解决命名冲突问题
```js
let test1 = Symbol("ack");
console.log("test1:", test1); // Symbol(test1)
console.log(typeof test1); // Symbol;

// 看下面的比较
let test2 = Symbol("ack"); // false
// 作用1：symbol的值肯定是唯一的，可以用来解决命名冲突问题
console.log(test1 === test2); // false 表示两个变量不一样
```

作用2：Symbol可以当作对象的属性名
```js
/*
- 1.Symbol值作为对象的属性名时，不能使用点运算符
- 2.如果要访问Symbol属性对应的值，需要使用中括号[]
*/
const key3 = Symbol('key3')
const testObj = {
    key1:"val1",
    key2:'val2',
    [key3]:"val3"
}

console.log('testObj:',testObj)
console.log('testObj_key2:',testObj[key3]) // testObj_key2: val3
```

注意1：symbol属性不能被for...in获取
```js
const key3 = Symbol('key3')
const testObj = {
    key1:"val1",
    key2:'val2',
    [key3]:"val3"
}
for(let loopVal in testObj){
    console.log('loopVal:',loopVal)
    /*
    loopVal: key1
    loopVal: key2
    */
}

console.log('Object.keys:',Object.keys(testObj)) // [ 'key1', 'key2' ]
console.log('stringify:',JSON.stringify(testObj)) // {"key1":"val1","key2":"val2"}
```

<br />

## 用处2：隐藏属性
symbol 允许我们创建对象的“隐藏”属性，代码的任何其他部分都不能意外访问或重写这些属性。
例如，如果我们使用的是属于第三方代码的 user 对象，我们想要给它们添加一些标识符。
我们可以给它们使用 symbol 键：
```js
let user = {
  name: "John"
};

let id = Symbol("id");
user[id] = 1;
// 我们可以使用 symbol 作为键来访问数据
console.log(user[id]); // 1
```

使用 Symbol("id") 作为键，比起用字符串 "id" 来有什么好处呢？

由于 user 对象属于另一个代码库，所以向它们添加字段是不安全的，因为我们可能会影响代码库中的其他预定义行为。但 symbol 属性不会被意外访问到。第三方代码不会知道新定义的 symbol，因此将 symbol 添加到 user 对象是安全的。


## 习题
```js
const a = {};
const b = Symbol("123");
const c = Symbol("123");
a[b] = "string 1";
a[c] = "string 2";

console.log("test:", a[b]); // string 1

console.log("分割线--------->");

const a1 = {};
const b1 = { key: "123" };
const c1 = { key: "456" };

a1[b1] = "string b1";
a1[c1] = "string c2";
console.log("test2:", a1[b1]); // string c2
```
