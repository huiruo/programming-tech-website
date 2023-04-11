### slice 不改变原数组
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
