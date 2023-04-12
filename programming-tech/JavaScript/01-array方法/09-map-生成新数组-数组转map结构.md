## 在forEach中return语句是没有任何效果的，而map则可以改变当前循环的值

返回一个新的被改变过值之后的数组（map需return），

一般用来处理需要修改某一个数组的值。
```
callback的参数:
        value --当前索引的值
        index --索引
        array --原数组
```

```js
let testArr1 = [1, 2, 3];
let testArr2 = testArr1.map((value, key, arr) => {
    console.log(value)    // 1，2，3
    console.log(key)      // 0，1，2
    console.log(arr)      //[1,2,3] [1,2,3] [1,2,3]
    return value * value;
})

console.log('原数组:', testArr1); // [ 1, 2, 3 ]
console.log('map后：', testArr2); // [ 1, 4, 9 ]
```

## 数组转map
```js
const arr = [
  { symbol: 'BTCUSDT', price: '23147.08000000' },
  { symbol: 'BNBUSDT', price: '312.90000000' },
  { symbol: 'ZENUSDT', price: '10.21000000' },
  { symbol: 'DOTUSDT', price: '6.27800000' },
  { symbol: 'OGUSDT', price: '2.77100000' },
  { symbol: 'SHIBUSDT', price: '0.00001186' },
  { symbol: 'APTUSDT', price: '16.97200000' }
]

const map = new Map(arr.map(item=>[item.symbol,item.price]))

console.log('map:',map)
console.log('map:',map.get('BTCUSDT'))
```