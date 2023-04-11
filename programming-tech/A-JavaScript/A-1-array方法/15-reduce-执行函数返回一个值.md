### arr.reduce(callback, initialValue) 

请用中文说下js reduce()方法
```
通常我们会传递两个参数给这个函数：一个在每一次规约过程中都会被调用的函数和一个初始值。在每一次调用函数的过程中，函数会返回一个值，这个值会和下一次调用函数时的第一个参数进行计算，直到最后一个元素被处理完。最后，reduce() 方法返回规约后的最终值。
```

迭代数组的所有项，累加器，数组中的每个值（从左到右）合并，最终计算为一个值
```
参数： callback:
          previousValue 必选 --上一次调用回调返回的值，或者是提供的初始值（initialValue）
          currentValue 必选 --数组中当前被处理的数组项
          index 可选 --当前数组项在数组中的索引值
          array 可选 --原数组
     initialValue: 可选 --初始值

  实行方法：回调函数第一次执行时，preValue 和 curValue 可以是一个值，如果 initialValue 在调用 reduce() 时被提供，
```

那么第一个 preValue 等于 initialValue ，并且curValue 等于数组中的第一个值；
如果initialValue 未被提供，那么preValue 等于数组中的第一个值.

### 用法1，数组求和：
例子index是从1开始的，第一次的prev的值是数组的第一个值。数组长度是4，但是reduce函数循环3次。
```js
let arr = [0, 1, 2, 3, 4]
let arr1 = arr.reduce((preValue, curValue, index, arr) => {
    console.log('数组求和:',preValue, curValue, index);
    return preValue + curValue
})

console.log('数组求和结果：',arr1)    // 10
```

### 用法2：求乘积
```js
const arr2 = [1, 2, 3, 4];
const mul = arr2.reduce((x, y) => x * y)
console.log('求乘积:', mul); //求乘积，24

// reduce的高级用法: 1.计算数组中每个元素出现的次数

let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

let nameNum = names.reduce((pre, cur) => {
    if (cur in pre) {
        pre[cur]++
    } else {
        pre[cur] = 1
    }
    return pre
}, {})

console.log('计算数组中每个元素出现的次数:', nameNum); //{Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
```

### 数组去重
```js
let arr3 = [1, 2, 3, 4, 4, 1]
let newArr = arr3.reduce((pre, cur) => {
    if (!pre.includes(cur)) {
        return pre.concat(cur)
    } else {
        return pre
    }
}, [])
console.log(newArr);// [1, 2, 3, 4]
```

### 对象里的属性求和
```js
const result = [
    {
        subject: 'math',
        score: 10
    },
    {
        subject: 'chinese',
        score: 20
    },
    {
        subject: 'english',
        score: 30
    }
];

const sum = result.reduce(function (prev, cur) {
    return cur.score + prev;
}, 0);

console.log(sum) //60
```
