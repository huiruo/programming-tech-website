## find只会返回第一个满足条件的是对象
```js
const testArr = [{ id: 1, name: '张三' }, { id: 2, name: '李四' }, { id: 3, name: '王五' }, { id: 2, name: '赵六' }]

console.log(testArr.find((item) => item.id === 3))

// 2.
const testArr1 = [20, 12, 362, 26, 965, 22, 26, 35];

const findItem1 = testArr1.find(function (item, index, arr) { return item > 26 });

console.log('test 2:', findItem1) // 362
```
