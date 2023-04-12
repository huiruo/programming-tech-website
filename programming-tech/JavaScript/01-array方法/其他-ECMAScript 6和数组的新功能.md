```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// 方法                描述
// 方法1.@@iterator返回一个包含数组键值对的迭代器对象，可以通过同步调用得到数组元素的键值对
// 需要通过Symbol.iterator 来访问
let iterator = numbers[Symbol.iterator]();
console.log('iterator.next().value', iterator.next().value); // 1
console.log('iterator.next().value', iterator.next().value); // 2
console.log('iterator.next().value', iterator.next().value); // 3
console.log('iterator.next().value', iterator.next().value); // 4
console.log('iterator.next().value', iterator.next().value); // 5

// 方法2.copyWithin复制数组中一系列元素到同一数组指定的起始位置

// 方法3.entries返回包含数组所有键值对的@@iterator
let aEntries = numbers.entries(); // retrieve iterator of key/value
console.log('aEntries.next().value', aEntries.next().value); // [0, 1] - position 0, value 1
console.log('aEntries.next().value', aEntries.next().value); // [1, 2] - position 1, value 2
console.log('aEntries.next().value', aEntries.next().value); // [2, 3] - position 2, value 3
// or use code below
aEntries = numbers.entries();
for (const n of aEntries) {
    console.log(`entry of ${n}`, n);
}

// 方法4.includes如果数组中存在某个元素则返回true，否则返回false。E2016新增


// 方法5.find根据回调函数给定的条件从数组中查找元素，如果找到则---------->返回该元素
const numbers2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
function multipleOf13(element) {
    return element % 13 === 0;
}
console.log('numbers.find(multipleOf13)', numbers2.find(multipleOf13));

// 方法6.findIndex根据回调函数给定的条件从数组中查找元素，如果找到则------------->返回该元素在数组中的索引
console.log('numbers.findIndex(multipleOf13)', numbers2.findIndex(multipleOf13));

// 方法7.fill用静态值填充数组

// 方法8.from根据已有数组创建一个新数组
// Array.from方法根据已有的数组创建一个新数组。比如，要复制(浅拷贝)numbers数组，可以如下这样做。
console.log('Array.from(numbers)', Array.from(numbers2));
// 还可以传过滤的函数
const numbers3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const evens = Array.from(numbers3, x => x % 2 === 0);
console.log('Array.from(numbers, x => x % 2 === 0)', evens);


// 方法9.keys返回包含数组所有索引的@@iterator
const numbers4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const aKeys = numbers4.keys(); // retrieve iterator of keys
console.log("keys", aKeys)
console.log('aKeys.next()', aKeys.next()); // {value: 0, done: false } done false means iterator has more values
console.log('aKeys.next()', aKeys.next()); // {value: 1, done: false }
console.log('aKeys.next()', aKeys.next()); // {value: 2, done: false }

// 方法10.of根据传入的参数创建一个新数组
/*
创建一个可变数量参数的新数组，而不考虑参数的类型和数量;
Array.of()和Array构造函数的区别：在于处理整数参数;
var arr1 = Array(10)
console.log(arr1); // [empty × 10] 是一个长度为10的空数组
var arr2 = Array.of(10)
console.log(arr2); // [10] 是一个有单个元素10的数组，它的长度为1
* */
const numbers3A = Array.of(1);
const numbers4A = Array.of(1, 2, 3, 4, 5, 6);
const numbersCopy = Array.of(...numbers4A);
console.log('Array.of(1)', numbers3A);
console.log('Array.of(1, 2, 3, 4, 5, 6)', numbers4A);
console.log('Array.of(...numbers4)', numbersCopy);
```
