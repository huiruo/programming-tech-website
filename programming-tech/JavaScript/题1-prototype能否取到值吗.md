---
title: prototype能否取到值吗
sidebar_position: 11
---

## 能取到值吗？
console.log(f.a);
console.log(f.b); 

```js
var F = function () { };

F.prototype.c = function () { };

Object.prototype.a = function a() { };

Function.prototype.b = function b() { };

var f = new F();
f.d = 'test'

console.log(f.a); // ??
console.log(f.b); // ??

console.log('f', f)
/*
*  1.探究构造出来的对象的 proto
*/
console.log('f.__proto__:', f.__proto__)
console.log('f.__proto__指向F.prototype:', f.__proto__ === F.prototype) // true


/* f.__proto__proto__指向谁？------->Object
* */
console.log('f.__proto__proto__:', f.__proto__.__proto__)
console.log('f.__proto__proto__指向谁:', f.__proto__.__proto__ === Object.prototype) // true

// f.__proto__ === F.prototype // true
console.log('F:', F)
console.log('F.prototype:', F.prototype)
console.log('F.__proto__:', F.__proto__)
console.log('F.__proto__.b:', F.__proto__.b) // 能取到

//探究b()属性在哪里
console.log('f.__proto__.constructor:', f.__proto__.constructor)
console.log('f.__proto__.constructor.prototype:', f.__proto__.constructor.prototype)
console.log('f.__proto__.constructor.prototype.constructor:', f.__proto__.constructor.prototype.constructor)
console.log('f.__proto__.constructor.prototype.constructor.__proto__:', f.__proto__.constructor.prototype.constructor.__proto__)
console.log('f.__proto__.constructor.prototype.constructor.__proto__.b:', f.__proto__.constructor.prototype.constructor.__proto__.b)
console.log(F.__proto__.b === f.__proto__.constructor.prototype.constructor.__proto__.b) // true

console.log('Function.prototype:', Function.prototype) // ['length', 'name', 'arguments', 'caller', 'constructor', 'apply', 'bind', 'call', 'toString', 'b']
console.log('Function.prototype own:', Object.getOwnPropertyNames(Function.prototype))
console.log(Object.getOwnPropertyNames(Function)) // ['length', 'name', 'prototype']

// 那就去 f.__proto__.__proto__找，也就是Object.prototype中去找，于是就找到了a这个属性。
console.log('答案f.a：',f.a);
console.log('答案f.b：',f.b); // undefined，但是能取到c,下面途径才能取到
console.log('答案f.c：',f.c);
// console.log(F.__proto__.b === f.__proto__.constructor.prototype.constructor.__proto__.b) // true
/*
第二，在var f = new F()时，会创建新的对象，生成新的a方法，在f实例对a,b方法的查找上，
原型链里不会去Function.prototype里，而是在Object.prototype里，
* */

/*
* 题目解析1:
new的过程拆分成以下三步：

1、 var f={}; 也就是说，初始化一个对象p。

2、 f.__proto__=F.prototype;

3、 F.call(f);也就是说构造f，也可以称之为初始化f。
* */
console.log(f.__proto__ === F.prototype); // 返回值为true，证明第2点

console.log(F.__proto__ === Function.prototype); // 返回值为true

console.log(F.prototype.__proto__ === Object.prototype); // 返回值为true
```

### 解析
那么__proto__是什么？我们在这里简单地说下。每个对象都会在其内部初始化一个属性，就是__proto__，当我们访问一个对象的属性 时，如果这个
对象内部不存在这个属性，那么他就会去__proto__里找这个属性，这个__proto__又会有自己的__proto__，于是就这样 一直找下去，也就是我们平时所说的原型链的概念。

首先var F = function(){}; 可以得出 f.__proto__=F.prototype。

那么当我们调用 f.a 或者 f.b 时，首先 f 中没有 a 或者 b 这个属性， 于是，他就需要到他的__proto__中去找，也就是F.prototype，由于F.prototype中也没有 a 或者 b；

那就去 f.__proto__.__proto__找，也就是Object.prototype中去找，于是就找到了a这个属性。
说白了 这就是原型链的实现原理。
最后，我个人认为，其实prototype只是一个假象，它在原型链实现中只是起到了一个辅助作用，换言之，它只是在new的时候有着一定的价值，而原型链的本质，其实在于__proto__.

### 题目解析2:
1.在var F = function(){}时，构造函数F已经对Function.prototype实例化了；
2.在Object.prototype.a = function(){};时，Object还没有实例化，prototype中成功添加了a方法；
3.在Function.prototype.b = function(){}时，由于Function.prototype已经被实例化了，此时F.__proto__ == Function.prototype;
4.当var f = new F();后,F构造函数进行了实例化，由于new的作用：
//一个new的过程
var obj = {};
obj.__proto__=F.prototype;
F.call(obj,...arg);

f.__proto__ == F.prototype
//结果： true
F.prototype.__proto__ == Object.prototype
//结果： true

此时，f.__proto__.__proto__ == Object.prototype;,当f.a()调用时，在原型链中就找到了此方法，而f.b()并没有找到。
