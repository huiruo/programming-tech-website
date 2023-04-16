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