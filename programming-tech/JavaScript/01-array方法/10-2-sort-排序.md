---
title: sort-排序
sidebar_position: 3
---

## 例子

```js
const sortArr = [10, 5, 40, 25, 1000, 1];
console.log("sort第一种方案：", sortArr.sort()); //没有排序
console.log(
  "sort第二种方案：",
  sortArr.sort((x, y) => {
    return x - y;
  })
);
```

## 例子

1. sort()函数 sort()函数主要是对数组进行正序排序,比如: 也可以使用含有参数的 sort()方法进行排序,比如下面的两个例子,二者的效果是一致的。例子 1:

2. reverse()函数 reverse()函数主要用于倒叙排序

```js
var data = {
  rows: [
    {
      name: "张三",
      time: "2011/4/1 0:00:00",
    },
    {
      name: "李四",
      time: "2015/5/6 12:30:00",
    },
    {
      name: "王五",
      time: "2012/10/1 22:10:00",
    },
    {
      name: "赵六",
      time: "2011/9/1 22:10:00",
    },
  ],
};
var rows = data.rows;
rows.sort(function (a, b) {
  return Date.parse(a.time) - Date.parse(b.time); // 时间正序
});

for (var i = 0, l = rows.length; i < l; i++) {
  console.log(rows[i].name + " | " + rows[i].time);
}
```

## 例子

> 将 id: 'location'移到第一位,在排序函数中，可以定义一个自定义比较函数，该函数可以检查元素的 id 值是否等于'location'，如果是，则将其放在数组的第一位。如果不是，则根据其在原数组中的位置进行排序。

```js
const testArr = [
  { assembly: { id: "banner" } },
  { assembly: { id: "location" } },
  { assembly: { id: "advertising" } },
];

const newArr = testArr.sort((a, b) => {
  if (a.assembly.id === "location") {
    return -1;
  } else if (b.assembly.id === "location") {
    return 1;
  } else {
    return 0;
  }
});

console.log("newArr:", newArr);
```

### 实战

```js
export function sortAssembly(pageAssembly: Assembly[]): Assembly[] {
  function customSort(item: Assembly) {
    if (item.assemblyInfo.id === "DcodePages") {
      return 0;
    } else if (item.assemblyInfo.id === "DcodeLocation") {
      return 1;
    } else {
      return 2;
    }
  }

  return pageAssembly.sort((a, b) => customSort(a) - customSort(b));
}
```
