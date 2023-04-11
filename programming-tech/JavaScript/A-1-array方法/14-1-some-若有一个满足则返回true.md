### some() 依据判断条件，数组的元素是否有一个满足，若有一个满足则返回true
```js
let arr = [1, 2, 3, 4, 5]
let arr1 = arr.some((i, v) => i < 3)
console.log(arr1)    // true

let arr2 = arr.some((i, v) => i > 10)
console.log(arr2)    // false
```

### some方法:它和every的行为相反，会迭代数组的每个元素，直到函数返回true。
```js
const isEven = x => x % 2 === 0;
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
console.log('numbers.some(isEven)', numbers.some(isEven));
```
