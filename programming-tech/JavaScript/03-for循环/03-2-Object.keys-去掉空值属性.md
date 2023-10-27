---
title: Object.keys-去掉空值属性
sidebar_position: 3
---

### 并且不希望遍历原型链，可以使用Object.keys()方法结合
更高效地删除对象中的空字符串属性
```js
function removeEmptyStringProperties(obj) {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] === '') {
      delete obj[key];
    }
  });
}

// 示例用法
var obj = {
  name: 'John',
  age: '',
  city: 'New York',
  email: '',
};

removeEmptyStringProperties(obj);

console.log(obj);
// 输出: { name: 'John', city: 'New York' }
```

### 单纯使用for in
```js
function removeEmptyStringProperties(obj) {
  for (var key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }
}

// 示例用法
var obj = {
  name: 'John',
  age: '',
  city: 'New York',
  email: '',
};

removeEmptyStringProperties(obj);

console.log(obj);
// 输出: { name: 'John', city: 'New York' }
```