```js
const testArr = new Array(0, 1, 2, 3, 4);
console.log('to string1:', testArr.join(""))
console.log('to string2:', testArr.join("-"))
/*
to string1: 01234
to string2: 0-1-2-3-4
* */
```

## 带引号
```js
const symbols = ["BTCUSDT", "BNBUSDT"]
console.log(`?symbols=["${symbols.join('","')}"]`)
```