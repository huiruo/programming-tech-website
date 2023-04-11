---
title: proxy
sidebar_position: 5
---

## ES6特性:Proxy
Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

语法：target: 要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
handler: 一个通常以函数作为属性的对象

1. 区别1:proxy 对整个对象进行监听的方式比defineProperty是循环遍历对象属性的方式来进行监听性能好

2. proxy去代理了ob不会污染原对象（关键区别）,他会返回一个新的代理对象不会对原对象ob进行改动

3. proxy 可以监听对象新增属性，defineProperty不可以

4. proxy 可以且不需要对数组的方法进行重载,defineProperty 不能监听数组下标改变值的变化，

常用作用：
```
使用 Proxy 的核心优点是可以交由它来处理一些非核心逻辑（如：读取或设置对象的某些属性前记录日志；设置对象的某些属性值前，需要验证；某些属性的访问控制等）。从而可以让对象只需关注于核心逻辑，达到关注点分离，降低对象复杂度等目的。

其实就是在对目标对象的操作之前提供了拦截，可以对外界的操作进行过滤和改写，修改某些操作的默认行为，这样我们可以不直接操作对象本身，而是通过操作对象的代理对象来间接来操作对象，达到预期的目的
```

```js
let obj = {a: 1}

let proxyObj = new Proxy(obj, {
  get: function (target, prop) {
    return prop in target ? target[prop] : 0
  },
  set: function (target, prop, value) {
    console.log('触发set:', prop, '-', value)
    target[prop] = 888;
  }
})

console.log('1:', proxyObj.a);
console.log('2:', proxyObj.b);
proxyObj.a = 666;
console.log('3:', proxyObj.a)
/*
1: 1
2: 0
触发set: a - 666
3: 888
*/
```


解析：
当我们访问对象内原本存在的属性时，会返回原有属性内对应的值;
如果试图访问一个不存在的属性时，会返回0 ，即我们访问 proxyObj.a 时，原本对象中有 a 属性，因此会返回 1 ，
当我们试图访问对象中不存在的 b 属性时，不会再返回 undefined ，而是返回了 0 ;

当我们试图去设置新的属性值的时候，总是会返回 888，因此，即便我们对 proxyObj.a 赋值为 666 ，但是并不会生效，依旧会返回 888


## Proxy 对象能够利用 handler 陷阱在 get、set 时捕获到任何变动，也能监听对数组索引的改动以及 数组 length 的改动

