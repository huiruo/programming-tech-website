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

## 判读参数是否齐全
```javaScript
const arr = [1, 2, 3, 4, 5];
const element = 3;

if (arr.includes(element)) {
  console.log(`数组包含元素 ${element}`);
} else {
  console.log(`数组不包含元素 ${element}`);
}
```