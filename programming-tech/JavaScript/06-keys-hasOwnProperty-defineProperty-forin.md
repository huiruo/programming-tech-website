---
title: keys-hasOwnProperty-defineProperty-forin
sidebar_position: 7
---

## 原型链查找性能:hasOwnProperty
是JavaScript中唯一一个处理属性并且不会遍历原型链的方法
```js
console.log(object1.hasOwnProperty("property1")); // true
```

扩展：
1. Object.getOwnPropertyNames(Object) 返回了数组：对象的所有属性,包括可枚举和不可枚举的但不包括Symbol值作为名称的属性
2. Object.keys()返回可枚举的属性,不会包括继承原型的属性,返回数组
3. for in :遍历对象可枚举属性，包括自身属性，以及继承自原型的属性

```js
const object1 = { property1: 42 };

// 增加不可枚举的属性age
Object.defineProperty(object1, "age", { value: "18", enumerable: false });
// 增加不可枚举的属性prototype2
Object.defineProperty(Object, "prototype2", { value: "18", enumerable: false });
// 增加不可枚举的属性prototype3
Object.defineProperty(Object, "prototype3", { value: "18", enumerable: true });

// 1-getOwnPropertyNames返回对象的自有属性: (2) ['property1', 'age']
console.log('1-getOwnPropertyNames返回对象的自有属性:', Object.getOwnPropertyNames(object1)); 

// 2-Object.keys()返回可枚举的属性: ['property1']
console.log('2-Object.keys()返回可枚举的属性:',Object.keys(object1)); 

// 返回了Array的属性:[ 'length', 'name', 'prototype', 'isArray', 'from', 'of' ]
console.log('4-:',Object.getOwnPropertyNames(Array)); 
console.log('5-obj1:', Object.prototype2)
console.log('6-obj2:', Object.length)
console.log('7-obj2:', Object.name)
console.log('8-test1:', Object.getOwnPropertyDescriptors(object1))
/*
test1: {
  property1: { value: 42, writable: true, enumerable: true, configurable: true },
  age: {
    value: '18',
    writable: false,
    enumerable: false,
    configurable: false
  }
}
* */


Object.getOwnPropertyNames(Object)
输出：['length', 'name', 'prototype', 'assign', 'getOwnPropertyDescriptor', 'getOwnPropertyDescriptors', 'getOwnPropertyNames', 'getOwnPropertySymbols', 'hasOwn', 'is', 'preventExtensions', 'seal', 'create', 'defineProperties', 'freeze', 'getPrototypeOf', 'setPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 'keys', 'entries', 'fromEntries', 'values', 'defineProperty', 'prototype2', 'prototype3']
```

### Object.keys vs for in
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype = { sex: "男" };
const man = new Person("张三", 18);

// 增加不可枚举的属性info
Object.defineProperty(man, "info", { value: "18", enumerable: false });

// 通过原型链增加属性，为一个函数
Object.prototype.protoPer1 = function () {
    console.log("name is tom");
};

// 通过原型链增加属性
Object.prototype.protoPer2 = 2;

// 但是Object.keys 只遍历自身的属性: [ 'name', 'age' ]
console.log("Object.keys:", Object.keys(man));

// 可见for in  迭代了 Person 的原型对象: sex 和 Object 的 protoPer1,protoPer2
for (let key in man) {
    console.log("1-3:", key);
}
/*
1-3: name
1-3: age
1-3: sex
1-3: protoPer1
1-3: protoPer2
* */
```

### 例子2-使用 hasOwnProperty()来过滤该对象上的继承属性
遍历一个对象的所有属性时忽略掉继承属性
```js
// 测试for in 借助hasOwnProperty()遍历对象
const object1 = {
    property1: 42,
};

// 增加不可枚举的属性age
Object.defineProperty(object1, "age", { value: "18", enumerable: false });
// 增加不可枚举的属性age2
Object.defineProperty(object1, "age2", { value: "18", enumerable: true });
// 增加不可枚举的属性age
Object.defineProperty(Object, "prototype2", { value: "18", enumerable: false });
// 增加不可枚举的属性age
Object.defineProperty(Object, "prototype3", { value: "18", enumerable: true });

Object.prototype.protoPer_4 = 2;

for (let i in object1) {
    if (object1.hasOwnProperty(i)) {
        console.log("OwnProperty:", i);
    } else {
        console.log("in:", i);
    }
}
/*
OwnProperty: property1
OwnProperty: age2
in: protoPer_4
* */
```