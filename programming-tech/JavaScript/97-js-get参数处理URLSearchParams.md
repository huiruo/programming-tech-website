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
