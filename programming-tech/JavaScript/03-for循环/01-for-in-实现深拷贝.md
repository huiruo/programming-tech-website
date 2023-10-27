## for in 会遍历数组所有的可枚举属性，包括原型

for 和 for/in 语句都可以迭代数组。for 语句需要配合 length 属性和数组下标来实现，执行效率没有 for/in 语句高。

另外，for/in 语句会跳过空元素。

对于超长数组来说，建议使用 for/in 语句进行迭代。 

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
```js
function deepCopy(obj) {
  let result = Array.isArray(obj) ? [] : {};
  // for in 会走原型链
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key]);   // 递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
```
