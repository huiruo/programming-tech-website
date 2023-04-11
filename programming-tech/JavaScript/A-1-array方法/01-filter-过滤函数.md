## JS中filter()方法的使用
Array.filter(function(currentValue, indedx, arr), thisValue)

callback:用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。
```
它接受以下三个参数：
    element数组中当前正在处理的元素。

    index可选,正在处理的元素在数组中的索引filter。

    array可选,调用了 filter 的数组本身。

    thisArg可选,执行 callback 时，用于 this 的值。
```
### 1.基础使用
```js
const arrays = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
]

console.log(arrays.filter(item => item.id !== 1))
```


### 2.使用：去重
```js
const unique = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
const arr = ['apple', 'banana', 'apple', 'pear', 'strawberry'];
console.log(unique(arr));
```

### 3.进阶：配合findIndex 使用
```js
let array1 = [1, 3];
let array2 = [
    { id: 1, label: "tes1" },
    { id: 2, label: "tes2" },
    { id: 3, label: "tes3" },
    { id: 4, label: "tes3" },
];

let targetArr = array2.filter((ele) => {
    return (
        -1 !==
        array1.findIndex((item) => {
            console.log("item:", item);
            return item === ele.id;
        })
    );
});

console.log("进阶：配合findIndex 使用:", targetArr);
```
