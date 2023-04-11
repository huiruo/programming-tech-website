## doc
运算符操作函数
```
abs，取绝对值。
cmp，compare的缩写，即比较函数。
div，除法。
eq，equal的缩写，即相等比较。
gt，大于。
gte，小于等于，e表示equal。
lt，小于。
lte，小于等于，e表示equal。
minus，减法。
mod，取余。
plus，加法。
pow，次方。
prec，按精度舍入，参数表示整体位数。
round，按精度舍入，参数表示小数点后位数。
sqrt，开方。
times，乘法。
toExponential，转化为科学计数法，参数代表精度位数。
toFied，补全位数，参数代表小数点后位数。
toJSON和toString，转化为字符串。
toPrecision，按指定有效位数展示，参数为有效位数。
toNumber，转化为JavaScript中number类型。
valueOf，包含负号（如果为负数或者-0）的字符串。
```

## 方法
​https://mikemcl.github.io/big.js/​
加
```js
0.1 + 0.2                                // 0.30000000000000004
const x = new Big(0.1);
const y = x.plus(0.2);                   // 0.3
Big(0.7).plus(x).plus(y).toFixed(2);     // 1.1
```

减
```js
0.3 - 0.1                                // 0.19999999999999998   
const x = new Big(0.3);
const y = x.minus(0.1)                   // 0.2
(Big(0.7).minus(x).minus(y).toFixed(2)   // 0.2
```

乘
```js
0.6 * 3                    // 1.7999999999999998
x = new Big(0.6)
y = x.times(3)             // '1.8'
Big('7e+500').times(y)     // '1.26e+501'
```

除
```js
x = new Big(355)
y = new Big(113)
x.div(y)                   // '3.14159292035398230088'
Big.DP = 2
x.div(y)                   // '3.14'
x.div(5)                   // '71'
```