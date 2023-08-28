```js
// unshift -> array <- push
const testArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

// 并返回新的长度
console.log('当前长度：', testArr.unshift({ id: 66 }))
console.log('testArr：', testArr)
```

## `splice`这个也可以实现
```js
const array = [2, 3, 4, 5];
const element = 1;

array.splice(0, 0, element);

console.log(array);
```