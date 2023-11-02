## for in
### forIn迭代对象属性的方式
它用于遍历对象的可枚举属性，包括对象自身的属性和原型链上的属性。
用法：
* variable 是一个变量，用于迭代对象的属性名。
* object 是要遍历的对象。
```js
for (variable in object) {
  // 循环体
}
```
注意事项：
1. for...in 循环会遍历对象的可枚举属性，包括对象自身的属性和继承的属性（从原型链上继承的属性）。
>遍历自身属性：使用 hasOwnProperty 方法可以过滤出对象自身的属性，而不包括继承的属性。
2. 不适用于数组：虽然可以使用 for...in 遍历数组，但不推荐这么做。最好使用 for...of 循环或数组的 forEach 方法来遍历数组。
3. 遍历顺序不保证：for...in 循环不保证属性的遍历顺序。属性的顺序可能会因不同 JavaScript 引擎的实现而异。
4. 遍历可枚举属性：for...in 只遍历对象的可枚举属性。如果属性被设置为不可枚举（通过 Object.defineProperty 或 Object.create 的属性描述符），则不会被遍历。

### for of 区别for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键， 也会遍历对象的整个原型链。

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

### for...in 循环：只能获得对象的键名，不能获得键值
for...of 循环：允许遍历获得键值
```js
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

## 例子:forin-遍历对象
```js
function func() {
  const coinlist = {
    "SUSHIUSDT": {
      "symbol": "SUSHIUSDT",
      "amount": 0,
      "initialMargin": 0,
      "maintMargin": 0,
      "entryPrice": 0,
      "unrealizedProfit": 0,
      "leverage": 20
    },
    "BTSUSDT": {
      "symbol": "BTSUSDT",
      "amount": 0,
      "initialMargin": 0,
      "maintMargin": 0,
      "entryPrice": 0,
      "unrealizedProfit": 0,
      "leverage": 20
    }
  }

  for (let key in coinlist) {
    const { amount } = coinlist[key]
    if (amount !== 0) {
      console.log('key:', key, 'price:', coinlist[key]);
    }
  }
}

func();
```

## 例子2:forin-遍历数组
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
  }
]

function forinTest(res) {
  for (const key in res) {
    const {
      orderId,
      price,
      qty,
      quoteQty,
      time,
      isBuyer,
      isMaker,
    } = res[key]

    console.log('price:', price);
  }
}

forinTest(order)
```

## 例子3:实现深拷贝
参考：
01-深-浅-拷贝.md

实现深拷贝是将一个对象复制到一个新对象，同时确保复制的对象与原始对象完全独立，即使原始对象包含嵌套的对象也是如此。以下是一种实现深拷贝的方法：
这个 deepCopy 函数可以复制对象，包括嵌套的对象和数组。它递归地遍历对象的属性，以确保深层嵌套的对象也被复制。

>需要注意的是，这个方法仅适用于 JSON-serializable 对象，即不包括函数、循环引用等特殊情况。在复杂情况下，需要更复杂的深拷贝实现。

>使用 JSON.parse(JSON.stringify(obj)) 也是一种实现深拷贝的简便方法，但它也有一些限制，例如不能复制特殊对象（例如正则表达式）和循环引用。
```js
function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    const newArray = [];
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepCopy(obj[i]);
    }
    return newArray;
  }

  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }

  return newObj;
}
```
