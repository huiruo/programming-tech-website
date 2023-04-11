## indexOf()
indexOf() 方法可返回数组中某个指定的元素位置。

该方法将从头到尾地检索数组，看它是否含有对应的元素。开始检索的位置在数组 start 处或数组的开头（没有指定 start 参数时）。

如果在数组中没找到指定元素则返回 -1。

```js
// const target ='3'
const target = '5'

let arr = ['1', '2', '3', '4']
let arrIndex = arr.indexOf(target)

if (arrIndex > -1) {
    console.log("包含");
    arr.splice(arrIndex, 1)
} else {
    console.log("不包含");
    arr.push(target)
}

console.log('操作之后:', arr)

/*
* test 2
* */
const testArr = [20, 12, 362, 26, 965, 22, 26, 35];
const index1 = testArr.indexOf(26);

console.log('test 2:', index1) //3
```
