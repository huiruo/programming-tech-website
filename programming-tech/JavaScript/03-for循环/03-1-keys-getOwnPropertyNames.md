---
title: keys-getOwnPropertyNames
sidebar_position: 3
---

## Object.keys()
keys() 是 Object 的静态函数，专门用来遍历对象获取键名。Object.keys() 函数的参数是一个对象，

返回一个数组，元素是该对象所以本地属性名。如果使用该函数迭代数组，可以汇集数组的所有元素下标值。

keys 功能比较专一，应用范围比较窄，但是执行效率比较高。
Object 类型没有定义 length 原型属性，可以利用 keys 方法获取对象的长度。

```js
const arr = ["A", "B", "C"];
console.log(Object.keys(arr));  // ['0', '1', '2']

var obj = { a: "A", b: "B", c: "C" };
console.log(Object.keys(obj));  // ['a', 'b', 'c']
```


## Object.getOwnPropertyNames()
Object 还有一个类似的静态函数：getOwnPropertyNames(),与 keys 用法相同，参数都是对象，返回值都是一个数组，数组元素都是属性名。

不同点：keys 仅能迭代本地、可枚举的属性，getOwnPropertyNames 可以迭代所有本地属性。

```js
var o = { a: "A", b: "B", c: "C" };
console.log(Object.keys(o));  // 返回["a","b","c"]
console.log(Object.getOwnPropertyNames(o));  //返回["a","b","c"]

var a = ["A", "B", "C"];
console.log(Object.keys(a));  // 返回["0","1","2"]
console.log(Object.getOwnPropertyNames(a));  //返回["0","1","2"]
```