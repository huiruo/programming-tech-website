---
title: sort-采用快排和插入排序算法
sidebar_position: 3
---

### 比较规则：

- 返回一个负数，第一个参数应该位于第二个参数的前面-->不需要替换
- 返回一个正数,第一个参数应位于第二个参数的之后-->需要替换
- 两个参数相等，则返回 0，

默认是将数组元素转为字符串，然后根据 Unicode 字符集编号的大小排序。

charCodeAt(index) 返回指定位置字符的 Unicode 编号，取值是 0 - 65535 间的整数，
与 charAt() 方法执行的操作相似，后者返回的是单个字符。

如果不提供比较器而对数字组成的数组排序，因为会将数字转为字符串再按编号排序而导致错误。
要获得正确的顺序，只需提供比较器函数：

```js
function(a,b){
  return a-b;
}
```

```js
let testArr = [6, 9, 2, 5];

const newArr = testArr.sort((a, b) => {
  console.log("", a, b);
  // debugger;
  if (a - b < 0) {
    // 在排序后的数组中 a 应该出现在 b 之前,则返回一个小于 0 的值。
    console.log("负数数不需要交换", "a:", a, "b:", b);
  } else {
    console.log("正数要交换", "a:", a, "b:", b);
  }
  return a - b;
});

console.log("升序：", newArr); //[2, 5, 6, 9]

let testArr2 = [6, 9, 2, 5];
console.log(
  "降序：",
  testArr2.sort((a, b) => b - a)
); // [9, 6, 5, 2]
```

### 采用快排和插入排序算法

会改变原始数组。它会按照升序或降序重新排列数组元素，并返回已排序的数组。

不想更改原始数组，可以通过创建一个副本来排序该副本

```js
let myArray = [5, 2, 1, 4, 3];
let sortedArray = [...myArray].sort();
console.log(sortedArray); // [1, 2, 3, 4, 5]
console.log(myArray); // [5, 2, 1, 4, 3]
```

### 数字排序

```js
const numbers2 = [1, 3, 3, 4, -1, 6, 7, 8, -2, 10, 11, 12, 13, 14, 15];
const res = numbers2.sort((a, b) => a - b);
console.log("使用sort进行数组排序:numbers.sort((a, b) => a - b)", res);
// [-2, -1, 1, 3, 3, 4, 6, 7, 8, 10, 11, 12, 13, 14, 15]
```

### 字符串排序

```js
const arrStr = ["eeeee", "b", "bccc", "accc", "afff"];
console.log(
  "字符串排序：",
  arrStr.sort((a, b) => {
    return a > b ? 1 : -1;
  })
);

// ['accc', 'afff', 'b', 'bccc', 'eeeee']
```

### 2-1.进行对象排序

```js
const friends = [
  { name: "John", age: 30 },
  { name: "Ana", age: 20 },
  { name: "Chris", age: 25 },
];

function comparePerson(a, b) {
  if (a.age < b.age) {
    return -1;
  }
  if (a.age > b.age) {
    return 1;
  }
  return 0;
}

console.log(
  "进行对象排序：friends.sort(comparePerson)",
  friends.sort(comparePerson)
);
```

### 3.字符串排序

```js
let names = ["Ana", "ana", "john", "John"];
console.log("3.字符串排序:names.sort()", names.sort());
```

JavaScript 在做字符比较的时候，是根据字符对应的 ASCII 值来比较的。例如，A、J、a、j 对应的 ASCII 值分别是 65、74、97、106。
虽然 a 在字母表里是最靠前的，但 J 的 ASCII 值比 a 的小，所以排在了 a 前面。

```js
// 小写字母在前
names = ["Ana", "ana", "john", "John"];

console.log(
  "3.字符串排序:names.sort((a, b) => a.localeCompare(b))",
  names.sort((a, b) => a.localeCompare(b))
);
```
