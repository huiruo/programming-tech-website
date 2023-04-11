## str.split()
```js
/*
* 面试惨痛的教训:
* 以为字符分割不能是 空字符串
* */
let testStr = `  hello world  `;
const strArr = testStr.split('')
console.log(testStr.split(''))
```
