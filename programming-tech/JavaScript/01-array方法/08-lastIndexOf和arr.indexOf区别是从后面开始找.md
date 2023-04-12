### lastIndexOf()和arr.indexOf()的功能一样，不同的是从后往前查找
```js
let arr = [1, 2, 3, 4, 5, 2]
let arr1 = arr.lastIndexOf(2)
console.log(arr1)  // 5
let arr2 = arr.lastIndexOf(9)
console.log(arr2)  // -1
```
