### 1. array.push.apply()进⾏数组合并,改变原数组
函数的apply⽅法有⼀个特性，那就是obj.func.apply(obj,argv)，argv是⼀个数组。

用apply将数组添加到另一个数组，调用数组的push函数的apply()
```js
const arr1 = [1, 2];
const arr2 = [3, 4, 5];

arr2.push.apply(arr2, arr1);
console.log("合并之后:", arr2);
```

### 方法2：concat()进⾏数组合并,有返回值，并不会改变原数组
使用concat方法时会将新数组的成员,添加到原数组的尾部,然后返回一个新数组,
原数组是不会改变

```js
const arr1C = [1, 2];
const arr2C = [3, 4, 5];
console.log("concat:", arr1.concat(arr2));
```


### 方法3： 在ES6新标准中，新增扩展运算符，可以用来合并数组
```js
const arr3_1 = [1, 2];
const arr3_2 = [3, 4, 5];
console.log('log:', [...arr3_1, arr3_2]);
```

