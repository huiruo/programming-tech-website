---
title: set数据类型
sidebar_position: 5
---

## 特点是不能存放相同的元素
1. 成员唯一、无序且不重复
2. [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
3. 可以遍历，方法有：add、delete、has

## WeakSet：
```
1.成员都是对象。
2.成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏。
3.不能遍历，方法有add、delete、has。
```

## set方法和使用
```
set 有add添加，delete删除，clear清楚所有，size长度

// 将set转换为数组对象
set=Array.from(set)
```

set 和 arr 相互转化:
```js
const setArray = new Set([1, 1, 2, 2, 3]);
for (let value of setArray) {
    console.log('set使用', value);
}

// 1.array ---> set
let arr = [1, 2, 3, 4]
console.log('array ---> set:', new Set(arr))

// 2.set --->arr
let setTem = new Set([1, 2, 3, 4])
console.log('set --->arr:', Array.form(setTem))
```

## set在数组去重中使用
```js
const unique = (arr) => Array.from(new Set(arr));

const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];

console.log('在数组去重中使用:', unique(arr));
```

```js
let myArray = [1, 2, 2, 3, 4, 4, 5];

// 将数组转换为Set
let mySet = new Set(myArray);

// 将Set转换回数组
let uniqueArray = Array.from(mySet);

// 输出去重后的数组
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

## 使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集

### 并集
```js
const aBing = new Set([1, 2, 3]);
const bBing = new Set([4, 3, 2]);
const union = new Set([...aBing, ...bBing]);
console.log("union:", union);
// union: Set(4) {1, 2, 3, 4}
```

### 交集
```js
const aArr = new Set([1, 2, 3]);
const bArr = new Set([4, 3, 2]);
const intersect = new Set([...aArr].filter(x => bArr.has(x)));
console.log("intersect:", intersect);
// intersect: Set(2) {2, 3}
```

### 差集
```js
const aCha = new Set([1, 2, 3]);
const bCha = new Set([4, 3, 2]);
const difference = new Set([...aCha].filter(x => !bCha.has(x)));
console.log("difference:", difference);
// difference: Set(1) {1}
```