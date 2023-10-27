---
title: sort-排序
sidebar_position: 3
---

>将 id: 'location'移到第一位,在排序函数中，可以定义一个自定义比较函数，该函数可以检查元素的id值是否等于'location'，如果是，则将其放在数组的第一位。如果不是，则根据其在原数组中的位置进行排序。

```js
const testArr = [
  { assembly: {id: 'banner'}},
  { assembly: {id: 'location'}},
  { assembly: {id: 'advertising'}}
]

const newArr = testArr.sort((a, b) => {
  if (a.assembly.id === 'location') {
    return -1;
  } else if (b.assembly.id === 'location') {
    return 1;
  } else {
    return 0;
  }
});

console.log("newArr:",newArr)
```

### 实战

```js
export function sortAssembly(pageAssembly: Assembly[]): Assembly[] {
  function customSort(item: Assembly) {
    if (item.assemblyInfo.id === 'DcodePages') {
      return 0
    } else if (item.assemblyInfo.id === 'DcodeLocation') {
      return 1
    } else {
      return 2
    }
  }

  return pageAssembly.sort((a, b) => customSort(a) - customSort(b))
}
```