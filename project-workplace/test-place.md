
修改后
```js
function accAdd(arg1, arg2) {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }

  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

function accMul(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {}
  try {
    m += s2.split('.')[1].length
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}


function dealCartTotalPriceNoLogin() {
  const selectedArr = [
    { price: 0.02,itemNum: 3 },
    { price: 2,itemNum: 1 },
    { price: 2,itemNum: 1 },
    { price: 0.01,itemNum: 1 },
  ]

  let payAmount = selectedArr.reduce((total, value) => {
    const price = value.price * 100
    return accAdd(total, accMul(price, value.itemNum))
  }, 0)

  return payAmount / 100
}


console.log('payAmount',dealCartTotalPriceNoLogin())
```
