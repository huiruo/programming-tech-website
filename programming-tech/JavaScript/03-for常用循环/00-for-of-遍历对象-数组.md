## for...of为什么不能遍历Object对象
能够被for...of正常遍历的，都需要实现一个遍历器Iterator,它们的原型中都有一个Symbol.iterator方法，而Object对象并没有实现这个接口

### for in会遍历数组/对象所有的可枚举属性，包括原型;因此，标准委员会在ES6中增加了一种新的循环语法来解决目前的问题。

1. for-of循环用来遍历数据—例如数组中的值。

这是最简洁、最直接的遍历数组元素的语法
这个方法避开了for-in循环的所有缺陷
与forEach()不同的是，它可以正确响应break、continue和return语句

2. for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象

3. for...in 循环主要是为了遍历对象而生，不适用于遍历数组


4. for-of循环也可以遍历其它的集合
for-of循环不仅支持数组，还支持大多数类数组对象，例如DOM NodeList对象。
for-of循环也支持字符串遍历

for-of同样支持Set和Map的遍历

```js
function forOfTest(res) {
  for (const value of res) {
    const {
      orderId,
      price,
      qty,
      quoteQty,
      time,
      isBuyer,
      isMaker,
    } = value

    console.log('price:', price);
  }
}

forOfTest(order)


const map = new Map();
map.set('name', 'kepler');
map.set('number', '12138');

//输出key val
console.log('for...of 输出key val');
for (let [key, val] of map) {
  console.log(key + "'s phone number is: " + val);
}

// 输出key
console.log('for...of 输出key');
for (let [key] of map) {
  console.log(key);
}

//输出val
log('for...of 输出val');
for (let [, val] of map) {
  console.log(val);
}
```

### 实例
```js
const order = [
  {
    id: '636a6f7fac6f9e15a6855bf4',
    botId: null,
    orderId: '15206073096',
    clientOrderId: null,
    symbol: 'BTCUSDT',
    side: null,
    status: 'NEW',
    price: '20460.16000000',
    qty: '0.00202000',
    quoteQty: '41.32952320',
    realizedProfit: null,
    isBuyer: true,
    isMaker: false,
    orderTime: 1667876554528n,
    type: null,
    orderType: 1,
    userId: '6369df5f47ea1466b1d24b3b',
    operationType: null,
  },
  {
    id: '636a6f7fac6f9e15a6855bf5',
    botId: null,
    orderId: '15206073096',
    clientOrderId: null,
    symbol: 'BTCUSDT',
    side: null,
    status: 'NEW',
    price: '20460.19000000',
    qty: '0.00326000',
    quoteQty: '66.70021940',
    realizedProfit: null,
    isBuyer: true,
    isMaker: false,
    orderTime: 1667876554528n,
    type: null,
    orderType: 1,
    userId: '6369df5f47ea1466b1d24b3b',
    operationType: null,
  },
]
```
<br />

## for-of 和 for-in的区别
```js
// 1、for...in 循环：只能获得对象的键名，不能获得键值
//       for...of 循环：允许遍历获得键值
var arr = ['red', 'green', 'blue']

for (let item in arr) {
  console.log('for in item', item)
}
/*
  for in item 0
  for in item 1
  for in item 2
*/

for (let item of arr) {
  console.log('for of item', item)
}
/*
  for of item red
  for of item green
  for of item blue
*/
```

### 2、区别：对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错
```js
var obj = {
  'name': 'Jim Green',
  'age': 12
}

for (let key of obj) {
  console.log('for of obj', key)
}
// Uncaught TypeError: obj is not iterable


// 但是可以使用 for...in 循环遍历键名
for (let key in obj) {
  console.log('for in key', key)
}
/*
  for in key name
  for in key age
*/
```

### 区别for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键， 也会遍历对象的整个原型链。

for...of 则不会这样，它只遍历当前对象不会遍历原型链。
```js
let arr = [1, 2, 3]
arr.set = 'world'  // 手动添加的键
Array.prototype.name = 'hello'  // 原型链上的键

for (let item in arr) {
  console.log('item', item)
}

/*
  item 0
  item 1
  item 2
  item set
  item name
*/

for (let value of arr) {
  console.log('value', value)
}

/*
  value 1
  value 2
  value 3
*/

```
### 4、forEach 循环无法中途跳出，break 命令或 return 命令都不能奏效
```js
let arr = [1, 2, 3, 5, 9]
arr.forEach(item => {
  if (item % 2 === 0) {
    return
  }
  console.log('item', item)
})
/*
  item 1
  item 3
  item 5
  item 9
*/

// for...of 循环可以与break、continue 和 return 配合使用，跳出循环
for (let item of arr) {
  if (item % 2 === 0) {
    break
  }
  console.log('item', item)
}
// item 1

// 5、无论是 for...in 还是 for...of 都不能遍历出 Symbol 类型的值，遍历 Symbol 类型的值需要用 Object.getOwnPropertySymbols() 方法
{
  let a = Symbol('a')
  let b = Symbol('b')

  let obj = {
    [a]: 'hello',
    [b]: 'world',
    c: 'es6',
    d: 'dom'
  }

  for (let key in obj) {
    console.info(key + ' --> ' + obj[key])
  }

  /*
    c --> es6
    d --> dom
  */

  let objSymbols = Object.getOwnPropertySymbols(obj)
  console.info(objSymbols)    //  [Symbol(a), Symbol(b)]
  objSymbols.forEach(item => {
    console.info(item.toString() + ' --> ' + obj[item])
  })

  /*
    Symbol(a) --> hello
    Symbol(b) --> world
  */

  // Reflect.ownKeys 方法可以返回所有类型的键名，包括常规键名和Symbol键名
  let keyArray = Reflect.ownKeys(obj)
  console.log(keyArray)      //  ["c", "d", Symbol(a), Symbol(b)]
}
```