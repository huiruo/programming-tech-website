### arr.entries() 遍历数组的键名和键值
迭代数组中每个值前一个是索引值作为 key，数组后一个值作为 value。
```js
let arr = [1, 2, 3, 4]
let arr1 = arr.entries()
console.log('arr1:',arr1)
for (let e of arr1) {
    console.log(e);   // [0,1] [1,2] [2,3] [3,4]
}
```
