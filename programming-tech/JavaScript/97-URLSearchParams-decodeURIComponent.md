## URLSearchParams

```javaScript
const testObj = {
    'timeStamp':'123',
    'nonceStr':'23',
    'wxPackage':'45',
    'signType':'58',
    'paySign':'89'
}

const params = new URLSearchParams(testObj).toString(); 
console.log(params);
```

## decodeURIComponent
```js
var encodedString = "/qu/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95/%E9%A1%BA%E5%BA%8F%E6%90%9C%E7%B4%A2-%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84%E6%90%9C%E7%B4%A2";
var decodedString = decodeURIComponent(encodedString);

console.log(decodedString);
```