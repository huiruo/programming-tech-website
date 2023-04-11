```js
const testArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
const testArr2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 参数：参数1：索引值，参数2：个数(如果不是删除穿0)，第三个参数往后，需要添加到数组的元素
// 从数组索引5开始，一共删除3个元素，并返回删除的元素
console.log(testArr2.splice(5, 3))
console.log('testArr：', testArr2)

// 使用方法2：删除指定下标的元素
console.log(testArr.splice(2, 1));
console.log('testArr：', testArr)
```
