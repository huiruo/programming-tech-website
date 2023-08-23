## 修改数组优化
对于这段代码的优化，可以考虑以下几点：

1. 避免不必要的数组复制：在代码中，const target = [...formik?.values[formValuesName]] 创建了 target 数组的副本。如果 formik?.values[formValuesName] 已经是一个数组，可以直接引用它而不需要创建副本。

2. 使用更高效的操作来删除数组元素：目前的代码使用 splice 方法来删除数组中的一个元素。然而，splice 操作会改变原始数组，可能导致性能损失，尤其是在大型数组上。可以考虑使用 slice 方法结合展开运算符来创建一个新的数组，而不改变原始数组。

这样做的好处是避免了不必要的数组复制，并使用了更高效的方式删除数组中的元素。
```js
/*
const formValuesName = controlItemParam.id
const target = [...formik?.values[formValuesName]]
const targetItemIndex = target.findIndex(
(url) => url === targetUrl,
)

if (targetItemIndex !== -1) {
target.splice(targetItemIndex, 1)
}

formik.setFieldValue(formValuesName, target)
*/
const formValuesName = controlItemParam.id
const target = formik?.values[formValuesName] || []
const targetItemIndex = target.findIndex((url) => url === targetUrl)

if (targetItemIndex !== -1) {
const updatedTarget = [...target.slice(0, targetItemIndex), ...target.slice(targetItemIndex + 1)]
formik.setFieldValue(formValuesName, updatedTarget)
}
```


## slice 不改变原数组
slice 不会修改原数组，只会返回一个浅复制了原数组中的元素的一个新数组。

使用 slice() 方法从数组中获取片段，但是不会更改原数组。
```js
const fruits = ['apple', 'banana', 'mango', 'orange'];

const slicedFruits = fruits.slice(1, 3);
// slicedFruits 现在是 ['banana', 'mango']

console.log(fruits);
// fruits 仍然是 ['apple', 'banana', 'mango', 'orange']
```

slice(start,end) 参数有两个，start为必填字段，end为选填字段，返回一个新的数组，包含从 start 到 end 的元素。
```js
const testArr = new Array();

testArr[0] = "first";
testArr[1] = "second";
testArr[2] = "third";
testArr[3] = "forth";

console.log(testArr.slice(0));
console.log(testArr.slice(2));
console.log(testArr.slice(1, 2));

console.log('原数组：', testArr);
```

### 2.该方法也 用于字符串
start 要抽取的片断的起始下标。如果是负数，则该参数规定的是从字符串的尾部开始算起的位置。
也就是说，-1 指字符串的最后一个字符，-2 指倒数第二个字符，以此类推。

end	紧接着要抽取的片段的结尾的下标。若未指定此参数，则要提取的子串包括 start 到原字符串结尾的字符串。
如果该参数是负数，那么它规定的是从字符串的尾部开始算起的位置。

```js
const str = "abcdefg";
console.log(str.slice(-1)); // g
console.log(str.slice(2)); // cdefg
console.log(str.slice(0, 3)); // abc
console.log(str.slice(0, -2)); // abcde
console.log(str.slice(-3, -2)); // e

const testArr = [0, 1, 2, 3, 4, 5]
console.log(testArr.slice(1, 3)); // [1, 2]
console.log(testArr.slice(0, 3)); // [0,1, 2]
```

### 应用：字符串反转
```js
function reverse(str) {
    if (str.length === 1) {
        return str;
    }
    return str.slice(-1) + reverse(str.slice(0, -1));
}
const testStr = "helloworld";
console.log('字符串反转:', reverse(testStr)); // dlrowolleh
```
