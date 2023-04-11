## for in 会遍历数组所有的可枚举属性，包括原型

for 和 for/in 语句都可以迭代数组。for 语句需要配合 length 属性和数组下标来实现，执行效率没有 for/in 语句高。

另外，for/in 语句会跳过空元素。

对于超长数组来说，建议使用 for/in 语句进行迭代。 


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

## 运用2:实现深拷贝
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